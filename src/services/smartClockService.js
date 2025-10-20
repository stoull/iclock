import APIClient from './apiClient.js';
import { ResponseHelper } from './httpClient.js';


// 基础地址，可根据环境变量替换
export const BASE_URL = process.env.REACT_APP_API_BASE || 'https://ahut.site:8080/api/smart-clock';

export const API_PATHS = {
  tempInfo: '/temperature-humidity',
  tempHistory: '/temperature-humidity/history',
  surroundingsHistory: '/surroundings/history',
  testApiPath: '/test-api'
};

class SmartClockService {
  constructor(baseURL = BASE_URL) {
    this.baseURL = baseURL;
    this.apiClient = APIClient({ baseURL: baseURL });
  }

  // 获取当前温湿度信息
  async getCurrentTempInfo() {
    const url = API_PATHS.tempInfo;
    return this.apiClient.get(url);
  }
  
  // 获取测试API数据
  async getTestAPI() {
    const url = `${this.baseURL}${API_PATHS.testApiPath}`;
    const response = await this.apiClient.get(url, {raw: true});
    return ResponseHelper.json(response);
  }

  /**
   * 获取用户列表
   * @param {Object} params - 查询参数
   * @param {number} params.page - 页码
   * @param {number} params.limit - 每页数量
   * @param {string} params.search - 搜索关键词
   * @returns {Promise<Object>}
   */
  async getTempInfoHistory(params = { }) {
    const url = new URL(this.baseURL + API_PATHS.tempHistory);
    
    // 添加查询参数
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        url.searchParams.append(key, params[key]);
      }
    });
    return await this.apiClient.get(API_PATHS.tempHistory + url.search);
  }

  async askAIWithMessage(message) {
    const url = 'https://openrouter.ai/api/v1/chat/completions';
    
    const params = { message };
    const headers = {
      "Authorization": "Bearer <OPENROUTER_API_KEY>",
      "HTTP-Referer": "<YOUR_SITE_URL>", // Optional. Site URL for rankings on openrouter.ai.
      "X-Title": "<YOUR_SITE_NAME>", // Optional. Site title for rankings on openrouter.ai.
      "Content-Type": "application/json"
    }
    let body =  {
      "model": "x-ai/grok-code-fast-1",
      "messages": [
        {
          "role": "user",
          "content": message, 
        }
      ]
    };

    return await this.apiClient.post(url, body, { headers: headers } );
  }

}

// 导出单例实例
export default new SmartClockService();