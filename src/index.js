// 1. Polyfills FIRST
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import 'react-app-polyfill/stable';
import 'react-app-polyfill/ie11';

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import './utils/globals'; // 引入全局变量设置

import { autoDetectLanguage } from './utils/i18nHelper.js';

import reportWebVitals from './reportWebVitals';

import { BrowserRouter } from 'react-router-dom';

// 等待polyfill加载完成的函数
const waitForPolyfills = () => {
  return new Promise((resolve) => {
    // 检查IE环境下的Promise polyfill
    if (window.Promise) {
      // polyfill已加载
      resolve();
    } else {
      // 如果没有Promise，等待下一轮事件循环
      setTimeout(resolve, 100);
    }
  });
};

// 主启动函数
const initializeApp = async () => {
  try {
    // 等待polyfill加载
    await waitForPolyfills();
    
    // 检测语言
    autoDetectLanguage();
    
    // 创建根节点
    const rootElement = document.getElementById('root');
    if (!rootElement) {
      throw new Error('找不到根元素 #root');
    }
    
    const root = ReactDOM.createRoot(rootElement);
    
    // 渲染应用
    root.render(
      <React.StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </React.StrictMode>
    );
    
    // 性能测量
    reportWebVitals();
    
  } catch (error) {
    console.error('应用初始化失败:', error);
    
    // 提供降级显示
    const rootElement = document.getElementById('root');
    if (rootElement) {
      rootElement.innerHTML = `
        <div style="
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          font-family: Arial, sans-serif;
          text-align: center;
          padding: 20px;
        ">
          <div>
            <h1>应用加载失败</h1>
            <p>${error.message}</p>
            <p>请刷新页面或联系支持团队</p>
          </div>
        </div>
      `;
    }
  }
};

// 确保DOM已加载
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}

// 导出以供测试
export { initializeApp };