import { App, Button, Space, Image, Empty } from 'antd';
const videoImg = new URL('@/static/default/video.jpg', import.meta.url).href;

/**
 * 预览多个图片或视频
 * @param {String} title 弹窗标题
 * @param {Array} imgs 需要预览的图片或视频数组
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 */
export default ({ title = '查看', imgs = [], ...props }) => {
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
                    <Image.PreviewGroup
                        preview={{
                            imageRender: (e) => {
                                // 判断是否是视频
                                if (e.props.src) {
                                    let arr = e.props.src.split("?video_src=", 2);
                                    if (arr[1]) {
                                        return <video
                                            muted
                                            width="500"
                                            height="300"
                                            controls
                                            src={arr[1]}
                                            key={arr[1]}
                                        />
                                    }
                                }
                                return <div key={e.props.src}>{e}</div>
                            }
                        }}
                    >
                        <Space wrap>
                            {Array.isArray(imgs) ? imgs.map((item, index) => {
                                return <>
                                    {['jpg', 'jpeg', 'png'].indexOf(item.substring(item.lastIndexOf(".") + 1)) == -1 ? <>
                                        <Image
                                            width={80}
                                            height={80}
                                            key={index}
                                            src={`${videoImg}?video_src=${item}`}
                                            video_src={item}
                                            style={{ borderRadius: '5px' }}
                                        />
                                    </> : <>
                                        <Image
                                            width={80}
                                            height={80}
                                            key={index}
                                            src={`${item}`}
                                            style={{ borderRadius: '5px' }}
                                        />
                                    </>}
                                </>
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