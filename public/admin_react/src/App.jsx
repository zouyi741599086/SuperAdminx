import { lazy, useMemo, useRef, useEffect } from 'react';
import { RouterProvider, Navigate, useLocation, createHashRouter } from 'react-router';
import { useSnapshot } from 'valtio';
import { menuAuthStore, setMenuAuthStore } from '@/store/menuAuth';
import { adminUserStore } from '@/store/adminUser';
import { storage } from '@/common/function';
import { config } from '@/common/config';
import LazyLoad from '@/component/lazyLoad/index';
import './App.css';

// 导入所有页面（异步加载）
const routeAllPathToCompMap = import.meta.glob([
    './pages/**/*index.jsx',
    '!./**/components/**/*index.jsx',
    '!./**/component/**/*index.jsx',
]);

// 常量
const APP_TITLE = config.projectName;

const LoginPage = lazy(() => import('@/pages/login/index'));
const ErrorPage = lazy(() => import('@/pages/error/index'));
const Layout = lazy(() => import('@/pages/layout/index'));

// ========== 包装组件以显示加载态 ==========
// 接收一个组件（可以是懒加载组件），返回一个包装后的组件，内部显示 LazyLoad
const withLazyLoad = (Component) => {
    return function WrappedComponent(props) {
        return (
            <LazyLoad>
                <Component {...props} />
            </LazyLoad>
        );
    };
};

// ========== generateRouteElement 返回组件函数 ==========
const generateRouteElement = (item) => {
    if (item.type === 4) {
        // iframe 页面
        const IframeComp = lazy(() => import('@/pages/iframe/index.jsx'));
        // 包装 iframe 组件，并传递 url 属性
        const WrappedIframe = function IframeWrapper() {
            return (
                <LazyLoad>
                    <IframeComp url={item.url} />
                </LazyLoad>
            );
        };
        return WrappedIframe;
    }
    if (item.type === 7) {
        // config 页面
        const ConfigComp = lazy(() => import('@/pages/config/updateConfig/index.jsx'));
        const WrappedConfig = function ConfigWrapper() {
            return (
                <LazyLoad>
                    <ConfigComp name={item.name.replace('config_', '')} />
                </LazyLoad>
            );
        };
        return WrappedConfig;
    }
    const pathKey = `./pages${item.component_path}/index.jsx`;
    if (routeAllPathToCompMap[pathKey]) {
        // 获取已包装的组件（内部已包含 LazyLoad）
        return withLazyLoad(lazy(routeAllPathToCompMap[pathKey]));
    }
    // 兜底错误页
    return withLazyLoad(ErrorPage);
};

// ========== 根布局组件（只负责鉴权、标题、菜单高亮） ==========
const RootLayout = () => {
    const menuAuth = useSnapshot(menuAuthStore);
    const adminUser = useSnapshot(adminUserStore);
    const location = useLocation();

    // 1. 鉴权
    const adminUserToken = storage.get('adminUserToken') || sessionStorage.getItem('adminUserToken');
    const isAuthenticated = adminUser?.id && adminUserToken;

    // 未登录且不在登录页 -> 跳转到登录页
    if (!isAuthenticated && location.pathname !== '/login') {
        return <Navigate to="/login" replace />;
    }

    // 2. 页面标题和菜单状态管理
    const locationRef = useRef(location.pathname);
    const initializedRef = useRef(false);

    useEffect(() => {
        const menuArrAll = menuAuth.menuArrAll;
        if (!menuArrAll || menuArrAll.length === 0) return;

        if (!initializedRef.current || location.pathname !== locationRef.current) {
            initializedRef.current = true;
            locationRef.current = location.pathname;

            const menuMap = new Map();
            menuArrAll.forEach(item => menuMap.set(item.path, item));
            const currentMenuItem = menuMap.get(location.pathname);
            if (!currentMenuItem) return;

            // 设置页面标题
            let pageTitle = '';
            currentMenuItem.pid_name_path.forEach(name => {
                const found = menuArrAll.find(item => item.name === name);
                if (found) pageTitle += `-${found.title}`;
            });
            document.title = `${APP_TITLE}${pageTitle}`;

            // 设置菜单展开/选中项
            const activeMenuPath = currentMenuItem.pid_name_path.map(name => name.toString());
            setMenuAuthStore(prev => ({
                ...prev,
                activeMenuPath,
                openKeys: activeMenuPath,
                activeData: currentMenuItem,
            }));
        }
    }, [location.pathname, menuAuth.menuArrAll]);

    // 直接返回布局组件（布局内部应包含 <Outlet />）
    return (
        <LazyLoad>
            <Layout />
        </LazyLoad>
    );
};

// ========== 构建路由函数（关键修复3：使用 Component 接收组件函数） ==========
const buildRoutes = (menuArrAll) => {
    const staticRoutes = [
        {
            path: '/login',
            Component: withLazyLoad(LoginPage),        // 包装后的组件
        },
        {
            path: '/',
            Component: RootLayout,
            children: [
                ...menuArrAll.map(item => ({
                    path: item.path,
                    Component: generateRouteElement(item), // 返回的是组件函数
                })),
                {
                    path: '*',
                    Component: withLazyLoad(ErrorPage),
                },
            ],
        },
        {
            path: '*',
            element: <Navigate to="/login" replace />, // 注意：redirect 只能用 element 方式，因为 Navigate 是一个组件，直接 JSX 即可
        },
    ];

    return createHashRouter(staticRoutes);
};

// ========== 应用主组件 ==========
const App = () => {
    const menuAuth = useSnapshot(menuAuthStore);
    const router = useMemo(() => buildRoutes(menuAuth.menuArrAll), [menuAuth.menuArrAll]);
    return <RouterProvider router={router} />
};

export default App;