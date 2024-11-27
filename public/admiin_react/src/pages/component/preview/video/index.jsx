import { Button, Empty, Popover } from 'antd';

/**
 * 预览单个视频
 * 
 * @param {String} url 视频的url
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 */
export default ({ url = '', ...props }) => {
    return <>
        <Popover content={<>
            {url ? <>
                <video width="420" height="260" controls>
                    <source src={url} type="video/mp4" />
                </video>
            </> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="无内容" />}
        </>}>
            <Button type="primary" size="small" ghost >查看</Button>
        </Popover>

    </>
}
