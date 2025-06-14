import { useState } from 'react'
import { ProCard } from '@ant-design/pro-components';
import { Card, Flex } from 'antd';
import { useRecoilState } from 'recoil';
import UpdateShortcutMenu from './updateShortcutMenu';
import { useMount } from 'ahooks';
import { adminUserShortcutMenuApi } from '@/api/adminUserShortcutMenu';
import { menuAuthStore } from '@/store/menuAuth';
import { useNavigate } from 'react-router-dom';
import './shortcutMenu.css'

/**
 * 快捷菜单
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 */
export default () => {
    const [menuAuth] = useRecoilState(menuAuthStore);
    const navigate = useNavigate();

    // 我的快捷菜单
    const [menuList, setMenuList] = useState([]);
    useMount(() => {
        getMenuList();
    })

    // 获取我选中的菜单
    const getMenuList = () => {
        adminUserShortcutMenuApi.getList().then(result => {
            if (result.code === 1) {
                setMenuList(result.data.map(item => item.AdminMenu));
            } else {
                message.error(result.message);
            }
        });
    }

    // 跳转url
    const toUrl = (name) => {
        // 找出菜单进行跳转
        menuAuth.menuArr.some(item => {
            if (item.name === name) {
                // 外部链接
                if (item.type === 3) {
                    return window.open(item.url, '_blank', '');
                }
                navigate(item.path);
                return true;
            }
        })
    }

    return <>
        <ProCard>
            <Flex
                wrap
                gap="small"
                className="admin-user-shortcut-menu-card"
            >
                {menuList.map(item => <>
                    <Card
                        hoverable={true}
                        size="small"
                        style={{
                            width: 80,
                            textAlign: 'center',
                        }}
                        className="menu-card-item"
                        onClick={() => {
                            console.log(item.name)
                            console.log(item)
                            toUrl(item.name);
                        }}
                    >
                        <div>
                            <span className={`iconfont ${item.icon}`}></span>
                            <div className="menu-title">{item.title}</div>
                        </div>
                    </Card>
                </>)}
                <UpdateShortcutMenu
                    getMenuList={getMenuList}
                />
            </Flex>
        </ProCard>
    </>
}
