import { Empty } from 'antd';

// 数据为空
const RenderEmpty = () => {
    const emptyImg = new URL('@/static/default/empty.png', import.meta.url).href;
    return <>
        <Empty
            image={emptyImg}
            styles={{
                image: {
                    height: 60,
                }
            }}
        />
    </>
}

export default RenderEmpty;