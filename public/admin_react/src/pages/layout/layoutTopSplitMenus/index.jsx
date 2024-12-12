import { useState, lazy, useEffect } from 'react';
import {
    LeftOutlined,
    RightOutlined,
    EllipsisOutlined
} from '@ant-design/icons';
import { Layout, Menu, Button } from 'antd';
import { Outlet } from 'react-router-dom';
import logo from '@/static/logo.png';
import './index.css'
import { useRecoilState } from 'recoil';
import { layoutSettingStore } from '@/store/layoutSetting';
import { menuAuthStore } from '@/store/menuAuth';
import { useNavigate } from 'react-router-dom';
import { useMount } from 'ahooks';
import { config } from '@/common/config'

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
    const navigate = useNavigate();

    const [layoutSetting, setLayoutSetting] = useRecoilState(layoutSettingStore);
    const [menuAuth, setMenuAuth] = useRecoilState(menuAuthStore);
    // 侧边栏开关
    const [collapsed, setCollapsed] = useState(false);
    // 所有的菜单
    const [menuList, setMenuList] = useState([]);
    // 一级菜单，用于顶部
    const [topMenuList, setTopMenuList] = useState([]);
    // 二级菜单，用于左侧
    const [slideMenuList, setSlideMenuList] = useState([]);

    // 点击父菜单的时候，控制只展开当前菜单
    const onOpenChange = (keys) => {
        setMenuAuth(_val => {
            return {
                ..._val,
                openKeys: keys
            }
        })
    };

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
                    icon: <span className={`iconfont ${item.icon}`}></span>,
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

    // 侧边栏菜单被点击的时候
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

    return (
        <div
            style={{
                minHeight: '100vh',
                width: !layoutSetting.isWidth ? '100%' : '1200px',
                margin: '0px auto',
                maxWidth: '100%',
            }}
            className="sa-layout-topSplitMenus"
        >
            <Layout style={{ minHeight: '100vh' }}>
                <Header className="header" style={{ height: layoutSetting.isMobile ? '46px' : '56px' }}>
                    <div className="sa-layout-header-warp">
                        <div className='l'>
                            <div className="logo">
                                <img src={logo} alt="" />
                                <span>{config.projectName}</span>
                            </div>
                            <div className="menu-warp">
                                <Menu
                                    style={{ background: 'none', width: '100%', borderBottom: '0px', lineHeight: '55px' }}
                                    mode={`horizontal`}
                                    items={topMenuList}
                                    onClick={onTopMenuClick}
                                    selectedKeys={menuAuth.activeMenuPath}
                                    overflowedIndicator={
                                        <>更多<EllipsisOutlined /></>
                                    }
                                />
                            </div>
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
                <Layout>
                    {slideMenuList.length > 0 ? (
                        <Sider
                            breakpoint="xl"
                            onCollapse={onCollapse}
                            collapsed={collapsed}
                            className="sider"
                        >
                            <div className="menu-warp">
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
                            <Button
                                className="sa-collapsed"
                                onClick={collapsedChange}
                                style={{ left: collapsed ? '68px' : '186px' }}
                                shape="circle"
                                size="small"
                                icon={collapsed === false ? <LeftOutlined className='icon' /> : <RightOutlined className='icon' />}
                            />
                        </Sider>
                    ) : ''}

                    <Layout className='sa-layout-content'>
                        <ContentTabs />
                        {/* 设置高度是为了iframe能撑满高度100% */}
                        <Content style={{ height: '1px' }}>
                            <Outlet />
                        </Content>
                        <Footer />
                    </Layout>
                </Layout>
            </Layout>
        </div>
    );
};
