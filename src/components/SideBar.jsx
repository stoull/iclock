import './SideBar.css';

import { useState, useEffect } from 'react';

import { sideBarDataModel, BarMenuType } from './BarMenuModel.js';

function SideBar( {isVisible, onToggleMenuAction} ) {
    const [visible, setVisible] = useState(true);

    useEffect( () => {
        setVisible(isVisible);
    }, [isVisible]);
    
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
        <div className={visible ? 'sidebar active' : 'sidebar'}>
            <ul className='sidebar-items'>
                {
                    sideBarDataModel.map( (item, index) => {
                        return (
                            <li key={index} data-index={index} className="sidebar-item" onClick={ () => handleMenuClick(item)}>
                                <a link={item.path}>{item.icon} {item.title}</a>
                            </li>
                        )
                    })
                }
            </ul>
        </div>
    )
}

export {SideBar, BarMenuType};