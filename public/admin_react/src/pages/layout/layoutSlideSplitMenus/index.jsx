import { useState, lazy, useEffect } from 'react';
import {
    LeftOutlined,
    RightOutlined,
} from '@ant-design/icons';
import { Layout, Button, Divider, Menu, theme } from 'antd';
import { Outlet } from 'react-router-dom';
import logo from '@/static/logo.png';
import './index.css'
import { useRecoilState } from 'recoil';
import { layoutSettingStore } from '@/store/layoutSetting';
import { config } from '@/common/config'
import { useMount } from 'ahooks';
import { colorHsb } from '@/common/function';
import { menuAuthStore } from '@/store/menuAuth';
import { useNavigate } from 'react-router-dom';

const { useToken } = theme;
const Message = lazy(() => import('./../component/message'));
const ScreenFull = lazy(() => import('./../component/screenFull'));
const SearchMenu = lazy(() => import('./../component/searchMenu'));
const LayoutSetting = lazy(() => import('./../component/layoutSetting'));
const UserInfo = lazy(() => import('./../component/userInfo'));
const Footer = lazy(() => import('./../component/footer'));
const ContentTabs = lazy(() => import('./../component/contentTabs'));

const { Header, Content, Sider } = Layout;

/**
 * 数组转多维数据，会给数组增加上级的路劲
 * @param {Array} arrs 需要转换的一维数据
 * @param {Any} pid 上级
 * @param {Array} pid_name_path 路劲
 * @returns 
 */
export const arrayToTree = (arr, pid = null, pid_name_path = []) => {
    let newArr = [];
    arr.forEach(item => {
        if (item['pid_name'] === pid) {
            item.pid_name_path = pid_name_path.concat([item.id])
            let children = arrayToTree(arr, item['name'], item.pid_name_path);
            if (children.length > 0) {
                item['children'] = children;
            }
            // 如果是三级往下，就不要icon
            if (item.pid_name_path.length >= 3) {
                item.icon = null;
            }
            newArr.push(item);
        }
    })
    return newArr
}

/**
 * 布局方式之1
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 */
export default () => {
    const { token } = useToken();
    const navigate = useNavigate();
    const [layoutSetting] = useRecoilState(layoutSettingStore);
    const [menuAuth, setMenuAuth] = useRecoilState(menuAuthStore);
    // 侧边栏开关
    const [collapsed, setCollapsed] = useState(false);
    // 所有的菜单
    const [menuList, setMenuList] = useState([]);
    // 一级菜单，用于顶部
    const [topMenuList, setTopMenuList] = useState([]);
    // 当前所在的一级菜单
    const [topMenuData, setTopMenuData] = useState({});
    // 二级菜单，用于左侧
    const [slideMenuList, setSlideMenuList] = useState([]);

    // 初始加载的时候，重置菜单数据
    useMount(() => {
        let tmpMenuList = [];
        let tmpTopMenuList = [];
        menuAuth.menuArr.map(item => {
            if (!item.pid_name) {
                // 找出所有一级菜单
                tmpTopMenuList.push({
                    id: item.id,
                    name: item.name,
                    pid_name: item.pid_name,
                    path: item.path,
                    type: item.type,
                    url: item.url,
                    key: item.name,
                    icon: item.icon,
                    label: item.title,
                });
            }
            tmpMenuList.push({
                id: item.id,
                name: item.name,
                pid_name: item.pid_name,
                path: item.path,
                type: item.type,
                url: item.url,
                key: item.name,
                _icon: item.icon,
                icon: <span className={`iconfont ${item.icon}`}></span>,
                label: item.title,
            });
        })
        setMenuList(arrayToTree(tmpMenuList));
        setTopMenuList(tmpTopMenuList);
    })

    // 点击父菜单的时候，控制只展开当前菜单
    const onOpenChange = (keys) => {
        setMenuAuth(_val => {
            return {
                ..._val,
                openKeys: keys
            }
        })
    };

    // 用于刷新页面、点击tabs切换页面、切换主题过来的时候，把二级菜单展示出来
    useEffect(() => {
        onTopMenuClick({ key: menuAuth.activeData.pid_name_path[0] }, false);
    }, [menuList, menuAuth.activeData])

    /**
     * 顶部菜单点击的时候
     * @param {obj} param0 
     * @param {boolean} 是否立即跳转到二级菜单的第一个菜单
     */
    const onTopMenuClick = ({ key }, autoNavigate = true) => {
        // 找出菜单，有下级就显示下级，没得就跳转
        menuList.some(item => {
            if (item.name === key) {
                setTopMenuData(item);
                if (item.children) {
                    // 有下级菜单
                    onCollapse(false);
                    setSlideMenuList(item.children)

                    // 直接跳转到下级菜单中第一个菜单
                    if (autoNavigate) {
                        const searchPath = (arr) => {
                            let _path = '';
                            arr.some(_item => {
                                // 2》菜单，4》iframe菜单  才是内部组件
                                if ([2, 4].indexOf(_item.type) !== -1 && _item.path) {
                                    _path = _item.path;
                                    return true;
                                }
                                // 外部链接，感觉用户体验不好
                                // if (_item.type == 3) {
                                //     window.open(_item.url, '_blank', '');
                                //     return true;
                                // }
                                if (_item.children) {
                                    _path = searchPath(_item.children);
                                }
                                if (_path) {
                                    return true;
                                }
                            })
                            return _path;
                        }
                        const tmpPath = searchPath(item.children);
                        if (tmpPath) {
                            navigate(searchPath(item.children));
                        }
                    }

                } else {
                    setSlideMenuList([]);
                    // 外部链接
                    if (item.type === 3) {
                        return window.open(item.url, '_blank', '');
                    } else {
                        navigate(item.path);
                    }
                }
                return true;
            }
        })
    }

    // 二级以下栏菜单被点击的时候
    const onSlideMenuClick = ({ key }) => {
        // 找出菜单进行跳转
        menuAuth.menuArr.some(item => {
            if (item.name === key) {
                // 外部链接
                if (item.type === 3) {
                    return window.open(item.url, '_blank', '');
                }
                navigate(item.path);
                return true;
            }
        })
    }

    // 导航缩所变化的时候
    const onCollapse = (collapsedVal) => {
        setCollapsed(collapsedVal)
    }

    // 切换导航收缩
    const collapsedChange = () => {
        setCollapsed(!collapsed);
    }

    // 一级导航的背景色的样式
    const [menuBackgroundColor, setMenuBakcgroundColor] = useState({});
    useEffect(() => {
        // 非简约风、非黑色模式
        if (layoutSetting.antdThemeValue != 'dark' && !layoutSetting.themeSimple) {
            let hab = colorHsb(layoutSetting.primaryColorValue);
            setMenuBakcgroundColor({ background: `hsla(${hab[0]}, 100%, 96%, 1)` });
        } else {
            setMenuBakcgroundColor({});
        }
    }, [layoutSetting.primaryColorValue, layoutSetting.antdThemeValue, layoutSetting.themeSimple])

    return (
        <div
            style={{
                minHeight: '100vh',
                width: !layoutSetting.isWidth ? '100%' : '1200px',
                margin: '0px auto',
                maxWidth: '100%',
            }}
            className="sa-layout-slideSplitMenus"
        >
            <Layout style={{ minHeight: '100vh' }}>
                <Sider
                    // 宽度，要看有没得子菜单  简约风收缩的时候还不一样
                    width={slideMenuList.length > 0 ? 274 : (layoutSetting.isRadius ? 86 : 74)}
                    // 收缩后的宽度，要看有没得子菜单 还要看简约风的时候
                    collapsedWidth={slideMenuList.length > 0 ? (layoutSetting.isRadius ? 162 : 142) : (layoutSetting.isRadius ? 86 : 74)}
                    breakpoint="xl"
                    onCollapse={onCollapse}
                    collapsed={collapsed}
                    className="sider"
                >
                    <div className="sider-main">
                        <div
                            className="sider-main-l"
                            style={menuBackgroundColor}
                        >
                            <div className="logo">
                                <img src={logo} alt="" />
                            </div>
                            {/* 一级菜单 */}
                            <div className="main-one-menu">
                                <ul className="one-menu">
                                    {topMenuList.map(item => {
                                        return <li
                                            className={`li ${topMenuData?.id == item.id ? 'on' : ''}`}
                                            key={item.id}
                                            style={{ background: topMenuData?.id == item.id ? token.colorPrimary : 'none' }}
                                        >
                                            <div className="menua"
                                                onClick={() => {
                                                    onTopMenuClick(item)
                                                }}
                                            >
                                                <span className={`iconfont ${item.icon}`} ></span>
                                                <span className="txt">{item.label}</span>
                                            </div>
                                        </li>
                                    })}

                                </ul>
                            </div>
                        </div>
                        {slideMenuList.length > 0 ? <>
                            <div className="sider-main-r">
                                <div className="logo">
                                    {!collapsed ? <span>{config.company}</span> : ''}
                                </div>
                                {!collapsed ? <Divider orientation="left" style={{ margin: '10px 0px' }}>{topMenuData?.label}</Divider> : ''}
                                <div className="menu-two-main">
                                    <Menu
                                        style={{ background: 'none', borderRight: '0px' }}
                                        mode={`inline`}
                                        items={slideMenuList}
                                        onClick={onSlideMenuClick}
                                        selectedKeys={menuAuth.activeMenuPath}
                                        openKeys={menuAuth.openKeys}
                                        onOpenChange={onOpenChange}
                                    />
                                </div>
                            </div >
                        </> : ''}
                    </div >
                    {slideMenuList.length > 0 ? <>
                        <Button
                            className="sa-collapsed"
                            onClick={collapsedChange}
                            style={{ left: collapsed ? (layoutSetting.isRadius ? '118px' : '96px') : '262px' }}
                            shape="circle"
                            size="small"
                            icon={collapsed === false ? <LeftOutlined className='icon' /> : <RightOutlined className='icon' />}
                        />
                    </> : ''}

                </Sider >
                <Layout className='sa-layout-content'>
                    <Header className="header">
                        <div className="sa-layout-header-warp">
                            <div className='l'>
                            </div>
                            <div className='r'>
                                <UserInfo />
                                <Message />
                                <SearchMenu />
                                <ScreenFull />
                                <LayoutSetting />
                            </div>
                        </div>
                    </Header>
                    <ContentTabs />
                    <Content>
                        <Outlet />
                    </Content>
                    <Footer />
                </Layout>
            </Layout >
        </div >
    );
};
