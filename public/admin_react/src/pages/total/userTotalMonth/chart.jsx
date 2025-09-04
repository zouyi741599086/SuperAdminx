import { useState } from 'react'
import { ProCard } from '@ant-design/pro-components';
import { App } from 'antd';
import { userTotalMonthApi } from '@/api/userTotalMonth';
import { useMount } from 'ahooks';
import { Line } from '@ant-design/plots';

export default () => {
    const { message } = App.useApp();

    useMount(() => {
        getTotal();
    });

    ///////////近1年用户注册量///////////////
    const [line1, setLine1] = useState({})
    const getTotal = () => {
        userTotalMonthApi.getTotal().then(res => {
            if (res.code === 1) {
                setLine1({
                    data: res.data,
                    xField: 'month',
                    yField: 'count',
                    // point: {
                    //     shapeField: 'square',
                    //     sizeField: 4,
                    // },
                    shapeField: 'smooth',
                    // interaction: {
                    //     tooltip: {
                    //         marker: true,
                    //     },
                    // },
                    // scrollbar: {
                    //     x: {
                    //         // 动态设置滚动条 滚动的比例，每屏显示40条数据
                    //         ratio: res.data.length < 40 ? 1 : 1 / (res.data.length / 40)
                    //     },
                    // },
                    slider: {
                        x: {},
                    },
                    style: {
                        lineWidth: 3,
                    },

                })
            } else {
                message.error(res.message);
            }
        })
    }

    return (
        <>
            <ProCard title="近1年用户注册量">
                <Line {...line1} />
            </ProCard>
        </>
    )
}
