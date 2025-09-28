import { useState, useEffect } from "react";

import './Home.css';

import DigitalClock from '../components/DigitalClock';
import TopMenuBar from '../components/TopMenuBar';
import {SideBar, BarMenuType} from '../components/SideBar';

const Home = () => {
  const [fontSize, setFontSize] = useState('16rem');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isShowSideBar, setIsShowSideBar] = useState(false);

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
 
  // isFullScreen, onToggleFullScreen, onIncrementFontSize,
  //  onDecrementFontSize, isShowSideBar, onToggleShowSideBar

  function handleToggleFullScreen() {
    setIsFullScreen( pre => !pre );
  }

  // 侧边栏的相关功能的方法
  // 当侧边栏的可见性变化时的回调
  function handleSideBarVisibleChange() {
    setIsShowSideBar( pre => !pre );
  }

  function handleBarMenuActions(menuItem) {
    console.log('menu item selected:', menuItem, typeof(menuItem), typeof(BarMenuType.HIDDENSIDEBAR), BarMenuType.HIDDENSIDEBAR);
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
        break;
      case BarMenuType.DARK_MODEL:
        // 切换到深色主题
        break;
      case BarMenuType.WALLPAPER:
        // 打开壁纸设置界面
        break;
      default:
        console.warn('Unhandled menu item type:', menuItem);
    }
  }

  return (
    <div className="home">
      <TopMenuBar 
      isFullScreen={isFullScreen}
      isShowSideBar={isShowSideBar}
      onToggleMenuAction={handleBarMenuActions}
      />
      <SideBar isVisible={isShowSideBar} onToggleMenuAction={handleBarMenuActions} />
      

      <div className="content">
        <DigitalClock fontSize={fontSize} />
      </div>
    </div>
  );
};

export default Home;
