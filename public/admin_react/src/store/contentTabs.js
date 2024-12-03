import { atom } from 'recoil';
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
export const contentTabsStore = atom({
    key: storeKey,
    // 默认值
    default: defaultValue,
    // 不需要永久存储可删除
    effects_UNSTABLE: [
        ({ setSelf, onSet }) => {
            let _oldValue = storage.get(storeKey);
            if (_oldValue) {
                setSelf(_oldValue)
            }
            onSet(_newValue => {
                storage.set(storeKey, _newValue);
            })
        }
    ],
});
