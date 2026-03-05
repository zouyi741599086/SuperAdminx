import { useRef, useEffect } from 'react';
import { adminCodeGeneratorApi } from '@/api/adminCodeGenerator';
import {
    ProCard,
    ProFormList,
    ProForm,
    ProFormText,
    ProFormGroup,
    ProFormSelect,
    ProFormRadio,
} from '@ant-design/pro-components';
import { App, Space, Flex, Button, Affix, Row, Col } from 'antd';
import CodeHighlight from '@/component/codeHighlight';

/**
 * 生成服务层
 */
export default ({ tableName, operationFile, ...props }) => {
    const { message } = App.useApp();
    const formRef = useRef();

    useEffect(() => {
    }, [tableName]);

    // 自定义方法里面的主体内容
    const functionContent = [
        {
            value: 'updateAll',
            label: '批量更新字段',
        },
    ];

    return <>
        <ProForm
            formRef={formRef}
            size="small"
            params={{
                table_name: tableName
            }}
            request={async (params) => {
                const result = await adminCodeGeneratorApi.findData(params);
                return result.data || {};
            }}
            submitter={false}
            onFinish={async (values) => {
                adminCodeGeneratorApi.generatorCode({
                    service: {
                        ...values.service, // 只要form中的这些值
                        file_suffix: 'php', // 生成文件的后缀名称
                    },
                    table_name: tableName,
                    code_name: 'service', // 生成的代码名称
                }).then(res => {
                    if (res.code === 1) {
                        message.success(res.message);
                        formRef.current.setFieldValue('service_code', res.data.service_code);
                    } else {
                        message.error(res.message);
                    }
                })
            }}
        >
            <Space 
				orientation="vertical"
				styles={{ 
					root: {width: '100%'}
				}}
			>
                <Row gutter={[24, 0]}>
                    <Col xs={24} sm={12} md={12} lg={8} xl={6} xxl={6}>
                        <ProFormText
                            name={['service', 'file_name']}
                            label="逻辑层类名"
                            placeholder="请输入"
                            rules={[
                                { required: true, message: '请输入' }
                            ]}
                        />
                    </Col>
                    <Col xs={24} sm={12} md={12} lg={8} xl={6} xxl={6}>
                        <ProFormText
                            name={['service', 'file_path']}
                            label="命名空间"
                            placeholder="请输入"
                            extra="逻辑层路劲，同时也是命名空间"
                            rules={[
                                { required: true, message: '请输入' }
                            ]}
                        />
                    </Col>
                </Row>

                <ProForm.Item name="service_code" >
                    <CodeHighlight language='php' />
                </ProForm.Item>
            </Space>

        </ProForm>

        <Affix offsetBottom={10}>
            <ProCard boxShadow>
                <Flex align="center" justify="center" gap="small">
                    <Button
                        type="primary"
                        size="default"
                        onClick={() => {
                            formRef.current.submit();
                        }}
                    >保存设置》生成预览代码</Button>
                    <Button
                        danger
                        onClick={() => {
                            operationFile('service');
                        }}
                    >生成到项目</Button>
                </Flex>
            </ProCard>
        </Affix>
    </>
}
