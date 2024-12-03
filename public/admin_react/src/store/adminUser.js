import { atom } from 'recoil';
import { storage } from '@/common/function';

const storeKey = 'adminUser';
// 默认值
const defaultValue = {};

/**
 * 保存登录者的信息
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 */
export const adminUserStore = atom({
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
