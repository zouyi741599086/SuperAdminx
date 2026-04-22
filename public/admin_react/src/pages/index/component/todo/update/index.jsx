import { useRef, useState, useImperativeHandle } from 'react';
import { ModalForm, ProFormTextArea, ProFormDateTimePicker  } from '@ant-design/pro-components';
import { adminTodoApi } from '@/api/adminTodo';
import dayjs from 'dayjs';
import { App, Row, Col } from 'antd';

/**
 * 待办事项 修改
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
const Update = ({ tableReload, ref, ...props }) => {
    const formRef = useRef();
    const { message } = App.useApp();
    const [open, setOpen] = useState(false);
    const [currentId, setCurrentId] = useState(0);

    // 暴露给父组件的方法
    useImperativeHandle(ref, () => ({
        open: (id) => {
            setCurrentId(id);
            setOpen(true);
        }
    }));

    const handleOpenChange = (visible) => {
        if (!visible) {
            setOpen(false);
            setCurrentId(0);
        }
    };

    return <>
        <ModalForm
            name="updateAdminTodo"
            formRef={formRef}
            open={open}
            onOpenChange={handleOpenChange}
            title="修改待办事项"
            width={400}
            // 第一个输入框获取焦点
            autoFocusFirstInput={true}
            // 可以回车提交
            isKeyPressSubmit={true}
            // 不干掉null跟undefined 的数据
            omitNil={false}
            modalProps={{
                destroyOnHidden: true,
            }}
            params={{
                id: currentId
            }}
            request={async (params) => {
                const result = await adminTodoApi.findData(params);
                if (result.code === 1) {
                    return result.data;
                } else {
                    message.error(result.message);
                    setOpen(false);
                }
            }}
            onFinish={async (values) => {
                const result = await adminTodoApi.update({
                    id: currentId,
                    ...values,
                    date: dayjs(values.date).format('YYYY-MM-DD HH:mm:ss'), // 时间格式化
                });
                if (result.code === 1) {
                    tableReload?.();
                    message.success(result.message)
                    return true;
                } else {
                    message.error(result.message)
                }
            }}
        >
            <Row gutter={[24, 0]}>
                <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                    <ProFormDateTimePicker
                        name="date"
                        label="日期"
                        placeholder="请选择"
                        format={{
                            format: 'YYYY-MM-DD HH:mm',
                            type: 'mask',
                        }}
                        rules={[
                            { required: true, message: '请选择' },
                        ]}
                    />
                </Col>
                <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                    <ProFormTextArea
                        name="content"
                        label="内容"
                        placeholder="请输入"
                        rules={[
                            { required: true, message: '请输入' },
                        ]}
                    />
                </Col>
            </Row>
        </ModalForm>
    </>;
};

export default Update;