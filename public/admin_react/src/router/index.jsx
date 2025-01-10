import { lazy } from 'react';
import { Navigate } from "react-router-dom";
import { storage } from '@/common/function';
import { useRecoilState } from 'recoil';
import { adminUserStore } from '@/store/adminUser';

const Login = lazy(() => import('@/pages/login/index'));
const Layout = lazy(() => import('@/pages/layout/index'));
const Error = lazy(() => import('@/pages/error/index'));
const Refresh = lazy(() => import('@/pages/refresh/index'));

// 鉴权
const RequireAuth = (props) => {
    const [adminUser] = useRecoilState(adminUserStore);
    let adminUserToken = storage.get(`adminUserToken`) || sessionStorage.getItem(`adminUserToken`) || null;
    return <>
        {!adminUser?.id || !adminUserToken ? <Navigate to="/login" replace={true} /> : <Layout /> }
    </>
}

/**
 * 默认的路由
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 */
export const router = [
    {
        path: '/login',
        element: <Login />,
        title: '登录',
    },
    {
        path: '/',
        element: <RequireAuth />,
        title: '首页',
        children: [
            {
                path: '/',
                element: <Navigate to="/index" />,
                title: '首页',
            },
            {
                path: '/refresh',
                element: <Refresh />,
                title: '刷新',
            },
            {
                path: '*',
                element: <Error />,
                title: '404',
            },
        ]
    },
];
