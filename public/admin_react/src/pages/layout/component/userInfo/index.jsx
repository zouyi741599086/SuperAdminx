import { lazy } from 'react';
import { CaretDownOutlined, LogoutOutlined } from '@ant-design/icons';
import { App, Avatar, Space, Dropdown, Typography } from 'antd';
import { useSnapshot } from 'valtio';
import { adminUserStore, setAdminUserStore } from '@/store/adminUser';
import { setMenuAuthStore } from '@/store/menuAuth';
import { setContentTabsStore } from '@/store/contentTabs';
import { useNavigate } from 'react-router';
import { storage } from '@/common/function';
import Lazyload from '@/component/lazyLoad/index';

const UserInfoUpdate = lazy(() => import('./component/userInfoUpdate'));
const UserInfoPassword = lazy(() => import('./component/userInfoPassword'));
const { Text } = Typography;

/**
 * 登录者的用户信息
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 */
const UserInfo = ({ showIcon = true, showName = true, placement = 'bottomLeft' }) => {
    const adminUser = useSnapshot(adminUserStore);
    const { modal } = App.useApp();
    const navigate = useNavigate();

    // 退出登录
    const logout = () => {
        modal.confirm({
            title: '提示',
            content: '确认要退出登录吗?',
            onOk() {
                // 先跳转到登录页
                // 然后异步清理数据，避免在跳转过程中引起组件树剧变
                storage.remove('adminUserToken');
                sessionStorage.removeItem(`adminUserToken`);
                setAdminUserStore({});
                setMenuAuthStore((_val) => {
                    return {
                        ..._val,
                        actionAuthArr: [],
                        activeMenuPath: [],
                        openKeys: [],
                        activeData: {},
                    }
                })
                setContentTabsStore({
                    activeName: '',
                    keepAlive: [],
                    list: [],
                });
                navigate('/login');
            },
        });
    }

    return (
        <Dropdown
            placement={placement}
            menu={{
                items: [
                    {
                        label: <Lazyload block={false}><UserInfoUpdate /></Lazyload>,
                        key: '0',
                    },
                    {
                        label: <Lazyload block={false}><UserInfoPassword /></Lazyload>,
                        key: '1',
                    },
                    {
                        label: <span><LogoutOutlined /> 退出登录</span>,
                        key: '2',
                        onClick: logout
                    }
                ],
            }}
        >
            <div className='item'>
                <span className='circle'>
                    <Space>
                        <Avatar size="small" src={`${adminUser?.img}`}>{adminUser?.name?.substr(0, 1)}</Avatar>
                        {showName ? (
                            <Text style={{ maxWidth: '40px', overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
                                <span style={{ maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'inline-block' }}>{adminUser?.name}</span>
                            </Text>
                        ) : ''}
                        {showIcon ? (
                            <Text><CaretDownOutlined style={{ fontSize: '12px' }} /></Text>
                        ) : ''}

                    </Space>
                </span>
            </div>
        </Dropdown>
    );
};

export default UserInfo;