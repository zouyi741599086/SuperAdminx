import { useState, lazy } from 'react';
import {
    LeftOutlined,
    RightOutlined,
} from '@ant-design/icons';
import { Layout, Button } from 'antd';
import { Outlet } from 'react-router-dom';
import logo from '@/static/logo.png';
import './index.css'
import { useRecoilState } from 'recoil';
import { layoutSettingStore } from '@/store/layoutSetting';
import { config } from '@/common/config'
import Lazyload from '@/component/lazyLoad/index';

const Message = lazy(() => import('./../component/message'));
const ScreenFull = lazy(() => import('./../component/screenFull'));
const SearchMenu = lazy(() => import('./../component/searchMenu'));
const LayoutSetting = lazy(() => import('./../component/layoutSetting'));
const UserInfo = lazy(() => import('./../component/userInfo'));
const Menu = lazy(() => import('./../component/menu'));
const MobileMenu = lazy(() => import('./../component/mobileMenu'));
const Footer = lazy(() => import('./../component/footer'));
const ContentTabs = lazy(() => import('./../component/contentTabs'));

const { Header, Content, Sider } = Layout;

/**
 * 布局方式之1
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 */
export default () => {
    const [collapsed, setCollapsed] = useState(false);
    const [layoutSetting] = useRecoilState(layoutSettingStore);

    // 导航缩所变化的时候
    const onCollapse = (value) => {
        setCollapsed(value)
    }

    // 切换导航收缩
    const collapsedChange = () => {
        setCollapsed(!collapsed);
    }

    return <>
        <div
            style={{
                minHeight: '100vh',
                width: !layoutSetting.isWidth ? '100%' : '1200px',
                margin: '0px auto',
                maxWidth: '100%',
            }}
            className="sa-layout-slide"
        >
            <Layout style={{ minHeight: '100vh' }}>
                <Header className="header" style={{ height: layoutSetting.isMobile ? '46px' : '56px' }}>
                    <div className="sa-layout-header-warp">
                        <div className='l'>
                            {/**pc端显示logo，移动端显示移动端的菜单 */}
                            {layoutSetting.isMobile === false ? <>
                                <div className="logo">
                                    <img src={logo} alt="" />
                                    <span>{config.projectName}</span>
                                </div>
                            </> : <>
                                <div className="logo" style={{ marginRight: '10px' }}>
                                    <img src={logo} alt="" />
                                </div>
                                <Lazyload><MobileMenu /></Lazyload>
                            </>}

                        </div>
                        <div className='r'>
                            <UserInfo />
                            <Message />
                            <SearchMenu />
                            {/**pc端才显示 */}
                            {layoutSetting.isMobile === false ? (
                                <>
                                    <ScreenFull />
                                    <LayoutSetting />
                                </>
                            ) : ''}

                        </div>
                    </div>
                </Header>
                <Layout>
                    {/**pc端才显示侧边栏 */}
                    {layoutSetting.isMobile === false ? (
                        <Sider
                            breakpoint="xl"
                            onCollapse={onCollapse}
                            collapsed={collapsed}
                            className="sider"
                            width={200}
                        >
                            <div className="menu-warp">
                                <Menu />
                            </div>
                            {/**pc端才显示菜单收缩开关 */}
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
                        {/**pc端才显示tabs标签 */}
                        {layoutSetting.isMobile === false ? <ContentTabs /> : ''}
                        <Content>
                            <Outlet />
                        </Content>
                        <Footer />
                    </Layout>

                </Layout>
            </Layout>
        </div>
    </>;
};
