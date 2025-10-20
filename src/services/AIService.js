import APIClient from './apiClient.js';
import { ResponseHelper } from './httpClient.js';


// 基础地址，可根据环境变量替换
export const BASE_URL = process.env.REACT_APP_API_BASE || 'https://openrouter.ai/api/v1/';

export const API_PATHS = {
  chat: '/chat/completions',
};

class AIService {
  constructor(baseURL = BASE_URL) {
    this.baseURL = baseURL;
    this.apiClient = APIClient({ baseURL: baseURL });
  }

  async askAIWithMessage(message) {
    const url = `${this.baseURL}${API_PATHS.chat}`;
    
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