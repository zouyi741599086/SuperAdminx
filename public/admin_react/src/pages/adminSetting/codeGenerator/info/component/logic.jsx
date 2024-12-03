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
 * 生成逻辑层
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
        {
            value: 'empty',
            label: '自己写',
        },
    ];
    // 逻辑层类的类型
    const logicTypes = [
        {
            value: 1,
            label: '常规逻辑',
        },
        {
            value: 2,
            label: '全表缓存',
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
                    logic: {
                        ...values.logic, // 只要form中的这些值
                        file_suffix: 'php', // 生成文件的后缀名称
                    },
                    table_name: tableName,
                    code_name: 'logic', // 生成的代码名称
                }).then(res => {
                    if (res.code === 1) {
                        message.success(res.message);
                        formRef.current.setFieldValue('logic_code', res.data.logic_code);
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
                            name={['logic', 'file_name']}
                            label="逻辑层类名"
                            placeholder="请输入"
                            rules={[
                                { required: true, message: '请输入' }
                            ]}
                        />
                    </Col>
                    <Col xs={24} sm={12} md={12} lg={8} xl={6} xxl={6}>
                        <ProFormText
                            name={['logic', 'file_path']}
                            label="命名空间"
                            placeholder="请输入"
                            extra="逻辑层路劲，同时也是命名空间"
                            rules={[
                                { required: true, message: '请输入' }
                            ]}
                        />
                    </Col>
                    <Col xs={24} sm={12} md={12} lg={8} xl={6} xxl={6}>
                        <ProFormRadio.Group
                            name={['logic', 'logic_type']}
                            label="逻辑层类型"
                            rules={[
                                { required: true, message: '请输入' }
                            ]}
                            options={logicTypes}
                            extra="全表缓存列表将不翻页"
                        />
                    </Col>
                </Row>

                <ProFormList
                    name={['logic', 'other_functions']}
                    label="添加其它方法"
                    creatorButtonProps={{
                        creatorButtonText: '添加方法'
                    }}
                >
                    <ProFormGroup>
                        <ProFormText
                            name="title"
                            label="方法名称(中文)"
                            placeholder="请输入"
                            rules={[
                                { required: true, message: '请输入' }
                            ]}
                            fieldProps={{
                                style: { width: 180 }
                            }}
                        />
                        <ProFormText
                            name="name"
                            label="方法名称(英文)"
                            placeholder="请输入"
                            rules={[
                                { required: true, message: '请输入' }
                            ]}
                            fieldProps={{
                                style: { width: 180 }
                            }}
                        />
                        <ProFormSelect
                            name="function_content"
                            label="方法主体内容"
                            placeholder="请选择"
                            options={functionContent}
                            rules={[
                                { required: true, message: '请输入' }
                            ]}
                            fieldProps={{
                                style: { width: 180 }
                            }}
                        />
                    </ProFormGroup>
                </ProFormList>

                <ProForm.Item name="logic_code" >
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
                            operationFile('logic');
                        }}
                    >生成到项目</Button>
                </Flex>
            </ProCard>
        </Affix>
    </>
}
