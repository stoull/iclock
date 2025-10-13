/**
 * API配置和实例创建
 */
import HttpClient from './httpClient';

// API基础配置
const API_CONFIG = {
  baseURL: process.env.REACT_APP_API_BASE_URL || 'https://jsonplaceholder.typicode.com',
  timeout: 10000,
  retries: 2,
  retryDelay: 3000,
  headers: {
    'Content-Type': 'application/json',
  }
};

// 创建API客户端实例
const apiClient = new HttpClient(API_CONFIG);

// 添加请求拦截器 - 自动添加认证token
apiClient.addRequestInterceptor(
  (requestConfig, fetchOptions, url) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      requestConfig.headers.Authorization = `Bearer ${token}`;
    }
    // 添加请求ID用于追踪
    requestConfig.headers['X-Request-ID'] = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {requestConfig, fetchOptions, url};
  },
  (error) => {
    console.error('❌ Request Interceptor Error:', error);
    return Promise.reject(error);
  }
);

// 添加响应拦截器 - 处理通用错误和数据转换
apiClient.addResponseInterceptor(
  async (response) => {
    console.log('✅ Response:', response.status, response.url);
    
    // 检查响应状态
    if (response.status === 401) {
      // 未授权，清除token并跳转登录
      localStorage.removeItem('authToken');
      window.dispatchEvent(new CustomEvent('auth:logout'));
    }
    
    return response;
  },
  (error) => {
    console.error('❌ Response Interceptor Error:', error);
    
    // 可以在这里添加全局错误处理
    if (error.status === 403) {
      window.dispatchEvent(new CustomEvent('auth:forbidden'));
    } else if (error.status === 500) {
      window.dispatchEvent(new CustomEvent('app:serverError'));
    }
    
    return Promise.reject(error);
  }
);

// 添加响应拦截器 - 处理网络错误
apiClient.addErrorInterceptor(
  async (error) => {
    // 示例：简单打印
    // 你可以在这里做 toast、上报等
    console.error('[API ERROR]', error);
    return error;
  },
  (error) => {
    console.error('❌ Response Interceptor Error:', error);
    
    // 可以在这里添加全局错误处理
    if (error.status === 403) {
      window.dispatchEvent(new CustomEvent('auth:forbidden'));
    } else if (error.status === 500) {
      window.dispatchEvent(new CustomEvent('app:serverError'));
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;