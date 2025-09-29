import "./TopMenuBar.css";

import { BarMenuType, topMenuBarDataModel } from './BarMenuModel.js';

function TopMenuBar ( {isFullScreen, isShowSideBar, onToggleMenuAction} ) {

    function handleMenuClick(item) {
        onToggleMenuAction(item.type);
    }

    return (
        <div className="top-menu-bar">
           {
            topMenuBarDataModel.map( (item, index) => {
                if (item.type === BarMenuType.FULLSCREEN) {
                    return isFullScreen ? 
                    (<span key={index} data-index={index} onClick={ () => handleMenuClick(item)}> {item.statusIcon} </span>) :
                    (<span key={index} data-index={index} onClick={ () => handleMenuClick(item)}> {item.icon} </span>);
                }
                if (item.type === BarMenuType.MORE) {
                    return (<span key={index} data-index={index} className={ isShowSideBar ? "direction-rtl" : "direction-rtl active"} onClick={ () => handleMenuClick(item)}> {item.icon} </span>);
                }
                return (<span key={index} data-index={index} onClick={ () => handleMenuClick(item)}> {item.icon} </span>)
            })
           } 
        </div>
    )
}

export default TopMenuBar;