import { useRef, useState, lazy } from 'react';
import { adminCodeGeneratorApi } from '@/api/adminCodeGenerator';
import {
    ProCard,
    ProForm,
    ProFormDependency,
    ProFormRadio,
} from '@ant-design/pro-components';
import { App, Space, Flex, Button, Affix } from 'antd';
import CodeHighlight from '@/component/codeHighlight';
import Lazyload from '@/component/lazyLoad/index';

const ReactOtherSelect = lazy(() => import('./reactOtherSelect'));
const ReactOtherModalForm = lazy(() => import('./reactOtherModalForm'));
const ReactOtherModalTable = lazy(() => import('./reactOtherModalTable'));

/**
 * 后端其它组件
 */
export default ({ tableName, operationFile, ...props }) => {
    const { message } = App.useApp();
    const formRef = useRef();

    const [data, setData] = useState({});

    return <>
        <ProForm
            formRef={formRef}
            size="small"
            params={{
                table_name: tableName
            }}
            request={async (params) => {
                const result = await adminCodeGeneratorApi.getCodeGeneratorInfo(params);
                setData(result.data);

                return result.data || {};
            }}
            submitter={false}
            onFinish={async (values) => {
                adminCodeGeneratorApi.generatorCode({
                    react_other: {
                        ...data?.react_other,
                        ...values.react_other, // 只要form中的这些值
                        file_name: 'index', // 生成的文件名称
                        file_suffix: 'jsx', // 生成文件的后缀名称
                    },
                    table_name: tableName,
                    code_name: 'react_other', // 生成的代码名称
                }).then(res => {
                    if (res.code === 1) {
                        message.success(res.message);
                        // 保存后有生成新的代码要 设置进去
                        formRef.current.setFieldValue('react_other_code', res.data.react_other_code);
                    } else {
                        message.error(res.message);
                    }
                })
            }}
        >
            <Space direction="vertical" style={{ width: '100%' }}>
                <ProFormRadio.Group
                    name={['react_other', 'component_type']}
                    label="页面类型"
                    placeholder="请选择"
                    options={[
                        {
                            value: 'select',
                            label: '搜索选择某条数据'
                        },
                        {
                            value: 'modalForm',
                            label: '弹窗form'
                        },
                        {
                            value: 'modalTable',
                            label: '弹窗列表'
                        }
                    ]}
                    rules={[
                        { required: true, message: '请选择' }
                    ]}
                />

                <ProFormDependency name={[['react_other', 'component_type']]}>
                    {({ react_other }) => {
                        if (react_other?.component_type == 'select') {
                            return <Lazyload>
                                <ReactOtherSelect
                                    tableName={tableName}
                                />
                            </Lazyload>;
                        }
                        if (react_other?.component_type == 'modalForm') {
                            return <Lazyload>
                                <ReactOtherModalForm
                                    tableName={tableName}
                                />
                            </Lazyload>;
                        }
                        if (react_other?.component_type == 'modalTable') {
                            return <Lazyload>
                                <ReactOtherModalTable
                                    tableName={tableName}
                                />
                            </Lazyload>;
                        }
                    }}
                </ProFormDependency>

                <ProForm.Item
                    name="react_other_code"
                >
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
                            operationFile('react_other');
                        }}
                    >生成到项目</Button>
                </Flex>
            </ProCard>
        </Affix>
    </>
}
