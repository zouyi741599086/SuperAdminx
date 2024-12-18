import { lazy } from 'react';
import {
    MenuOutlined,
} from '@ant-design/icons';
import { Drawer, Divider } from 'antd';
import { useBoolean } from 'ahooks'
import logo from '@/static/logo.png';
import { config } from '@/common/config'
import './index.css'

const Menu = lazy(() => import('./../menu'));

/**
 * 移动端的时候，菜单的弹出框
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 */
export default () => {
    const [open, { toggle: toggleOpen }] = useBoolean(false);

    return (
        <>
            <div className="mobileMenuCollapsed" onClick={toggleOpen}>
                <span>
                    <MenuOutlined />
                </span>
            </div>

            <Drawer
                open={open}
                onClose={toggleOpen}
                closable={false}
                width={200}
                styles={{
                    body: {padding: 0}
                }}
                placement="left"
            >
                <div className='mobileMenuWarp'>
                    <div className="logo">
                        <img src={logo} alt="" />
                        <span>{config.company}</span>
                    </div>
                    <div style={{ margin: '0px 5px' }}>
                        <Divider style={{ margin: '0px' }} />
                    </div>
                    <div className="menuWarp">
                        <Menu />
                    </div>
                </div>
            </Drawer>

        </>
    );
};
