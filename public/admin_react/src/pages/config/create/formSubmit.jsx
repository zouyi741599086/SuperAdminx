import { useRef, useState } from 'react';
import { configApi } from '@/api/config';
import { App, } from 'antd';
import { useNavigate } from "react-router-dom";
import {
    ProForm,
    ProFormText,
    ProFormTextArea,
    ProFormDigit,
} from '@ant-design/pro-components';
import { useSearchParams } from "react-router-dom";
import { useMount } from 'ahooks';

export default ({ fields, setFields, type }) => {
    const formRef = useRef();
    const navigate = useNavigate();
    const { message } = App.useApp();
    const [search] = useSearchParams();

    // 修改的时候
    const [id, setId] = useState(0);
    useMount(() => {
        let id = search.get('id');
        if (id) {
            setId(id);
            configApi.findData({ id }).then(res => {
                if (res.code === 1) {
                    setFields(res.data.fields_config);
                    formRef?.current?.setFieldsValue(res.data);
                } else {
                    message.error(res.message)
                    onBack();
                }
            })
        }
    })

    ////////////////返回上一页//////////////////
    const onBack = () => {
        navigate('/config');
    }

    return (
        <>
            <ProForm
                formRef={formRef}
                layout="vertical"
                // 不干掉null跟undefined 的数据
                omitNil={false}
                onFinish={async (values) => {
                    if (fields.length === 0) {
                        message.error('还没有添加表单字段~')
                        return false;
                    }
                    if (fields.some(_item => !_item.name)) {
                        message.error('表单字段未设置完~')
                        return false;
                    }

                    let formData = {
                        fields_config: fields,
                        type: type,
                        id,
                        ...values,
                    };

                    // 如果是列表
                    if (type === 'list') {
                        formData.fields_config = [
                            {
                                title: '',
                                valueType: 'formList',
                                dataIndex: 'content',
                                name: 'content',
                                columns: fields
                            }
                        ];
                    }
                    // 判断是添加还是修改
                    let result = id ? await configApi.update(formData) : await configApi.create(formData);
                    if (result.code === 1) {
                        message.success(result.message)
                        onBack();
                        return true;
                    } else {
                        message.error(result.message)
                    }
                }}
            >

                <ProFormText
                    name="title"
                    label="配置名称（中文）"
                    placeholder="请输入"
                    rules={[
                        { required: true, message: '请输入' }
                    ]}
                />
                <ProFormText
                    name="name"
                    label="配置名称（英文）"
                    placeholder="请输入"
                    extra="唯一，获取配置就用它"
                    rules={[
                        { required: true, message: '请输入' }
                    ]}
                />
                {type === 'list' ? <>
                    <ProFormDigit
                        label="列表最大条数"
                        name="list_number"
                        min={1}
                        fieldProps={{ precision: 0 }}
                        placeholder="请输入"
                        rules={[
                            { required: true, message: '请输入' }
                        ]}
                    />
                </> : ''}
                <ProFormTextArea
                    name="description"
                    label="配置说明"
                    placeholder="请输入"
                    fieldProps={{
                        autoSize: {
                            minRows: 2,
                            maxRows: 6,
                        }
                    }}
                />
            </ProForm>
        </>
    )
}
