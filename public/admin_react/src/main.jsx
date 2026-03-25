// src/main.jsx
import React, { useMemo, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { useSnapshot } from 'valtio';
import { useDebounceFn } from 'ahooks';
import { ConfigProvider, theme, App as AntdApp } from 'antd';
import { setMenuAuthStore } from '@/store/menuAuth';
import { setAdminUserStore } from '@/store/adminUser';
import { layoutSettingStore, setLayoutSettingStore } from '@/store/layoutSetting';
import { isMobileFun, storage, colorHsb } from '@/common/function';
import { loginAction } from '@/common/loginAction';
import { adminUserApi } from '@/api/adminUser';
import RenderEmpty from '@/component/renderEmpty/index';
import zhCN from 'antd/locale/zh_CN';
import 'dayjs/locale/zh-cn';
import '@/static/iconfont/iconfont.css';
import App from './App';

// 工具函数：操作 html 类名
const htmlClass = (className, type = 'add') => {
    const htmlEl = document.querySelector('html');
    if (!htmlEl) return;
    if (type === 'add') htmlEl.classList.add(className);
    else htmlEl.classList.remove(className);
};

// ========== 移动端检测 Hook（修复清理逻辑） ==========
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
        { wait: 300 }
    );
    return debounceSettingMobile;
};

// ========== 应用主组件 ==========
const Main = () => {
    const layoutSetting = useSnapshot(layoutSettingStore);
    const debounceSettingMobile = useMobileDetection();

    // 主题样式管理（html类名）
    useEffect(() => {
        const classUpdates = [
            { className: 'sa-filter', condition: layoutSetting.bodyFilterValue },
            { className: 'sa-antd-dark', condition: layoutSetting.antdThemeValue === 'dark' },
            { className: 'sa-antd-simple', condition: layoutSetting.themeSimple },
            { className: 'sa-is-radius', condition: layoutSetting.isRadius },
        ];
        classUpdates.forEach(({ className, condition }) => {
            htmlClass(className, condition ? 'add' : 'remove');
        });
    }, [
        layoutSetting.bodyFilterValue,
        layoutSetting.antdThemeValue,
        layoutSetting.themeSimple,
        layoutSetting.isRadius,
    ]);

    // 使用 useEffect 代替 useMount，以便正确清理 resize 事件
    useEffect(() => {
        debounceSettingMobile();
        window.addEventListener('resize', debounceSettingMobile);

        // 已登录，重新加载用户信息
        const adminUserToken = storage.get('adminUserToken') || sessionStorage.getItem('adminUserToken');
        if (adminUserToken) {
            adminUserApi.getAdminUser().then(res => {
                if (res.code === 1) {
                    loginAction(res.data, setAdminUserStore, setMenuAuthStore);
                }
            }).catch(err => console.error('Failed to get admin user:', err));
        }

        return () => window.removeEventListener('resize', debounceSettingMobile);
    }, [debounceSettingMobile]); // 依赖 debounceSettingMobile 确保最新函数

    // 全局主题配置
    const themeConfig = useMemo(
        () => ({
            cssVar: true,
            components: {
                Layout: {
                    bodyBg:
                        layoutSetting.antdThemeValue === 'dark'
                            ? '#000'
                            : layoutSetting.themeSimple
                                ? 'none'
                                : 'linear-gradient(#ffffff,#f5f5f5 28%)!important',
                },
                Card: { headerFontSize: 14 },
                Tabs: { titleFontSizeLG: 14 },
            },
            algorithm: theme[`${layoutSetting.antdThemeValue}Algorithm`],
            token: { colorPrimary: layoutSetting.primaryColorValue },
        }),
        [layoutSetting.antdThemeValue, layoutSetting.themeSimple, layoutSetting.primaryColorValue]
    );

    // 动态背景样式
    const appStyle = useMemo(() => {
        if (layoutSetting.themeSimple && layoutSetting.antdThemeValue !== 'dark') {
            const backgroundHsb = colorHsb(layoutSetting.primaryColorValue);
            return {
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
            };
        }
        return { minHeight: '100vh' };
    }, [layoutSetting.themeSimple, layoutSetting.antdThemeValue, layoutSetting.primaryColorValue]);

    return (
        <ConfigProvider locale={zhCN} renderEmpty={RenderEmpty} theme={themeConfig}>
            <AntdApp style={appStyle}>
                <App />
            </AntdApp>
        </ConfigProvider>
    );
};

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Main />
    </React.StrictMode>
);