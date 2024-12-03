import { Empty } from 'antd';

// 数据为空
export default () => {
    const emptyImg = new URL('@/static/default/empty.png', import.meta.url).href;
    return <>
        <Empty
            image={emptyImg}
            imageStyle={{
                height: 60,
            }}
        />
    </>
}
