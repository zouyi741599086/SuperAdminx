import { useState } from 'react'
import { ProCard } from '@ant-design/pro-components';
import { App, Statistic, Row, Col, Tooltip } from 'antd';
import { adminTotalApi } from '@/api/adminTotal';
import { useMount, useInterval } from 'ahooks';
import { authCheck } from '@/common/function';
import { useNavigate } from 'react-router';
import {
    QuestionCircleOutlined,
} from '@ant-design/icons';

/**
 * 快捷菜单
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 */
const StatisticsCom = () => {
    const navigate = useNavigate();
    const { message } = App.useApp();

    const [data, setData] = useState({});
    useMount(() => {
        getData();
    })

    // 每分钟获取一次数据
    useInterval(() => {
        getData();
    }, 1000 * 60);

    const getData = () => {
        adminTotalApi.index().then(res => {
            if (res.code === 1) {
                setData(res.data);
            } else {
                message.error(res.message)
            }
        })
    }

    return <>
        <ProCard
            title="待操作"
        >
            <Row gutter={16}>
                <Col
                    xs={24} sm={12} md={12} xl={8} xxl={6}
                    style={{
                        cursor: 'pointer',
                    }}
                    onClick={() => {
                        if (!authCheck('balanceWithdraw')) {
                            navigate('/balance/withdraw');
                        } else {
                            message.warning('您没有权限访问此功能');
                        }
                    }}
                >
                    <Statistic
                        title={<>提现待处理
                            <Tooltip title="包含：待审核、待打款订单">
                                <QuestionCircleOutlined />
                            </Tooltip>
                        </>}
                        value={data?.balance_withdraw || 0}
                    />
                </Col>
            </Row>
        </ProCard>
    </>
}

export default StatisticsCom;