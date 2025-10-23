import { proxy } from 'valtio';
import { storage } from '@/common/function';

const storeKey = 'contentTabs';
// 默认值
const defaultValue = {
    activeName: '',
    keepAlive: [],
    list: [
        {
            close: false,
            keepAlive: [],
            path: "/index",
            title: "首页",
            name: 'index'
        }
    ],
};

/**
 * 多页面切换的tabs 
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 */
export const contentTabsStore = proxy(
    storage.get(storeKey) || defaultValue
)

/**
 * 更新状态
 * 
 * @param {object|function} updater 
 */
export const setContentTabsStore = (updater) => {
    if (typeof updater === 'function') {
        // 函数式更新
        const newState = updater(contentTabsStore);
        Object.assign(contentTabsStore, newState);
    } else {
        // 直接对象赋值
        Object.assign(contentTabsStore, updater);
    }
    // 持久化到存储
    storage.set(storeKey, contentTabsStore);
}
