import "./TopMenuBar.css";

import { BarMenuType, topMenuBarDataModel } from './BarMenuModel.js';

import { useState, useEffect, useRef } from "react";

function TopMenuBar ( {isFullScreen, isShowSideBar, onToggleIsManualClickedMoreMenuItem, onToggleMenuAction} ) {
    const isLoadedRef = useRef(false);
    const [isClicked, setIsClicked] = useState(false); // 用于移除刚打开网页，或者刷新网页时的动画效果

    useEffect( () => {
        isLoadedRef.current = true;
    }, []);

    function handleAnimationEnd(e) {
        if (e && e.animationName === 'showMoreMenu') {
            // 设置为动画结束后的值
            e.target.style.marginRight = '32px'; 
            e.target.style.transform = 'rotate(180deg)';
        } else if (e && e.animationName === 'hiddenMoreMenu') {
            // 设置为动画结束后的值 
           e.target.style.marginRight = '0px'; 
           e.target.style.transform = 'rotate(0deg)';
        }
    }

    function handleMenuclick(item) {
        if (isClicked === false && item.type === BarMenuType.MORE) {
            onToggleIsManualClickedMoreMenuItem(true);
            setIsClicked(true);
        }
        onToggleMenuAction(item.type);
    }

    const getMenuClassName = (isShowSideBar, isLoaded) => {
        const baseClass = 'more-menu-item';
        if (isShowSideBar) {
            return isClicked ? `${baseClass} animation active` : `${baseClass} active`;
        } else {
            return isClicked ? `${baseClass} animation` : baseClass;
        }
    };

    return (
        <div className="top-menu-bar">
           {
            topMenuBarDataModel.map( (item, index) => {
                if (item.type === BarMenuType.FULLSCREEN) {
                    return isFullScreen ? 
                    (<span key={index} data-index={index} onClick={ () => handleMenuclick(item)}> {item.statusIcon} </span>) :
                    (<span key={index} data-index={index} onClick={ () => handleMenuclick(item)}> {item.icon} </span>);
                }
                if (item.type === BarMenuType.MORE) {
                    return (<span key={index} data-index={index} className = {getMenuClassName(isShowSideBar, isLoadedRef.current)}
                        onClick={ () => handleMenuclick(item)}
                        onAnimationEnd={handleAnimationEnd}>
                             {item.icon} 
                        </span>);
                }
                return (<span key={index} data-index={index} onClick={ () => handleMenuclick(item)}> {item.icon} </span>)
            })
           } 
        </div>
    )
}

export default TopMenuBar;