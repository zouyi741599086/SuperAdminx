import { lazy } from 'react';
import { useRecoilState } from 'recoil';
import { layoutSettingStore } from '@/store/layoutSetting';

const LayoutSlide = lazy(() => import('./layoutSlide/index'));
const LayoutSlideSplitMenus = lazy(() => import('./layoutSlideSplitMenus/index'));
const LayoutLeft = lazy(() => import('./layoutLeft/index'));
const LayoutTop = lazy(() => import('./layoutTop/index'));
const LayoutTopSplitMenus = lazy(() => import('./layoutTopSplitMenus/index'));

/**
 * 后台布局，根据设置的参数切换布局
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 */
export default () => {
    const [layoutSetting] = useRecoilState(layoutSettingStore);

    if (layoutSetting.layoutValue === 'slide') {
        return <LayoutSlide />
    }
    if (layoutSetting.layoutValue === 'slideSplitMenus') {
        return <LayoutSlideSplitMenus />
    }
    if (layoutSetting.layoutValue === 'left') {
        return <LayoutLeft />
    }
    if (layoutSetting.layoutValue === 'top') {
        return <LayoutTop />
    }
    if (layoutSetting.layoutValue === 'topSplitMenus') {
        return <LayoutTopSplitMenus />
    }
};
