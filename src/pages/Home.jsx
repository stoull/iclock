import { useState, useEffect } from "react";

import './Home.css';

import { FullScreen, useFullScreenHandle } from "react-full-screen";

import DigitalClock from '../components/DigitalClock';
import TopMenuBar from '../components/TopMenuBar';
import {SideBar, BarMenuType} from '../components/SideBar';
import useI18n from '../hooks/useI18n'; 

import { setTheme } from '../utils/theme.js';

import { apiClient } from '../services/apiClient.js';
import { smartClockService } from '../services';

const Home = () => {
  const fullScreenHandle = useFullScreenHandle();
  const [fontSize, setFontSize] = useState('16rem');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isShowSideBar, setIsShowSideBar] = useState(false);
  const { locale, setLanguage } = useI18n();

  const [isManualClickedMoreMenuItem, setIsManualClickedMoreMenuItem] = useState(false); // 用于移除刚打开网页，或者刷新网页时的动画效果

  useEffect(() => {
    smartClockService.getCurrentTempInfo().then(data => {
      console.log('Home page request tempinfo sucessful: ', data);
    }).catch(err => {
      console.error('Home page request tempinfo failed: ', err);
    });
  }, []);

  // 顶部菜单栏相关功能的方法
  function handleDecrementFontSize() {
    setFontSize( preSize => {
      let preFloat = parseFloat(preSize);
      preFloat = preFloat > 2.0 ? preFloat : 2.0;
      return `${preFloat-1}rem`
    })
  }

  function handleIncrementFontSize() {
    console.log('increment font size');
    setFontSize( preSize => {
      let preFloat = parseFloat(preSize);
      preFloat = preFloat < 50.0 ? preFloat : 50.0;
      return `${preFloat+1}rem`
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

  function handleBarMenuActions(menuItem) {
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
      case BarMenuType.MORE:
        // 打开更多设置界面
        handleSideBarVisibleChange();
        break;

      case BarMenuType.SIDEBARVISIBLE:
        handleSideBarVisibleChange();
        break;
      case BarMenuType.LIGHT_MODEL:
        // 切换到浅色主题
        setTheme('light');
        break;
      case BarMenuType.DARK_MODEL:
        // 切换到深色主题
        setTheme('dark');
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
          </div>
      </FullScreen>
    </div>
  );
};

export default Home;
