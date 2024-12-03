import { lazy } from 'react';
import { CaretDownOutlined, LogoutOutlined } from '@ant-design/icons';
import { App, Avatar, Space, Dropdown, Typography } from 'antd';
import { useRecoilState } from 'recoil';
import { adminUserStore } from '@/store/adminUser';
import { menuAuthStore } from '@/store/menuAuth';
import { contentTabsStore } from '@/store/contentTabs';
import { useNavigate } from 'react-router-dom';
import { storage } from '@/common/function';
import Lazyload from '@/component/lazyLoad/index';

const UserInfoUpdate = lazy(() => import('./userInfoUpdate'));
const UserInfoPassword = lazy(() => import('./userInfoPassword'));
const { Text } = Typography;

/**
 * 登录者的用户信息
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 */
export default ({ showIcon = true, showName = true, placement = 'bottomLeft' }) => {
    const [adminUser, setAdminUser] = useRecoilState(adminUserStore);
    const [menuAuth, setMenuAuth] = useRecoilState(menuAuthStore);
    const [contentTabs, setContentTabs] = useRecoilState(contentTabsStore);
    const { modal } = App.useApp();
    const navigate = useNavigate();

    // 退出登录
    const logout = () => {
        modal.confirm({
            title: '提示',
            content: '确认要退出登录吗?',
            onOk() {
                storage.remove('adminUserToken');
                sessionStorage.removeItem(`adminUserToken`);
                setAdminUser({});
                setMenuAuth({
                    menu: [],
                    menuArrAll: [],
                    menuArr: [],
                    actionAuthArr: [],
                    activeMenuPath: [],
                    openKeys: [],
                    activeData: {},
                })
                setContentTabs({
                    activeName: '',
                    keepAlive: [],
                    list: [],
                })
                navigate('/login')
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
