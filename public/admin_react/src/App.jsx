import { useState, lazy, useEffect } from 'react';
import { useRoutes, useLocation } from "react-router-dom";
import { deepClone, isMobileFun, storage, colorHsb } from '@/common/function';
import { ConfigProvider, theme, App } from 'antd';
import './App.css';
import '@/static/iconfont/iconfont.css'
import { useRecoilState } from 'recoil';
import { adminUserStore } from '@/store/adminUser';
import { menuAuthStore } from '@/store/menuAuth';
import { layoutSettingStore } from '@/store/layoutSetting';
import { adminUserApi } from '@/api/adminUser'
import { loginAction } from '@/common/loginAction';
import { useMount, useDebounceFn } from 'ahooks';
import 'dayjs/locale/zh-cn';
import zhCN from 'antd/locale/zh_CN';
import { config } from '@/common/config';
import LazyLoad from '@/component/lazyLoad/index';
import RenderEmpty from '@/component/renderEmpty/index';
import { router } from './router'

// 导入所有的页面，异步加载，要除开component 跟 components文件夹内的
const routeAllPathToCompMap = import.meta.glob([
    `./pages/**/*index.jsx`,
    `!./**/components/**/*index.jsx`, // 除开的此文件
    `!./**/component/**/*index.jsx`, // 除开的此文件
]);

const Error = lazy(() => import('@/pages/error/index'));

/**
 * 给html标签加class
 * @param {String} className 添加或删除的class
 * @param {Int} type 添加，删除
 */
const htmlClass = (className, type = 'add') => {
    if (type === 'add') {
        document.querySelector('html').classList.add(className)
    }
    if (type === 'remove') {
        document.querySelector('html').classList.remove(className)
    }
}

export default () => {
    const [adminUser, setAdminUser] = useRecoilState(adminUserStore);
    const [menuAuth, setMenuAuth] = useRecoilState(menuAuthStore);
    const [layoutSetting, setLayoutSetting] = useRecoilState(layoutSettingStore);
    const location = useLocation();
    const [routes, setRoutes] = useState(router);
    // 监听是否是移动端，防抖处理
    const { run: debunceSettingMobile } = useDebounceFn(
        () => {
            let isMobile = isMobileFun();
            htmlClass('sa-mobile', isMobile === true ? 'add' : 'remove');
            setLayoutSetting(_val => ({
                ..._val,
                isMobile,
                // 移动端就强制第一种布局
                layoutValue: isMobile ? 'slide' : _val.layoutValue,
                // 移动端强制白色布局
                antdThemeValue: isMobile ? 'default' : _val.antdThemeValue,
            }))
        },
        { wait: 300 },
    );

    // 组件挂载后执行
    useMount(() => {
        // 设置页面标题
        document.title = config.company;

        // 监听是否切换到移动端
        debunceSettingMobile();
        window.addEventListener("resize", () => {
            debunceSettingMobile()
        });

        // 已经登录， 重新加载登录信息
        let adminUserToken = storage.get(`adminUserToken`) || sessionStorage.getItem(`adminUserToken`); // 是否保持登录状态
        if (adminUserToken) {
            adminUserApi.getAdminUser().then((res) => {
                if (res.code === 1) {
                    loginAction(res.data, setAdminUser, setMenuAuth)
                }
            }).catch(err => {
            });
        }
    })

    // 色弱模式
    useEffect(() => {
        htmlClass('sa-filter', layoutSetting.bodyFilterValue === true ? 'add' : 'remove');
    }, [layoutSetting.bodyFilterValue])

    // 黑色主题
    useEffect(() => {
        htmlClass('sa-antd-dark', layoutSetting.antdThemeValue === 'dark' ? 'add' : 'remove');
    }, [layoutSetting.antdThemeValue])

    // 简约风格
    useEffect(() => {
        htmlClass('sa-antd-simple', layoutSetting.themeSimple ? 'add' : 'remove');
    }, [layoutSetting.themeSimple])

    // 圆角风格
    useEffect(() => {
        htmlClass('sa-is-radius', layoutSetting.isRadius ? 'add' : 'remove');
    }, [layoutSetting.isRadius])

    // 用户的菜单权限改变的时候，更新路由，主要用于登录后需要重新更新路由
    useEffect(() => {
        let result = [...router];
        menuAuth.menuArrAll.map(item => {
            let tmp = deepClone(item);
            if (item.type === 4) {
                // 说明是iframe页面
                let Elm = lazy(routeAllPathToCompMap[`./pages/iframe/index.jsx`])
                tmp.element = <LazyLoad>
                    <Elm
                        url={item.url}
                    />
                </LazyLoad>;
            } else if (item.type === 7) {
                // 说明是配置页面
                let Elm = lazy(routeAllPathToCompMap[`./pages/config/updateConfig/index.jsx`])
                tmp.element = <LazyLoad>
                    <Elm
                        name={item.name.replace("config_", "")}
                    />
                </LazyLoad>;
            } else if (routeAllPathToCompMap[`./pages${item.component_path}/index.jsx`]) {
                let Elm = lazy(routeAllPathToCompMap[`./pages${item.component_path}/index.jsx`])
                tmp.element = <LazyLoad>
                    <Elm />
                </LazyLoad>;
            } else {
                tmp.element = <LazyLoad>
                    <Error />
                </LazyLoad>;
            }
            result[1].children.push(tmp);
        })
        setRoutes(result)
    }, [menuAuth.menuArrAll])

    // 导航钩子，监听url变化的时候
    useEffect(() => {
        if (!location.pathname) {
            return;
        }
        menuAuth.menuArrAll.some(item => {
            if (location.pathname === item.path) {
                // 设置页面标题，根据当前页面的pid_name_path循环换成标题
                let page_title = '';
                item.pid_name_path.map(_name => {
                    menuAuth.menuArrAll.some(__item => {
                        if (__item.name === _name) {
                            page_title += `-${__item.title}`;
                            return true;
                        }
                    })
                })
                document.title = `${config.projectName}${page_title}`
                // 设置菜单展开、选中项
                setMenuAuth((_val) => {
                    let tmp = item.pid_name_path.map(_name => _name.toString());
                    return {
                        ..._val,
                        activeMenuPath: tmp,
                        openKeys: tmp,
                        activeData: item
                    }
                })
                return true;
            }
        })
    }, [location])

    // app样式，主要是简约风格的开关
    const [appStyle, setAppStyle] = useState({});
    useEffect(() => {
        if (layoutSetting.themeSimple) {
            let backgroundHsb = colorHsb(layoutSetting.primaryColorValue)
            setAppStyle({
                backgroundColor: layoutSetting.antdThemeValue !== 'dark' ? `hsla(${backgroundHsb[0]}, 100%, 96%, 1)` : 'none',
                backgroundImage: layoutSetting.antdThemeValue !== 'dark' ? `radial-gradient(at 13% 5%, hsla(${backgroundHsb[0]}, 100%, 37%, 0.29) 0px, transparent 50%), radial-gradient(at 100% 100%, hsla(254, 66%, 56%, 0.11) 0px, transparent 50%), radial-gradient(at 0% 100%, hsla(355, 100%, 93%, 0) 0px, transparent 50%), radial-gradient(at 61% 52%, hsla(227, 64%, 46%, 0.05) 0px, transparent 50%), radial-gradient(at 88% 12%, hsla(227, 70%, 49%, 0.1) 0px, transparent 50%), radial-gradient(at 100% 37%, hsla(254, 68%, 56%, 0) 0px, transparent 50%)` : 'none',
                backgroundAttachment: 'fixed',
                minHeight: '100vh',
            })
        } else {
            setAppStyle({
                minHeight: '100vh',
            })
        }
    }, [layoutSetting.themeSimple, layoutSetting.antdThemeValue, layoutSetting.primaryColorValue])

    return (
        <ConfigProvider
            locale={zhCN}
            renderEmpty={() => {
                return <RenderEmpty />
            }}
            theme={{
                cssVar: true,
                components: {
                    Layout: {
                        bodyBg: layoutSetting.antdThemeValue === 'dark' ? '#000' : (layoutSetting.themeSimple ? 'none' : 'linear-gradient(#ffffff,#f5f5f5 28%)!important'),
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
            }}
        >
            <App
                style={appStyle}
            >
                <LazyLoad>
                    {useRoutes(routes)}
                </LazyLoad>
            </App>
        </ConfigProvider>
    )
}
