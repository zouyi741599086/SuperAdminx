import { lazy } from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import logo from '@/static/logo.png';
import './index.css'
import { useRecoilState } from 'recoil';
import { layoutSettingStore } from '@/store/layoutSetting';
import { config } from '@/common/config'

const Message = lazy(() => import('./../component/message'));
const ScreenFull = lazy(() => import('./../component/screenFull'));
const SearchMenu = lazy(() => import('./../component/searchMenu'));
const LayoutSetting = lazy(() => import('./../component/layoutSetting'));
const UserInfo = lazy(() => import('./../component/userInfo'));
const Menu = lazy(() => import('./../component/menu'));
const Footer = lazy(() => import('./../component/footer'));
const ContentTabs = lazy(() => import('./../component/contentTabs'));

const { Header, Content, } = Layout;

/**
 * 布局方式之1
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 */
export default () => {
    const [layoutSetting] = useRecoilState(layoutSettingStore);

    return (
        <div
            style={{
                minHeight: '100vh',
                width: !layoutSetting.isWidth ? '100%' : '1200px',
                margin: '0px auto',
                maxWidth: '100%',
            }}
            className="sa-layout-top"
        >
            <Layout style={{ minHeight: '100vh' }}>
                <Header className="header" style={{ background: 'none', height: layoutSetting.isMobile ? '46px' : '56px' }}>
                    <div className="sa-layout-header-warp">
                        <div className='l'>
                            <div className="logo">
                                <img src={logo} alt="" />
                                <span>{config.projectName}</span>
                            </div>
                            <div className="menu-warp">
                                <Menu menuMode='horizontal' style={{ height: '100%' }} />
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
                    <ContentTabs />
                    {/* 设置高度是为了iframe能撑满高度100% */}
                    <Content style={{ height: '1px' }}>
                        <Outlet />
                    </Content>
                    <Footer />
                </Layout>
            </Layout>
        </div>
    );
};
