import { useRef, useEffect } from 'react';
import { adminCodeGeneratorApi } from '@/api/adminCodeGenerator';
import {
    ProCard,
    ProForm,
    ProFormText,
    ProFormRadio,
} from '@ant-design/pro-components';
import { App, Space, Flex, Button, Affix, Row, Col } from 'antd';
import CodeHighlight from '@/component/codeHighlight';


/**
 * 生成后台api
 */
export default ({ tableName, operationFile, ...props }) => {
    const { message } = App.useApp();
    const formRef = useRef();

    useEffect(() => {
    }, [tableName]);

    // 后台api类的类型
    const react_api_types = [
        {
            label: '从控制器配置生成',
            value: 1,
        },
        {
            label: '从控制器中反射',
            value: 2,
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
                const result = await adminCodeGeneratorApi.getCodeGeneratorInfo(params);
                return result.data || {};
            }}
            submitter={false}
            onFinish={async (values) => {
                adminCodeGeneratorApi.generatorCode({
                    react_api: {
                        ...values.react_api, // 只要form中的这些值
                        file_suffix: 'js', // 生成文件的后缀名称
                    },
                    table_name: tableName,
                    code_name: 'react_api', // 生成的代码名称
                }).then(res => {
                    if (res.code === 1) {
                        message.success(res.message);
                        formRef.current.setFieldValue('react_api_code', res.data.react_api_code);
                    } else {
                        message.error(res.message);
                    }
                })
            }}
        >
            <Space direction="vertical" style={{ width: '100%' }}>
                <Row gutter={[24, 0]}>

                    <Col xs={24} sm={12} md={12} lg={8} xl={6} xxl={6}>
                        <ProFormText
                            name={['react_api', 'file_name']}
                            label="文件名"
                            placeholder="请输入"
                            rules={[
                                { required: true, message: '请输入' }
                            ]}
                        />
                    </Col>
                    <Col xs={24} sm={12} md={12} lg={8} xl={6} xxl={6}>
                        <ProFormText
                            name={['react_api', 'file_path']}
                            label="生成目录"
                            placeholder="请输入"
                            rules={[
                                { required: true, message: '请输入' }
                            ]}
                        />
                    </Col>
                    <Col xs={24} sm={12} md={12} lg={8} xl={6} xxl={6}>
                        <ProFormRadio.Group
                            name={['react_api', 'generator_type']}
                            label="api生成来源"
                            rules={[
                                { required: true, message: '请输入' }
                            ]}
                            options={react_api_types}
                        />
                    </Col>
                </Row>

                <ProForm.Item name="react_api_code" >
                    <CodeHighlight/>
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
                            operationFile('react_api');
                        }}
                    >生成到项目</Button>
                </Flex>
            </ProCard>
        </Affix>
    </>
}
