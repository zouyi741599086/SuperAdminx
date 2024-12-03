import { lazy } from 'react';
import { Alert } from 'antd';
import { useRecoilState } from 'recoil';
import { layoutSettingStore } from '@/store/layoutSetting';

const Tinymce = lazy(() => import('./tinymce/index'));

/**
 * 富文本编辑器
 * @param {String} value 默认值
 * @param {fun} onChange 修改value事件
 * @param {boolean} disabled 是否禁用编辑器
 * @param {boolean} toolbarDisabled 工具栏是否显示，如果是在弹出框里面的就需要禁用，否则点击更多工具的时候，弹窗关闭了，而工具选择无法关闭
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 */
export default (props) => {
    const [layoutSetting] = useRecoilState(layoutSettingStore);
    // 判断是否是苹果的Safari浏览器或谷歌浏览器
    const isMobileSafariOrChrome = () => {
        var userAgent = navigator.userAgent;
        var isSafari = /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);
        var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
        var isMobile = /iPhone|iPad|iPod|Android/.test(userAgent);
        return isMobile && (isSafari || isChrome);
    }

    return <>
        {/* Tinymce编辑器在移动端的时候必须要苹果的Safari浏览器或谷歌浏览器才行 */}
        {(!layoutSetting.isMobile || isMobileSafariOrChrome()) ? <Tinymce {...props} /> : <>
            <Alert
                message="错误"
                description="当前浏览器无法编辑，请使用iPhone的Safari浏览器或下载谷歌的Chrome浏览器进行访问~"
                type="error"
                showIcon
            />
        </>}

    </>
}
