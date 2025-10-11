import apiClient from './apiClient.js';
import { ResponseHelper } from './httpClient.js';


// 基础地址，可根据环境变量替换
export const BASE_URL = process.env.REACT_APP_API_BASE || 'https://ahut.site:8080/api/smart-clock';

export const API_PATHS = {
  tempInfo: '/temperature-humidity',
  tempHistory: '/temperature-humidity/history',
  surroundingsHistory: '/surroundings/history',
};

class SmartClockService {
  constructor(baseURL = BASE_URL) {
    this.baseURL = baseURL;
  }

  // 获取当前温湿度信息
  async getCurrentTempInfo() {
    const url = `${this.baseURL}${API_PATHS.tempInfo}`;
    console.log('Fetching current temperature info from:', url);
    return apiClient.get(url);
  }

    /**
   * 获取用户列表
   * @param {Object} params - 查询参数
   * @param {number} params.page - 页码
   * @param {number} params.limit - 每页数量
   * @param {string} params.search - 搜索关键词
   * @returns {Promise<Object>}
   */
  async getTempInfoHistory(params = {}) {
    const url = new URL(this.basePath, API_PATHS.tempHistory);
    
    // 添加查询参数
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        url.searchParams.append(key, params[key]);
      }
    });
    
    const response = await apiClient.get(url.pathname + url.search);
    return ResponseHelper.json(response);
  }

}

// 导出单例实例
export default new SmartClockService();