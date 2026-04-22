import { useRef, useState, useImperativeHandle } from 'react';
import {
    ModalForm, ProFormDigit, ProFormText,
} from '@ant-design/pro-components';
import { payRecordApi } from '@/api/payRecord';
import { App } from 'antd';

/**
 * 退款
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
const RefundMoney = ({ tableReload, ref, ...props }) => {
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
            name="updateShopCoupon"
            formRef={formRef}
            open={open}
            onOpenChange={handleOpenChange}
            title="退款"
            width={460}
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
                const result = await payRecordApi.findData(params);
                if (result.code === 1) {
                    return {
                        money: result.data.refund_money
                    }
                } else {
                    message.error(result.message);
                    setOpen(false);
                }
            }}
            onFinish={async (values) => {
                const result = await payRecordApi.refundMoney({
                    id: currentId,
                    ...values
                });
                if (result.code === 1) {
                    tableReload?.();
                    message.success(result.message);
                    return true;
                } else {
                    message.error(result.message)
                }
            }}
        >
            <ProFormDigit
                label="退款金额"
                name="money"
                min={0.01}
                fieldProps={{
                    precision: 2,
                }}
                rules={[
                    { required: true, message: '请输入' }
                ]}
            />
            <ProFormText
                label="退款原因"
                name="reason"
                rules={[
                    { required: true, message: '请输入' }
                ]}
                extra="会展示给用户看"
            />
        </ModalForm>
    </>;
};

export default RefundMoney;