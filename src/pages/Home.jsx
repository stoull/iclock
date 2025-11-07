import { useState, useEffect } from "react";

import './Home.css';

import { FullScreen, useFullScreenHandle } from "react-full-screen";

import DigitalClock from '../components/DigitalClock';
import TopMenuBar from '../components/TopMenuBar';
import {SideBar, BarMenuType} from '../components/SideBar';
import TempHumiBoard from '../components/TemperatureAndHumidity/TempHumiBoard';
import Widgets from '../components/Widgets'
import useI18n from '../hooks/useI18n'; 

import { usePreferences } from '../contexts/APPContext';

const Home = () => {
  const fullScreenHandle = useFullScreenHandle();
  const { locale, setLanguage } = useI18n();
  const { preferences, updatePreferences} = usePreferences(); 
  // 使用preferences中的值初始化fontSize
  const [fontSize, setFontSize] = useState(preferences.clock_font_size);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isShowSideBar, setIsShowSideBar] = useState(false);
  const [reloadWidgetsTrigger, setReloadWidgetsTrigger] = useState(0); // 添加触发器状态
  const [updateTrigger, setUpdateTrigger] = useState(0);

  const [isManualClickedMoreMenuItem, setIsManualClickedMoreMenuItem] = useState(false); // 用于移除刚打开网页，或者刷新网页时的动画效果

  // 监听preferences变化，同步fontSize
  useEffect(() => {
    if (preferences.clock_font_size) {
      setFontSize(preferences.clock_font_size);
    }
  }, [preferences.clock_font_size]);

  // 每5分钟整时定时器
  useEffect(() => {
    // 首次执行时设置定时器
    const initialDelay = getDelayToNext5Minutes();
    console.log(`首次定时器将在 ${initialDelay / 1000} 秒后触发`);
    
    const initialTimer = setTimeout(() => {
      scheduleContentUpdate();
      
      // 之后每5分钟执行一次
      const intervalId = setInterval(() => {
        scheduleContentUpdate();
      }, 5 * 60 * 1000); // 5分钟
      
      // 清理函数中也要清除interval
      return () => clearInterval(intervalId);
    }, initialDelay);

    // 清理函数
    return () => {
      clearTimeout(initialTimer);
    };
  }, []);

  // 计算到下一个5分钟整时的延迟时间
  // 📌 注意：每次组件渲染时，这个函数都会重新创建（重新定义）
  function getDelayToNext5Minutes() {
    const now = new Date();
    const currentMinutes = now.getMinutes();
    const currentSeconds = now.getSeconds();
    const currentMilliseconds = now.getMilliseconds();
    
    // 计算到下一个5分钟整时还需要多少分钟
    const minutesToNext5 = 5 - (currentMinutes % 5);
    // 转换为毫秒，并减去当前的秒和毫秒
    const delay = (minutesToNext5 * 60 - currentSeconds) * 1000 - currentMilliseconds;
    
    return delay;
  }

  // 定时任务执行函数
  function scheduleContentUpdate() {
    const now = new Date();
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();
    
    // 判断是否为半小时整点（00分或30分）
    if (currentMinutes === 0 || currentMinutes === 30) {
      if (currentMinutes === 0) {
        // console.log('触发整小时任务');
        // 在这里执行整小时的任务
      } else {
        // console.log('触发半小时任务');
        // 在这里执行半小时的任务
        triggerWidgetsUpdate();
      }

      // 特定时间点任务
      if (currentHours === 7 && currentMinutes === 0) {
       // 早上7点，更新回到用户手动选择的字体大小和主题 
       updatePreferences({ theme: preferences.theme_manual, clock_font_size: preferences.clock_font_size_manual }); 
       setFontSize(preferences.clock_font_size_manual);
      } else if (currentHours === 21 && currentMinutes === 0) {
        // 提醒晚上了

      } else if (currentHours === 22 && currentMinutes === 0) {
        // 强制切换到深色主题和大字体，哈哈哈，并提醒快玩了，快准备睡觉
        updatePreferences({ theme : 'dark', clock_font_size : '22rem' });
        setFontSize('22rem') 
      }
    } else {
      // console.log('普通5分钟定时任务');
      // 在这里执行普通的5分钟任务
      setUpdateTrigger( prev => prev + 1);
    }
  }

  // 处理顶部菜单栏的操作
  function handleBarMenuActions(menuItem) {
    console.log('Home: handleBarMenuActions called, menuItem:', menuItem);
    switch (menuItem) {
      case BarMenuType.FONTSIZEPLUS:
        handleIncrementFontSize();
        break;
      case BarMenuType.FONTSIZEMINUS:
        handleDecrementFontSize();
        break;
      case BarMenuType.FULLSCREEN:
        handleToggleFullScreen();
        break;
      case BarMenuType.RELOAD:
        triggerWidgetsUpdate();
        break;
      case BarMenuType.MORE:
        // 打开更多设置界面
        handleSideBarVisibleChange();
        break;

      case BarMenuType.SIDEBARVISIBLE:
        handleSideBarVisibleChange();
        break;
      case BarMenuType.LIGHT_MODEL:
        // 切换到浅色主题
        updatePreferences({ theme : 'light' }); // 真正切换主题
        updatePreferences({ theme_manual : 'light' }); // 用于记录手动选择，在自动模式切换时使用
        break;
      case BarMenuType.DARK_MODEL:
        // 切换到深色主题
        updatePreferences({ theme : 'dark' }) // 真正切换主题;
        updatePreferences({ theme_manual : 'dark' }) // 用于记录手动选择，在自动模式切换时使用;
        break;
      case BarMenuType.WALLPAPER:
        // 打开壁纸设置界面
        break;
      case BarMenuType.LANGUAGE:
        handleLanguageChange();
        break;
      default:
        console.warn('Unhandled menu item type:', menuItem);
    }
  }

    // 顶部菜单栏相关功能的方法
  function handleDecrementFontSize() {
    setFontSize( preSize => {
      let preFloat = parseFloat(preSize);
      preFloat = preFloat > 2.0 ? preFloat : 2.0;
      const newSize = `${preFloat-1}rem`;
      // 同时更新preferences
      updatePreferences({ clock_font_size: newSize });
      updatePreferences({ clock_font_size_manual: newSize }); // 用于记录手动选择，在自动模式切换时使用;
      return newSize;
    })
  }

  function handleIncrementFontSize() {
    setFontSize( preSize => {
      let preFloat = parseFloat(preSize);
      preFloat = preFloat < 50.0 ? preFloat : 50.0;
      const newSize = `${preFloat+1}rem`;
      // 同时更新preferences
      updatePreferences({ clock_font_size: newSize });
      updatePreferences({ clock_font_size_manual: newSize }); // 用于记录手动选择，在自动模式切换时使用;
      return newSize;
    })
  }
 

    function handleToggleFullScreen() {
    // 不再手动设置状态，让 onChange 回调来处理
    if (isFullScreen) {
      fullScreenHandle.exit();
    } else {
      fullScreenHandle.enter();
    }
  }

  // 侧边栏的相关功能的方法
  // 当侧边栏的可见性变化时的回调
  function handleSideBarVisibleChange() {
    setIsShowSideBar( pre => !pre );
  }

  function handleLanguageChange() {
    const current = locale;
    const isZh = String(current).toLowerCase().includes('zh');
    if (isZh) setLanguage('en'); else setLanguage('zh-Hant');
  }

  // 用于移除刚打开网页，或者刷新网页时的动画效果
  function handleIsManualClickedMoreMenuItem(value) {
    if (value !== isManualClickedMoreMenuItem) {
      setIsManualClickedMoreMenuItem(value);
    }
  }

  // 处理全屏状态变化的回调（包括ESC键退出）
  function handleFullScreenChange(state) {
    // console.log('全屏状态变化:', state ? '进入全屏' : '退出全屏');
    setIsFullScreen(state);
  }

  function onTriggerWidgetsUpdate() {
     // 组件更新回调
    console.log('Home: Widgets 组件更新了回调 '); 
  }

  function triggerWidgetsUpdate() {
    setReloadWidgetsTrigger(prev => prev + 1);
  }

  return (
    <div className="home">
      <FullScreen 
        className="fullscreen-container" 
        handle={fullScreenHandle}
        onChange={handleFullScreenChange}
      >
        <TopMenuBar 
          isFullScreen={isFullScreen}
          isShowSideBar={isShowSideBar}
          onToggleIsManualClickedMoreMenuItem = {handleIsManualClickedMoreMenuItem}
          onToggleMenuAction={handleBarMenuActions}
          />
          <SideBar isVisible={isShowSideBar} isManualClickedMoreMenuItem={isManualClickedMoreMenuItem} onToggleMenuAction={handleBarMenuActions} />
          

          <div className="content">
            <DigitalClock fontSize={fontSize} />
            <TempHumiBoard fontSize={fontSize} updateTrigger={updateTrigger} />
            <Widgets reloadTrigger={reloadWidgetsTrigger} onTriggerReload={onTriggerWidgetsUpdate} />
          </div>
      </FullScreen>
    </div>
  );
};

export default Home;
