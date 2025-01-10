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

    return <>
        {layoutSetting.layoutValue === 'slide' ? <LayoutSlide /> 
        : layoutSetting.layoutValue === 'slideSplitMenus' ? <LayoutSlideSplitMenus /> 
        : layoutSetting.layoutValue === 'left' ? <LayoutLeft /> 
        : layoutSetting.layoutValue === 'top' ? <LayoutTop /> 
        : layoutSetting.layoutValue === 'topSplitMenus' ? <LayoutTopSplitMenus /> 
        : ''}
    </>
};
