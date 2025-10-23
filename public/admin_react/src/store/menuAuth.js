import { proxy } from 'valtio';
import { storage } from '@/common/function';

const storeKey = 'menuAuth';
// 默认值
const defaultValue = {
    menu: [], // 后台返回的所有的menu数据
    menuArrAll: [], // 路由节点 一维数组 包括隐藏的、包括内页路由如修改、详情等
    menuArr: [], // 导航菜单 一维数组 没包括隐藏的
    actionAuthArr: [], // 所有的操作权限的节点的name
    activeMenuPath: [], // 当前所在页面的菜单路劲如 ["news","newsCreate"]
    openKeys: [], // 当前展开的父菜单节点如 ["news","newsCreate"]
    activeData: {}, // 当前打开的菜单数据如 {id:0, title:'首页',...}
};

/**
 * 菜单权限登录
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 */
export const menuAuthStore = proxy(
    storage.get(storeKey) || defaultValue
)

/**
 * 更新状态
 * 
 * @param {object|function} updater 
 */
export const setMenuAuthStore = (updater) => {
    if (typeof updater === 'function') {
        // 函数式更新
        const newState = updater(menuAuthStore);
        Object.assign(menuAuthStore, newState);
    } else {
        // 直接对象赋值
        Object.assign(menuAuthStore, updater);
    }
    // 持久化到存储
    storage.set(storeKey, menuAuthStore);
}