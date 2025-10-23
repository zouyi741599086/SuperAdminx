import { proxy } from 'valtio';
import { storage } from '@/common/function';

const storeKey = 'layoutSetting';
// 默认值
const defaultValue = storage.get(storeKey) || {
    layoutValue: "slide", // 布局方式
    antdThemeValue: 'default', // 整体主题 default dark compact
    primaryColorValue: "#f5222d", // 主题色
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
export const layoutSettingStore = proxy(
    storage.get(storeKey) || defaultValue
)

/**
 * 更新状态
 * 
 * @param {object|function} updater 
 */
export const setLayoutSettingStore = (updater) => {
    if (typeof updater === 'function') {
        // 函数式更新
        const newState = updater(layoutSettingStore);
        Object.assign(layoutSettingStore, newState);
    } else {
        // 直接对象赋值
        Object.assign(layoutSettingStore, updater);
    }
    // 持久化到存储
    storage.set(storeKey, layoutSettingStore);
}
