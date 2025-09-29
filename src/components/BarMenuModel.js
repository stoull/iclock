import { AiOutlineFullscreenExit, AiOutlineFullscreen, AiOutlineMinus, AiOutlinePlus, AiOutlineDoubleRight, AiOutlineBgColors, AiOutlineMoon, AiOutlineSun, AiOutlineTranslation } from "react-icons/ai";

const BarMenuType = Object.freeze({
    SIDEBARVISIBLE: 0,
    LIGHT_MODEL: 1,
    DARK_MODEL: 2,
    WALLPAPER: 3,
    LANGUAGE: 4,

    FONTSIZEPLUS: 11,
    FONTSIZEMINUS: 12,
    FULLSCREEN: 13,
    MORE: 14
});
const sideBarDataModel = [
    {
        title: '',
        path: '/',
        icon: <AiOutlineDoubleRight />,
        type: BarMenuType.SIDEBARVISIBLE
    },
    {
        title: 'theme.light',
        path: '/ThemeModel',
        icon: <AiOutlineSun />,
        type: BarMenuType.LIGHT_MODEL
    },
    {
        title: 'theme.dark',
        path: '/ThemeModel',
        icon: <AiOutlineMoon />,
        type: BarMenuType.DARK_MODEL
    }, 
    {
        title: 'theme.wallpaper',
        path: '/ThemeModel',
        icon: <AiOutlineBgColors />,
        type: BarMenuType.WALLPAPER
    },
    {
        title: 'theme.language',
        path: '/LanguageModel',
        icon: <AiOutlineTranslation />,
        type: BarMenuType.LANGUAGE
    },
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