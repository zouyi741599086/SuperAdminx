import { App, Button, Empty, Popover } from 'antd';

/**
 * 预览文字内容
 * @param {String} title 弹窗标题
 * @param {String} content 需要预览的文字内容
 * @param {Boolean} isShow 是否直接展示内容，不用弹窗
 * @param {Int} type 查看方式，1》modal的弹窗查看，2》Popover气泡卡片鼠标放上去就查看
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 */
export default ({ title = '查看内容', content = '', isShow = false, type = 2, ...props }) => {
    const { modal } = App.useApp();
    return <>
        {isShow ? <>
            {content ? content : '--'}
        </> : type == 2 ? <>
            <Popover content={<>
                {content ? <p style={{ maxWidth: '300px', maxHeight: '200px', overflowY: 'auto' }}>{content}</p> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="无内容" />}
            </>}>
                <Button type="primary" size="small" ghost >查看</Button>
            </Popover>
        </> : <>
            <Button type="primary" size="small" ghost onClick={() => {
                modal.info({
                    title: title,
                    icon: <></>,
                    footer: null,
                    closable: true,
                    content: <>
                        {content ? content : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="无内容" />}
                    </>,
                    maskClosable: true
                });
            }}>查看</Button>
        </>}

    </>
}
