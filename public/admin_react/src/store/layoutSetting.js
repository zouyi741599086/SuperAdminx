import { atom } from 'recoil';
import { storage } from '@/common/function';

const storeKey = 'layoutSetting';
// 默认值
const defaultValue = {
    layoutValue: "slide", // 布局方式
    antdThemeValue: 'default', // 整体主题 default dark compact
    primaryColorValue: "#1677ff", // 主题色
    bodyFilterValue: false, // 色弱模式
    themeSimple: false, // 简约风，就是没得背景
    isRadius: false, // 导航、顶部等是否圆角
    isMobile: false, // 是否是移动端
    isWidth: false, // 整体页面是否固定宽度
};

/**
 * 后台布局的设置
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 */
export const layoutSettingStore = atom({
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
