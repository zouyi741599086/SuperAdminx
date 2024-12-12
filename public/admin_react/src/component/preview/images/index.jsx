import { App, Button, Space, Image, Empty } from 'antd';

/**
 * 预览多个图片
 * @param {String} title 弹窗标题
 * @param {Array} imgs 需要预览的图片数组
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 */
export default ({ title = '查看图片', imgs = [], ...props }) => {
    const { modal } = App.useApp();

    return <>
        <Button type="primary" ghost size="small" onClick={() => {
            modal.info({
                title: title,
                icon: <></>,
                width: 510,
                footer: null,
                closable: true,
                content: <>
                    <Image.PreviewGroup>
                        <Space wrap>
                            {Array.isArray(imgs) ? imgs.map((item, index) => {
                                return <Image width={80} height={80} key={index} src={`${item}`} style={{ borderRadius: '5px' }} />
                            }) : ''}
                        </Space>
                    </Image.PreviewGroup>
                    {(! imgs || (Array.isArray(imgs) && imgs.length === 0)) ? <>
                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="无图片" />
                    </> : ''}
                </>,
                maskClosable: true
            });
        }}>{Array.isArray(imgs) ? imgs.length : 0}张</Button>
    </>
}
