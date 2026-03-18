import { useRef } from 'react';
import {
    ModalForm,
    ProFormTextArea,
} from '@ant-design/pro-components';
import { balanceWithdrawApi } from '@/api/balanceWithdraw';
import { App } from 'antd';
import { useUpdateEffect } from 'ahooks';

const Audit = ({ tableReload, updateId, setUpdateId, updateStatusValue, ...props }) => {
    const formRef = useRef();
    const { message } = App.useApp();
    const open = updateId.length > 0;

    const handleOpenChange = (_boolean) => {
        if (!_boolean) {
            Promise.resolve().then(() => {
                setUpdateId([]);
            });
        }
    };

    useUpdateEffect(() => {
        if (updateId.length > 0) {
            formRef.current?.resetFields?.();
        }
    }, [updateId]);

    return (
        <ModalForm
            name="updateNumberCount"
            formRef={formRef}
            open={open}
            onOpenChange={handleOpenChange}
            title={updateStatusValue === 6 ? '审核拒绝' : '打款失败'}
            width={460}
            //第一个输入框获取焦点
            autoFocusFirstInput={true}
            //可以回车提交
            isKeyPressSubmit={true}
            //不干掉null跟undefined 的数据
            omitNil={false}
            onFinish={async (values) => {
                const result = await balanceWithdrawApi.updateStatus({
                    id: updateId,
                    status: updateStatusValue,
                    ...values
                });
                if (result.code === 1) {
                    tableReload();
                    message.success(result.message)
                    formRef.current?.resetFields?.()
                    return true;
                } else {
                    message.error(result.message)
                }
            }}
        >
            <ProFormTextArea
                name="reason"
                label={updateStatusValue === 6 ? '拒绝理由' : '失败原因'}
                placeholder="请输入"
                rules={[
                    { required: true, message: '请输入' }
                ]}
            />
        </ModalForm>
    );
};

export default Audit;