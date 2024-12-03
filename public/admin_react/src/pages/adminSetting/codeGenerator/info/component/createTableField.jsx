import { useRef, } from 'react';
import { EditOutlined } from '@ant-design/icons';
import { ModalForm, ProFormText, } from '@ant-design/pro-components';
import { Button, Row, Col } from 'antd';

/**
 * 给表添加额外的字段
 */
export default ({ callback, ...props }) => {
    const formRef = useRef();

    return <>
        <ModalForm
            name="createFormField"
            formRef={formRef}
            title="添加Form字段"
            trigger={
                <Button
                    block
                    type="dashed"
                    icon={<EditOutlined />}
                >Table添加额外字段</Button>
            }
            width={400}
            // 第一个输入框获取焦点
            autoFocusFirstInput={true}
            // 可以回车提交
            isKeyPressSubmit={true}
            // 不干掉null跟undefined 的数据
            omitNil={false}
            modalProps={{
                destroyOnClose: true,
            }}
            onFinish={async (values) => {
                return callback(values);
            }}
        >
            <Row gutter={[24, 0]}>

                <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                    <ProFormText
                        name="Field"
                        label="字段名称（英文）"
                        placeholder="请输入"
                        fieldProps={{
                        }}
                        extra="不可重复"
                        rules={[
                            { required: true, message: '请输入' },
                        ]}
                    />
                </Col>
            </Row>
        </ModalForm>
    </>;
};