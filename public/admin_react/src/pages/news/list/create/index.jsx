import { useRef, lazy } from 'react';
import { PageContainer, ProCard } from '@ant-design/pro-components';
import { newsApi } from '@/api/news';
import { App, Space, Row, Col, } from 'antd';
import { useNavigate } from "react-router-dom";
import {
    ProForm,
} from '@ant-design/pro-components';
import Lazyload from '@/component/lazyLoad/index';

const Form1 = lazy(() => import('../component/form1'));

/**
 * 添加文章
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 */
export default () => {
    const formRef = useRef();
    const navigate = useNavigate();
    const { message } = App.useApp();

    // 返回上一页
    const onBack = () => {
        navigate('/news/list');
    }

    return <>
        <PageContainer
            className="sa-page-container"
            ghost
            header={{
                title: '添加文章',
                style: { padding: '0 24px 12px' },
                onBack: onBack
            }}
        >
            <ProCard bodyStyle={{ paddingBottom: '40px' }}>
                <ProForm
                    formRef={formRef}
                    layout="horizontal"
                    labelCol={{
                        span: 4,
                    }}
                    wrapperCol={{
                        span: 14,
                    }}
                    submitter={{
                        render: (props, doms) => {
                            return (
                                <Row>
                                    <Col span={14} offset={4}>
                                        <Space>{doms}</Space>
                                    </Col>
                                </Row>
                            )
                        },
                    }}
                    // 可以回车提交
                    isKeyPressSubmit={true}
                    // 不干掉null跟undefined 的数据
                    omitNil={false}
                    onFinish={async (values) => {
                        const result = await newsApi.create(values);
                        if (result.code === 1) {
                            message.success(result.message)
                            onBack();
                            return true;
                        } else {
                            message.error(result.message)
                        }
                    }}
                >
                    <Lazyload>
                        <Form1 />
                    </Lazyload>
                </ProForm>
            </ProCard>
        </PageContainer>
    </>
}
