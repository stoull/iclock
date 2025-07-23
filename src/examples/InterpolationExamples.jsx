// 插值（Interpolation）使用示例
import i18n from '../assets/i18n/i18n.js';
import { useState, useEffect } from 'react';

// 1. 基本插值使用
function BasicInterpolationExample() {
  const userName = "张三";
  const messageCount = 5;
  
  return (
    <div>
      {/* 基本变量插值 */}
      <h1>{i18n.t('user.greeting', { name: userName })}</h1>
      {/* 输出：你好，张三！ */}
      
      {/* 数字插值 */}
      <p>{i18n.t('user.stats', { count: messageCount })}</p>
      {/* 输出：您有5条消息 */}
      
      {/* 日期插值 */}
      <p>{i18n.t('user.lastLogin', { date: new Date().toLocaleDateString() })}</p>
      {/* 输出：上次登录：2025/7/23 */}
    </div>
  );
}

// 2. 使用默认变量（来自插值配置）
function DefaultVariablesExample() {
  return (
    <div>
      {/* 使用配置中的默认变量 */}
      <h1>{i18n.t('app.title')}</h1>
      {/* 输出：欢迎使用iClock */}
      
      <footer>{i18n.t('app.footer')}</footer>
      {/* 输出：iClock v1.0.0 - 保留所有权利 */}
    </div>
  );
}

// 3. 复杂插值示例
function AdvancedInterpolationExample() {
  const user = {
    name: "李四",
    role: "管理员",
    lastActive: new Date(),
    permissions: ["read", "write", "admin"]
  };
  
  return (
    <div>
      {/* 复杂对象插值 */}
      <p>{i18n.t('user.profile', { name: user.name })}</p>
      
      {/* 条件插值 */}
      <p>{i18n.t('user.stats', { 
        count: user.permissions.length,
        type: user.permissions.length > 1 ? '权限' : '权限'
      })}</p>
      
      {/* 格式化插值 */}
      <p>{i18n.t('user.lastLogin', { 
        date: user.lastActive.toLocaleString('zh-CN')
      })}</p>
    </div>
  );
}

// 4. 处理缺失变量的示例
function MissingVariableExample() {
  return (
    <div>
      {/* 缺失变量会使用插值配置中的处理器 */}
      <p>{i18n.t('user.greeting')}</p>
      {/* 输出：你好，[name]！（因为没有提供 name 变量） */}
      
      {/* 提供部分变量 */}
      <p>{i18n.t('app.footer', { version: '2.0.0' })}</p>
      {/* 输出：iClock v2.0.0 - 保留所有权利（appName 来自默认配置） */}
    </div>
  );
}

// 5. 动态插值示例（实际应用场景）
function DynamicInterpolationExample() {
  const [user, setUser] = useState({ name: '', messageCount: 0 });
  
  useEffect(() => {
    // 模拟从 API 获取用户数据
    // fetchUserData().then(userData => {
    //   setUser(userData);
    // });
  }, []);
  
  return (
    <div>
      <h1>{i18n.t('user.greeting', { name: user.name || '用户' })}</h1>
      <p>{i18n.t('user.stats', { count: user.messageCount })}</p>
      
      {/* 动态切换语言时，插值也会自动更新 */}
      <button onClick={() => i18n.locale = 'en'}>
        Switch to English
      </button>
    </div>
  );
}

// 6. 自定义插值处理
function CustomInterpolationExample() {
  // 可以在翻译调用时提供函数作为变量
  const formatNumber = (num) => num.toLocaleString();
  const formatDate = (date) => date.toLocaleDateString('zh-CN');
  
  return (
    <div>
      <p>{i18n.t('user.stats', { 
        count: formatNumber(1234567) // 格式化大数字
      })}</p>
      {/* 输出：您有1,234,567条消息 */}
      
      <p>{i18n.t('user.lastLogin', { 
        date: formatDate(new Date())
      })}</p>
    </div>
  );
}

export {
  BasicInterpolationExample,
  DefaultVariablesExample,
  AdvancedInterpolationExample,
  MissingVariableExample,
  DynamicInterpolationExample,
  CustomInterpolationExample
};
