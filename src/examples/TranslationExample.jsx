// 使用示例：如何处理缺失翻译的最佳实践
import { t, tWithFallback, tOptional, tSmart } from '../assets/i18n/translationHelpers.js';

// 示例组件
function ExampleComponent() {
  return (
    <div>
      {/* 1. 基本翻译 - 会显示缺失警告 */}
      <h1>{t('welcome')}</h1>
      
      {/* 2. 带后备文本的翻译 - 推荐用于重要内容 */}
      <h2>{tWithFallback('page.title', '页面标题')}</h2>
      
      {/* 3. 可选翻译 - 翻译不存在时不显示 */}
      <p>{tOptional('optional.description')}</p>
      
      {/* 4. 智能翻译 - 自动美化键名作为后备 */}
      <button>{tSmart('buttons.submitForm')}</button> {/* 缺失时显示 "Submit Form" */}
      
      {/* 5. 带变量的翻译 */}
      <p>{t('user.greeting', { name: 'John', count: 5 })}</p>
      
      {/* 6. 带上下文的翻译（用于调试） */}
      <span>{t('status.active', { context: 'user-profile' })}</span>
    </div>
  );
}

// 开发环境下的使用技巧
if (process.env.NODE_ENV === 'development') {
  // 在控制台查看缺失的翻译
  setTimeout(() => {
    console.log('Missing translations:', window.i18nDevTools?.getMissingTranslations());
  }, 2000);
}

export default ExampleComponent;
