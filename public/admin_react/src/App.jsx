import { useState, lazy, useEffect, useMemo, useRef } from 'react';
import { useRoutes, useLocation } from "react-router-dom";
import { deepClone, isMobileFun, storage, colorHsb } from '@/common/function';
import { ConfigProvider, theme, App } from 'antd';
import { useSnapshot } from 'valtio';
import { setAdminUserStore } from '@/store/adminUser';
import { menuAuthStore, setMenuAuthStore } from '@/store/menuAuth';
import { layoutSettingStore, setLayoutSettingStore } from '@/store/layoutSetting';
import { adminUserApi } from '@/api/adminUser';
import { loginAction } from '@/common/loginAction';
import { useMount, useDebounceFn } from 'ahooks';
import { config } from '@/common/config';
import { router } from './router';
import LazyLoad from '@/component/lazyLoad/index';
import RenderEmpty from '@/component/renderEmpty/index';
import 'dayjs/locale/zh-cn';
import zhCN from 'antd/locale/zh_CN';
import './App.css';
import '@/static/iconfont/iconfont.css';

// 导入所有的页面，异步加载，要除开component 跟 components文件夹内的
const routeAllPathToCompMap = import.meta.glob([
    `./pages/**/*index.jsx`,
    `!./**/components/**/*index.jsx`, // 除开的此文件
    `!./**/component/**/*index.jsx`, // 除开的此文件
]);

const Error = lazy(() => import('@/pages/error/index'));

// 提取常量
const APP_TITLE = config.projectName;

// 提取工具函数
const htmlClass = (className, type = 'add') => {
    const htmlEl = document.querySelector('html');
    if (!htmlEl) return;

    if (type === 'add') {
        htmlEl.classList.add(className);
    } else if (type === 'remove') {
        htmlEl.classList.remove(className);
    }
};

// 自定义Hook：移动端检测
const useMobileDetection = () => {
    const { run: debounceSettingMobile } = useDebounceFn(
        () => {
            const isMobile = isMobileFun();
            htmlClass('sa-mobile', isMobile ? 'add' : 'remove');

            setLayoutSettingStore(prev => ({
                ...prev,
                isMobile,
                layoutValue: isMobile ? 'slide' : prev.layoutValue,
                antdThemeValue: isMobile ? 'default' : prev.antdThemeValue,
            }));
        },
        { wait: 300 },
    );

    return debounceSettingMobile;
};

// 自定义Hook：动态路由生成
const useDynamicRoutes = (menuArrAll) => {
    const [routes, setRoutes] = useState(router);

    useEffect(() => {
        const generateElement = (item) => {
            let element = (
                <LazyLoad>
                    <Error />
                </LazyLoad>
            );

            if (item.type === 4) {
                // iframe页面
                const Elm = lazy(routeAllPathToCompMap[`./pages/iframe/index.jsx`]);
                element = (
                    <LazyLoad>
                        <Elm url={item.url} />
                    </LazyLoad>
                );
            } else if (item.type === 7) {
                // 配置页面
                const Elm = lazy(routeAllPathToCompMap[`./pages/config/updateConfig/index.jsx`]);
                element = (
                    <LazyLoad>
                        <Elm name={item.name.replace("config_", "")} />
                    </LazyLoad>
                );
            } else if (routeAllPathToCompMap[`./pages${item.component_path}/index.jsx`]) {
                const Elm = lazy(routeAllPathToCompMap[`./pages${item.component_path}/index.jsx`]);
                element = (
                    <LazyLoad>
                        <Elm />
                    </LazyLoad>
                );
            }
            return element;
        };

        // 固定路由
        const result = [...router];
        // 插入新路由
        menuArrAll.forEach(item => {
            if (result[1]?.children) {
                result[1].children.push({
                    path: item.path,
                    title: item.title,
                    element: generateElement(item)
                });
            }
        });

        setRoutes(result);
    }, [menuArrAll]);

    return routes;
};


// 自定义Hook：页面标题和菜单状态管理
const usePageTitleAndMenu = (menuArrAll, location) => {
    const locationRef = useRef(location.pathname);
    const initializedRef = useRef(false);

    useEffect(() => {
        // 如果菜单数据为空，不执行
        if (!menuArrAll || menuArrAll.length === 0) {
            return;
        }

        // 首次加载或路径变化时执行
        if (!initializedRef.current || location.pathname !== locationRef.current) {
            initializedRef.current = true;
            locationRef.current = location.pathname;

            // 使用Map提高查找效率
            const menuMap = new Map();
            menuArrAll.forEach(item => {
                menuMap.set(item.path, item);
            });

            const currentMenuItem = menuMap.get(location.pathname);
            if (!currentMenuItem) return;

            // 设置页面标题
            let pageTitle = '';
            currentMenuItem.pid_name_path.forEach(name => {
                menuArrAll.some(item => {
                    if (item.name === name) {
                        pageTitle += `-${item.title}`;
                        return true;
                    }
                    return false;
                });
            });

            document.title = `${APP_TITLE}${pageTitle}`;

            // 设置菜单展开、选中项
            const activeMenuPath = currentMenuItem.pid_name_path.map(name => name.toString());
            setMenuAuthStore(prev => ({
                ...prev,
                activeMenuPath,
                openKeys: activeMenuPath,
                activeData: currentMenuItem
            }));
        }
    }, [location.pathname, menuArrAll]); // 依赖 menuArrAll 也很重要
};

// 自定义Hook：主题样式管理
const useThemeStyles = (layoutSetting) => {
    const [appStyle, setAppStyle] = useState({ minHeight: '100vh' });

    useEffect(() => {
        const updateStyles = () => {
            // 批量更新html类名
            const classUpdates = [
                { className: 'sa-filter', condition: layoutSetting.bodyFilterValue },
                { className: 'sa-antd-dark', condition: layoutSetting.antdThemeValue === 'dark' },
                { className: 'sa-antd-simple', condition: layoutSetting.themeSimple },
                { className: 'sa-is-radius', condition: layoutSetting.isRadius }
            ];

            classUpdates.forEach(({ className, condition }) => {
                htmlClass(className, condition ? 'add' : 'remove');
            });

            // 更新应用样式
            if (layoutSetting.themeSimple && layoutSetting.antdThemeValue !== 'dark') {
                const backgroundHsb = colorHsb(layoutSetting.primaryColorValue);
                setAppStyle({
                    backgroundColor: `hsla(${backgroundHsb[0]}, 100%, 96%, 1)`,
                    backgroundImage: `
                        radial-gradient(at 13% 5%, hsla(${backgroundHsb[0]}, 100%, 37%, 0.29) 0px, transparent 50%),
                        radial-gradient(at 100% 100%, hsla(254, 66%, 56%, 0.11) 0px, transparent 50%),
                        radial-gradient(at 0% 100%, hsla(355, 100%, 93%, 0) 0px, transparent 50%),
                        radial-gradient(at 61% 52%, hsla(227, 64%, 46%, 0.05) 0px, transparent 50%),
                        radial-gradient(at 88% 12%, hsla(227, 70%, 49%, 0.1) 0px, transparent 50%),
                        radial-gradient(at 100% 37%, hsla(254, 68%, 56%, 0) 0px, transparent 50%)
                    `,
                    backgroundAttachment: 'fixed',
                    minHeight: '100vh',
                });
            } else {
                setAppStyle({ minHeight: '100vh' });
            }
        };

        updateStyles();
    }, [
        layoutSetting.bodyFilterValue,
        layoutSetting.antdThemeValue,
        layoutSetting.themeSimple,
        layoutSetting.isRadius,
        layoutSetting.primaryColorValue
    ]);

    return appStyle;
};

// 自定义Hook：应用初始化
const useAppInitialization = () => {
    const debounceSettingMobile = useMobileDetection();

    useMount(() => {
        // 监听是否切换到移动端
        debounceSettingMobile();
        window.addEventListener("resize", debounceSettingMobile);

        // 已经登录，重新加载登录信息
        const adminUserToken = storage.get(`adminUserToken`) || sessionStorage.getItem(`adminUserToken`);
        if (adminUserToken) {
            adminUserApi.getAdminUser()
                .then((res) => {
                    if (res.code === 1) {
                        loginAction(res.data, setAdminUserStore, setMenuAuthStore);
                    }
                })
                .catch(err => {
                    console.error('Failed to get admin user:', err);
                });
        }

        // 清理函数
        return () => {
            window.removeEventListener("resize", debounceSettingMobile);
        };
    });
};

const MainApp = () => {
    const menuAuth = useSnapshot(menuAuthStore);
    const layoutSetting = useSnapshot(layoutSettingStore);
    const location = useLocation();

    // 初始化应用
    useAppInitialization();

    // 动态生成路由
    const routes = useDynamicRoutes(menuAuth.menuArrAll);

    // 管理页面标题和菜单状态
    usePageTitleAndMenu(menuAuth.menuArrAll, location);

    // 管理主题样式
    const appStyle = useThemeStyles(layoutSetting);

    // 主题配置
    const themeConfig = useMemo(() => ({
        cssVar: true,
        components: {
            Layout: {
                bodyBg: layoutSetting.antdThemeValue === 'dark'
                    ? '#000'
                    : (layoutSetting.themeSimple
                        ? 'none'
                        : 'linear-gradient(#ffffff,#f5f5f5 28%)!important'),
            },
            Card: {
                headerFontSize: 14
            },
            Tabs: {
                titleFontSizeLG: 14
            }
        },
        algorithm: theme[`${layoutSetting.antdThemeValue}Algorithm`],
        token: {
            colorPrimary: layoutSetting.primaryColorValue,
        },
    }), [
        layoutSetting.antdThemeValue,
        layoutSetting.themeSimple,
        layoutSetting.primaryColorValue
    ]);

    // 渲染路由 - 不要用useMemo缓存，useRoutes会处理路由变化
    const renderedRoutes = useRoutes(routes);

    return (
        <ConfigProvider
            locale={zhCN}
            renderEmpty={RenderEmpty}
            theme={themeConfig}
        >
            <App style={appStyle}>
                <LazyLoad>
                    {renderedRoutes}
                </LazyLoad>
            </App>
        </ConfigProvider>
    );
};

export default MainApp;