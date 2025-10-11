/**
 * 轻量 Fetch 封装：提供 timeout、retry、拦截器支持。
 */

class HttpClient {
  constructor(config = {}) {
    this.baseURL = config.baseURL || '';
    this.timeout = config.timeout || 10000;
    this.retries = config.retries || 0; // 默认不重试
    this.retryDelay = config.retryDelay || ((attempt) => 300 * Math.pow(2, attempt)); // 指数退避
    this.defaultHeaders = config.headers || {'Content-Type': 'application/json'};
    
    // 拦截器
    this.interceptors = {
      request: [], // (config) => config | Promise<config>
      response: [], // (response, requestConfig) => response | Promise
      error: [], // (error, requestConfig) => throw newError | Promise
    };
  }
  /**
   * 延迟函数
   * @param {number} ms 
   * @returns {Promise}
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 添加请求拦截器
   * @param {Function} fulfilled - 成功回调
   * @param {Function} rejected - 失败回调
   */
  addRequestInterceptor(fulfilled, rejected) {
    this.interceptors.request.push({ fulfilled, rejected });
  }

  /**
   * 添加响应拦截器
   * @param {Function} fulfilled - 成功回调
   * @param {Function} rejected - 失败回调
   */
  addResponseInterceptor(fulfilled, rejected) {
    this.interceptors.response.push({ fulfilled, rejected });
  }

  /**
   * 添加错误拦截器
   * @param {Function} fulfilled - 成功回调
   * @param {Function} rejected - 失败回调
   */
  addErrorInterceptor(fulfilled, rejected) {
    this.interceptors.error.push({ fulfilled, rejected });
  }

   /**
   * 执行请求拦截器
   * @param {Object} config 
   * @returns {Object}
   */
  async executeRequestInterceptors(requestConfig, fetchOptions, url) {
    let modifiedRequestConfig = requestConfig;
    let modifiedFetchOptions = fetchOptions;
    let modifiedUrl = url;
    for (const interceptor of this.interceptors.request) {
      try {
        if (interceptor.fulfilled) {
          const modifiedConfig = await interceptor.fulfilled(modifiedRequestConfig, modifiedFetchOptions, modifiedUrl);
          modifiedRequestConfig = modifiedConfig.requestConfig || modifiedRequestConfig;
          modifiedFetchOptions = modifiedConfig.fetchOptions || modifiedFetchOptions;
          modifiedUrl = modifiedConfig.url || modifiedUrl;
        }
      } catch (error) {
        if (interceptor.rejected) {
          throw await interceptor.rejected(error);
        }
        throw error;
      }
    }
    
    return {requestConfig: modifiedRequestConfig, fetchOptions: modifiedFetchOptions, url: modifiedUrl};
  }

  /**
   * 执行响应拦截器
   * @param {Response} response 
   * @returns {Response}
   */
  async executeResponseInterceptors(response) {
    let modifiedResponse = response;
    
    for (const interceptor of this.interceptors.response) {
      try {
        if (interceptor.fulfilled) {
          modifiedResponse = await interceptor.fulfilled(modifiedResponse);
        }
      } catch (error) {
        if (interceptor.rejected) {
          throw await interceptor.rejected(error);
        }
        throw error;
      }
    }
    
    return modifiedResponse;
  }
  
   /**
   * 执行响应拦截器
   * @param {Error} error 
   * @returns {Error}
   */
  async executeErrorInterceptors(error) {
    let modifiedError = error;
    
    for (const interceptor of this.interceptors.error) {
      try {
        if (interceptor.fulfilled) {
          modifiedError = await interceptor.fulfilled(modifiedError);
        }
      } catch (error) {
        if (interceptor.rejected) {
          throw await interceptor.rejected(error);
        }
        throw error;
      }
    }
    
    return modifiedError;
  }

  /**
   * 执行错误拦截器
   * @param {Response} response 
   * @returns {Response}
   */
  async executeErrorInterceptors(response) {
    let modifiedResponse = response;
    
    for (const interceptor of this.interceptors.error) {
      try {
        if (interceptor.fulfilled) {
          modifiedResponse = await interceptor.fulfilled(modifiedResponse);
        }
      } catch (error) {
        if (interceptor.rejected) {
          throw await interceptor.rejected(error);
        }
        throw error;
      }
    }
    
    return modifiedResponse;
  }

  /**
   * 核心请求方法
   * @param {string} method
   * @param {string} url
   * @param {Object} options
   * @returns {Promise}
   */
  async coreRequest(method, url, options = {}) {
    const requestConfig = {
      method,
      url,
      baseURL: this.baseURL,
      headers: { ...this.defaultHeaders, ...(options.headers || {}) },
      timeout: options.timeout ?? this.timeout,
      retries: options.retries ?? this.retries,
      retryDelay: options.retryDelay || this.retryDelay,
      query: options.query,
      body: options.body,
      raw: options.raw || false, // 是否直接返回 Response
      parse: options.parse || 'json', // json / text / blob / arrayBuffer
      signal: options.signal,
    };

    // 构建最终 URL
    let fullUrl = url.startsWith('http') ? url : `${this.baseURL}${url}`;
    if (requestConfig.query) fullUrl += this.buildQuery(requestConfig.query);

    // 构建 fetch 选项
    let fetchOptions = {
      method: requestConfig.method,
      headers: requestConfig.headers,
      signal: requestConfig.signal,
    };

    // 处理 body 序列化
    // 外层已序列化
    // const bodyData = this.serializeData(requestConfig.body, fetchOptions.headers);
    if (requestConfig.body !== undefined && requestConfig.body !== null) {
        // fetchOptions.body = bodyData; 
        fetchOptions.body = requestConfig.body;
    }

    // 执行请求request拦截器 (拦截器中可以修改 requestConfig / fetchOptions)
    const intercepted = await this.executeRequestInterceptors(requestConfig, fetchOptions, fullUrl);
    Object.assign(requestConfig, intercepted.requestConfig || {});
    fetchOptions = intercepted.fetchOptions || fetchOptions;
    fullUrl = intercepted.url || fullUrl;

    return this.executeWithRetry(fullUrl, fetchOptions, requestConfig);
  }

  
  /**
   * 带重试的请求执行
   * @param {Object} config 
   * @returns {Promise}
   */
  async executeWithRetry(fullUrl, fetchOptions, requestConfig) {
    let lastError;
    const maxAttempts = this.retries + 1;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const res = await this.fetchWithTimeout(fullUrl, { ...fetchOptions, timeout: requestConfig.timeout });
        // response 拦截器
        const finalRes = await this.executeResponseInterceptors(res);
        if (!finalRes.ok) {
          const err = new Error(`HTTP ${finalRes.status}`);
          err.status = finalRes.status;
          throw err;
        }
        if (requestConfig.raw) return finalRes;
        switch (requestConfig.parse) {
          case 'text':
            return finalRes.text();
          case 'blob':
            return finalRes.blob();
          case 'arrayBuffer':
            return finalRes.arrayBuffer();
          case 'json':
          default:
            return finalRes.status === 204 ? null : finalRes.json();
        }
      } catch (error) {
        console.log('the last error', error);
        lastError = error;
        // error 拦截器
        await this.executeErrorInterceptors(error);

        // 如果是最后一次尝试，或者错误不应该重试，直接抛出
        if (attempt === maxAttempts || !this.shouldRetry(error)) {
          throw this.handleError(error);
        }

        const delayMs = requestConfig.retryDelay(attempt);
        attempt += 1;
        if (delayMs > 0) await this.delay(delayMs);
        continue;
      }
    }
    throw this.handleError(lastError);
}
  
  /**
  * 构造带超时的 fetch
  */
  async fetchWithTimeout(resource, options = {}) {
    const { timeout = this.timeout, signal } = options;
    if (timeout === 0) return fetch(resource, options); // 0 表示不超时
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(new Error('请求超时')), timeout);
    const signals = [];
    if (signal) signals.push(signal);
    signals.push(controller.signal);

    const composite = new AbortController();
    signals.forEach(s => s && s.addEventListener('abort', () => composite.abort()));

    try {
        const res = await fetch(resource, { ...options, signal: composite.signal });
        return res;
    } finally {
        clearTimeout(id);
    }
  }


   /**
   * 判断错误是否应该重试
   * @param {Error} error 
   * @returns {boolean}
   */
  shouldRetry(error) {
    // 网络错误、超时、5xx服务器错误可以重试
    if (error.name === 'AbortError') return true; // 超时
    if (error.name === 'TypeError') return true; // 网络错误
    if (error.status >= 500) return true; // 服务器错误
    
    return false;
  }

  /**
   * 错误处理
   * @param {Error} error 
   * @returns {Error}
   */
  handleError(error) {
    if (error.name === 'AbortError') {
      return new HttpError('Request timeout', 408, null);
    }
    
    if (error.name === 'TypeError') {
      return new HttpError('Network error', 0, null);
    }

    return error;
  }

  /**
   * GET请求
   * @param {string} url 
   * @param {Object} options 
   * @returns {Promise}
   */
  async get(url, options = {}) {
    return this.coreRequest('GET', url, {...options, method: 'GET' });
  }

  /**
   * POST请求
   * @param {string} url 
   * @param {any} data 
   * @param {Object} options 
   * @returns {Promise}
   */
  async post(url, data, options = {}) {
    return this.request('POST', url, {
      ...options,
      body: this.serializeData(data, options.headers)
    });
  }

  /**
   * PUT请求
   * @param {string} url 
   * @param {any} data 
   * @param {Object} options 
   * @returns {Promise}
   */
  async put(url, data, options = {}) {
    return this.request('PUT', url, {
      ...options,
      body: this.serializeData(data, options.headers)
    });
  }

  /**
   * PATCH请求
   * @param {string} url 
   * @param {any} data 
   * @param {Object} options 
   * @returns {Promise}
   */
  async patch(url, data, options = {}) {
    return this.request('PATCH', url, {
      ...options,
      body: this.serializeData(data, options.headers)
    });
  }

  /**
   * DELETE请求
   * @param {string} url 
   * @param {Object} options 
   * @returns {Promise}
   */
  async delete(url, options = {}) {
    return this.request('DELETE', url, { ...options, method: 'DELETE' });
  }

   /**
    * 默认的简易序列化 query
   */
  buildQuery(params) {
    if (!params) return '';
    const usp = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
        if (v === undefined || v === null) return;
        if (Array.isArray(v)) v.forEach(item => usp.append(k, item));
        else usp.append(k, v);
    });
    const s = usp.toString();
    return s ? `?${s}` : '';
  }

  /**
   * 数据序列化
   * @param {any} data 
   * @param {Object} headers 
   * @returns {string|FormData}
   */
  serializeData(data, headers = {}) {
    if (!data) return undefined;

    const contentType = headers['Content-Type'] || headers['content-type'];

    if (data instanceof FormData) {
      return data;
    }

    if (contentType && contentType.includes('application/x-www-form-urlencoded')) {
      return new URLSearchParams(data).toString();
    }

    if (typeof data === 'object') {
      return JSON.stringify(data);
    }

    return data;
  }
}

  /**
 * 自定义HTTP错误类
 */
class HttpError extends Error {
  constructor(message, status, response) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.response = response;
  }
}

/**
 * 响应数据解析助手
 */
class ResponseHelper {
  static async json(response) {
    try {
      return await response.json();
    } catch (error) {
      throw new Error('Invalid JSON response');
    }
  }

  static async text(response) {
    return await response.text();
  }

  static async blob(response) {
    return await response.blob();
  }

  static async formData(response) {
    return await response.formData();
  }
}


export { HttpClient, HttpError, ResponseHelper };
export default HttpClient;