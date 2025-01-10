import { useState, lazy } from 'react';
import {
    LeftOutlined,
    RightOutlined,
} from '@ant-design/icons';
import { Layout, Tooltip, Divider, Button } from 'antd';
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

const { Content, Sider } = Layout;

/**
 * 布局方式之1
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 */
export default () => {
    const [collapsed, setCollapsed] = useState(false);
    const [layoutSetting, setLayoutSetting] = useRecoilState(layoutSettingStore);

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
            className="sa-layout-left"
        >
            <Layout style={{ minHeight: '100vh', position: 'sticky', top: '0px' }} >
                <Sider
                    breakpoint="xl"
                    onCollapse={onCollapse}
                    collapsed={collapsed}
                    className="sider"
                >
                    <Button
                        className="sa-collapsed"
                        onClick={collapsedChange}
                        style={{ left: collapsed ? '68px' : '186px' }}
                        shape="circle"
                        size="small"
                        icon={collapsed === false ? <LeftOutlined className='icon' /> : <RightOutlined className='icon' />}
                    />
                    <div className="logo">
                        <img src={logo} alt="" />
                        {!collapsed ? <>
                            <Tooltip title={config.projectName}>
                                <span>{config.projectName}</span>
                            </Tooltip>
                        </> : ''}
                    </div>
                    <div style={{ margin: '0px 15px' }}>
                        <Divider style={{ margin: '0px' }} />
                    </div>
                    <div className="menuWarp">
                        <Menu />
                    </div>

                    {!collapsed ? (
                        <div className="userWarp">
                            <div className="l">
                                <UserInfo showIcon={false} placement={'topLeft'} />
                            </div>
                            <div className="r">
                                <Message placement={'topLeft'} />
                                <SearchMenu />
                                <ScreenFull />
                                <LayoutSetting />
                            </div>
                        </div>
                    ) : (
                        <div className="userWarpCollapsed">
                            <Message placement={'topLeft'} />
                            <SearchMenu placement={'right'} />
                            <ScreenFull placement={'right'} />
                            <LayoutSetting placement={'right'} />
                            <UserInfo showIcon={false} showName={false} placement={'topLeft'} />
                        </div>
                    )}

                </Sider>

                <Layout className='sa-layout-content'>
                    <ContentTabs />
                    <Content>
                        <Outlet />
                    </Content>
					<Footer />
                </Layout>
            </Layout>
        </div>
    );
};
