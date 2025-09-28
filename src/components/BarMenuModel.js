import { AiOutlineFullscreenExit, AiOutlineFullscreen, AiOutlineMinus, AiOutlinePlus, AiOutlineDoubleRight, AiOutlineBgColors, AiOutlineMoon, AiOutlineSun } from "react-icons/ai";

const BarMenuType = Object.freeze({
    SIDEBARVISIBLE: 0,
    LIGHT_MODEL: 1,
    DARK_MODEL: 2,
    WALLPAPER: 3,

    FONTSIZEPLUS: 4,
    FONTSIZEMINUS: 5,
    FULLSCREEN: 6,
    MORE: 7
});

const sideBarDataModel = [
    {
        title: '',
        path: '/',
        icon: <AiOutlineDoubleRight />,
        type: BarMenuType.SIDEBARVISIBLE
    },
    {
        title: 'Light',
        path: '/ThemeModel',
        icon: <AiOutlineSun />,
        type: BarMenuType.LIGHT_MODEL
    },
    {
        title: 'Dark',
        path: '/ThemeModel',
        icon: <AiOutlineMoon />,
        type: BarMenuType.DARK_MODEL
    },
    {
        title: 'Wallpaper',
        path: '/ThemeModel',
        icon: <AiOutlineBgColors />,
        type: BarMenuType.WALLPAPER
    }
]

const topMenuBarDataModel = [
    {
        title: 'Plus',
        path: '',
        icon: <AiOutlinePlus/>,
        type: BarMenuType.FONTSIZEPLUS
    },
    {
        title: 'Minus',
        path: '',
        icon: <AiOutlineMinus />,
        type: BarMenuType.FONTSIZEMINUS
    },
    {
        title: 'FullScreen',
        path: '/ThemeModel',
        icon: <AiOutlineFullscreen />,
        statusIcon: <AiOutlineFullscreenExit />,
        type: BarMenuType.FULLSCREEN
    },
    {
        title: 'More',
        path: '/ThemeModel',
        icon: <AiOutlineDoubleRight />,
        type: BarMenuType.MORE
    }
]

export { sideBarDataModel, BarMenuType, topMenuBarDataModel };