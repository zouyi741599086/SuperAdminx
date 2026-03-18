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

const QuerySelect = lazy(() => import('./select'));
const ModelForm = lazy(() => import('./modalForm'));
const ModelTable = lazy(() => import('./modalTable'));

/**
 * 后端其它组件
 */
const ReactOther = ({ tableName, operationFile, ...props }) => {
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
                const result = await adminCodeGeneratorApi.findData(params);
                setData(result.data);

                // 第一次进入此页面保存没得问题，第二次进入此页面的时候form_fields_type_config下面的字段是空的数组，如form_fields_type_config.create_time = []，这时候编辑form_fields_type_config.create_time 下多个item的时候会出现编辑好第一个、编辑第二个的时候会将第一个清空的情况，解决办法把空数组改为空对象，这是pro2升级到pro3后出现的问题
                if (result.data?.react_other?.form_fields_type_config) {
                    const config = result.data.react_other.form_fields_type_config;
                    Object.keys(config).forEach(key => {
                        if (Array.isArray(config[key])) {
                            // 如果值是数组，根据业务决定如何处理
                            // 如果数组中的元素需要保留，可以转换为对象并保留数组内容
                            // 这里假设只需要一个空对象来存放 extra1/extra2
                            config[key] = {};
                            // 如果你需要保留数组中的原有数据，可以这样做：
                            // config[key] = { originalArray: config[key] };
                        }
                    });
                }

                // 第一次进入此页面保存没得问题，第二次进入此页面的时候list_fields_type_config下面的字段是空的数组，如list_fields_type_config.create_time = []，这时候编辑list_fields_type_config.create_time 下多个item的时候会出现编辑好第一个、编辑第二个的时候会将第一个清空的情况，解决办法把空数组改为空对象，这是pro2升级到pro3后出现的问题
                if (result.data?.react_other?.list_fields_type_config) {
                    const config = result.data.react_other.list_fields_type_config;
                    Object.keys(config).forEach(key => {
                        if (Array.isArray(config[key])) {
                            // 如果值是数组，根据业务决定如何处理
                            // 如果数组中的元素需要保留，可以转换为对象并保留数组内容
                            // 这里假设只需要一个空对象来存放 extra1/extra2
                            config[key] = {};
                            // 如果你需要保留数组中的原有数据，可以这样做：
                            // config[key] = { originalArray: config[key] };
                        }
                    });
                }

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
            <Space 
				orientation="vertical"
				styles={{ 
					root: {width: '100%'}
				}}
			>
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
                                <QuerySelect
                                    tableName={tableName}
                                />
                            </Lazyload>;
                        }
                        if (react_other?.component_type == 'modalForm') {
                            return <Lazyload>
                                <ModelForm
                                    tableName={tableName}
                                />
                            </Lazyload>;
                        }
                        if (react_other?.component_type == 'modalTable') {
                            return <Lazyload>
                                <ModelTable
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

export default ReactOther;