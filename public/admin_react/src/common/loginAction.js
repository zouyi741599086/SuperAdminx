import { storage } from '@/common/function';

// 把菜单的上下级路劲改为数组
const menuPidPathNameToArr = (arr) => {
    arr.map(item => {
        item.pid_name_path = item.pid_name_path.split(",");
        item.pid_name_path = item.pid_name_path.filter((name, key) => {
            if (name !== "") {
                return true
            }
        })
    })
    return arr;
}

/**
 * 登录后的操作
 * @param {object} adminUser 登录成功后后台返回的用户数据
 * @param {function} setAdminUser 设置store用户信息的方法
 * @param {function} setMenuAuth 设置store菜单权限数据的方法
 */
export const loginAction = (adminUser, setAdminUser, setMenuAuth) => {

    // 把首页注入到权限里面
    adminUser.menu.unshift({
        id: 0,
        title: '首页',
        path: '/index',
        type: 2,
        hidden: 1,
        icon: 'icon-shouyefill',
        component_path: '/index',
        name: 'index',
        pid_name: null,
        pid_name_path: ',index,',
        desc: '',
        is_params: 1,
    });

    // 先将所有权限节点数据清洗，把pid_path变为数组》数字
    adminUser.menu = [...menuPidPathNameToArr(adminUser.menu)];

    // 导航菜单数据
    let menuArr = [];
    // 路由数据，包含隐藏菜单、内页路由如修改详情等
    let menuArrAll = [];
    // 用户拥有的所有的权限节点的name
    let actionAuthArr = [];

    adminUser.menu.map(item => {
        if ([1, 2, 3, 4, 7].indexOf(item.type) !== -1 && item.hidden == 1) {
            menuArr.push(item);
        }
        // 我的超级权限，把隐藏的菜单也显示出来
        if (adminUser.id == 1 && item.hidden == 2) {
            menuArr.push(item);
        }
        if ([2, 4, 5, 7].indexOf(item.type) !== -1) {
            menuArrAll.push(item);
        }
        actionAuthArr.push(item.name);
    })

    // 设置用户登录信息
    setAdminUser(adminUser);

    // 存入权限验证的所有节点id
    storage.set('actionAuthArr', actionAuthArr);

    // 设置用户权限节点
    setMenuAuth((_val) => {
        return {
            ..._val,
            menu: adminUser.menu,
            menuArrAll,
            menuArr,
            actionAuthArr,
        }
    })
}
