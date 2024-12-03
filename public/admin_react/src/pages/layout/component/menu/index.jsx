import { useState, useEffect } from 'react';
import { Menu } from 'antd';
import {
    EllipsisOutlined
} from '@ant-design/icons';
import { useRecoilState } from 'recoil';
import { menuAuthStore } from '@/store/menuAuth';
import { useNavigate } from 'react-router-dom';

/**
 * 数组转多维数据，会给数组增加上级的路劲（数组），这是专门是后台菜单用的
 * @param {Array} arrs 需要转换的一维数据
 * @param {Any} pid 上级
 * @param {String} key 装下级的key
 * @param {Boolean} empty_children 当下级为空的时候，是否需要保留key-children
 * @returns Array
 */
export const menuToTree = (arr, pid = null, key = 'children') => {
    let newArr = [];
    arr.forEach(item => {
        if (item.pid_name == pid) {
            let children = menuToTree(arr, item.name, key);
            if (children.length > 0) {
                item[key] = children;
            }
            if (item.pid_name) {
                item.icon = null;
            }
            newArr.push(item);
        }
    })
    return newArr
}

/**
 * 后台的菜单，有两种分割菜单的布局没有用此组件
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 */
export default ({ menuMode = 'inline' }) => {
    const navigate = useNavigate();
    const [menuAuth, setMenuAuth] = useRecoilState(menuAuthStore);
    const [menuList, setMenuList] = useState();

    // 点击父菜单的时候，控制只展开当前菜单
    const onOpenChange = (keys) => {
        setMenuAuth(_val => {
            return {
                ..._val,
                openKeys: keys
            }
        })
    };

    // 监听菜单数据变化的时候，重置菜单  
    useEffect(() => {
        const _menuList = menuAuth.menuArr.map(item => {
            return {
                key: item.name,
                id: item.id,
                name: item.name,
                pid_name: item.pid_name,
                path: item.path,
                icon: <span className={`iconfont ${item.icon}`}></span>,
                label: item.title,
            };
        })
        setMenuList(menuToTree(_menuList));
    }, [menuAuth.menuArr])

    // 点击菜单的时候
    const onClick = ({ key, keyPath }) => {
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

    return <>
        {menuMode !== 'horizontal' ? (
            <Menu
                style={{ borderRight: '0px', background: 'none', width: '100%', borderBottom: '0px', lineHeight: '55px' }}
                mode={menuMode}
                items={menuList}
                onClick={onClick}
                selectedKeys={menuAuth.activeMenuPath}
                openKeys={menuAuth.openKeys}
                onOpenChange={onOpenChange}
            />
        ) : (
            <Menu
                style={{ borderRight: '0px', background: 'none', width: '100%', borderBottom: '0px', lineHeight: '55px' }}
                mode={menuMode}
                items={menuList}
                onClick={onClick}
                selectedKeys={menuAuth.activeMenuPath}
                // 顶部导航的时候不需要打开菜单
                //openKeys={menuAuth.openKeys}
                onOpenChange={onOpenChange}
                overflowedIndicator={
                    <>更多<EllipsisOutlined /></>
                }
            />
        )}
    </>;
};
