import { useRef } from 'react';
import { adminUserTodoApi } from '@/api/adminUserTodo';
import { Button, App } from 'antd';
import {
    ModalForm,
    ProFormGroup,
    ProFormList,
    ProFormTextArea,
    ProFormDateTimePicker,
} from '@ant-design/pro-components';
import dayjs from 'dayjs';

/**
 * 待办事项 新增
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
const Create = ({ tableReload, ...props }) => {
    const formRef = useRef();
    const { message } = App.useApp();

    return <>
        <ModalForm
            name="createadminUserTodo"
            formRef={formRef}
            title="添加待办事项"
            trigger={
                <Button type="primary" size="small" ghost>
                    添加
                </Button>
            }
            width={600}
            // 第一个输入框获取焦点
            autoFocusFirstInput={true}
            // 可以回车提交
            isKeyPressSubmit={true}
            // 不干掉null跟undefined 的数据
            omitNil={false}
            initialValues={{
                list: [
                    {}
                ]
            }}
            onFinish={async (values) => {
                // 时间格式化
                values.list = values.list.map(item => {
                    item.date = dayjs(item.date).format('YYYY-MM-DD HH:mm')
                    return item
                })
                const result = await adminUserTodoApi.create(values);
                if (result.code === 1) {
                    tableReload?.();
                    message.success(result.message);
                    formRef.current?.resetFields();
                    return true;
                } else {
                    message.error(result.message);
                }
            }}
        >
            <ProFormList
                name="list"
                label="待办事项"
                rules={[
                    { required: true, message: '请添加待办事项' },
                ]}
                arrowSort={true}
            >
                <ProFormGroup key="group">
                    <ProFormDateTimePicker
                        name="date"
                        label="日期"
                        placeholder="请选择"
                        fieldProps={{
                            format: 'YYYY-MM-DD HH:mm',
                        }}
                        rules={[
                            { required: true, message: '请选择日期' },
                        ]}
                    />
                    <ProFormTextArea
                        name="content"
                        label="内容"
                        placeholder="请输入"
                        fieldProps={{
                            autoSize: true
                        }}
                        rules={[
                            { required: true, message: '请输入内容' },
                        ]}
                    />
                </ProFormGroup>
            </ProFormList>
        </ModalForm>
    </>;
};

export default Create;