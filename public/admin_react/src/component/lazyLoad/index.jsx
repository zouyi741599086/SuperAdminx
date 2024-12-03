import { Suspense } from 'react';
import { Spin } from 'antd';

/**
 * 页面加载中
 * @param block 是否块状显示加载中
 * @param width 块状显示时候的宽
 * @param height 块状显示时候的高
 * @returns 
 */
const ElementLoading = ({ block = true, width = '100%', height = 400, ...props }) => <>
    {block ? <>
        <div style={{ width: width, height: `${height}px`, maxHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Spin />
        </div>
    </> : ''}
</>

// 加载中
export default (props) => {
    return <Suspense fallback={<ElementLoading  {...props} />}>{props.children}</Suspense>
}
