import './SideBar.css';

import { useState, useEffect } from 'react';

import { sideBarDataModel, BarMenuType } from './BarMenuModel.js';

import useI18n from '../hooks/useI18n';
function SideBar( {isVisible, isManualClickedMoreMenuItem, onToggleMenuAction} ) {
    const [visible, setVisible] = useState(false);
    const { t } = useI18n();
    const [isClicked, setIsClicked] = useState(false); // 用于移除刚打开网页，或者刷新网页时的动画效果

    useEffect( () => {
        setVisible(isVisible);
    }, [isVisible]);

    useEffect( () => {
        if (isManualClickedMoreMenuItem) {
            if (isClicked === false) setIsClicked(true);
        }
    }, [isManualClickedMoreMenuItem]);
    
    function handleMenuEventClick(event) {
        const raw = event.currentTarget.dataset.index;
        const index = Number(raw);
        if (Number.isNaN(index)) {
            // 处理错误
            console.error('menu item index is not a number:', raw);
        } else {
            onToggleMenuAction(index);
        }
        
        return
    }

    function handleMenuClick(item) {
        onToggleMenuAction(item.type);
    }
    return (
        <div className={visible ? (isClicked ? 'sidebar active animation':'sidebar active') : (isClicked ? 'sidebar animation' : 'sidebar')}>
            <ul className='sidebar-items'>
                {
                    sideBarDataModel.map( (item, index) => {
                        return (
                            <li key={index} data-index={index} className="sidebar-item" onClick={ () => handleMenuClick(item)}>
                                <a link={item.path}>{item.icon} {t(item.title)}</a>
                            </li>
                        )
                    })
                }
            </ul>
        </div>
    )
}

export {SideBar, BarMenuType};