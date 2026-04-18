import { useRef, useState, useImperativeHandle } from 'react';
import {
    ModalForm,
    ProFormTextArea,
} from '@ant-design/pro-components';
import { balanceWithdrawApi } from '@/api/balanceWithdraw';
import { App } from 'antd';

/**
 * 审核拒绝 或 打款失败
 */
const Audit = ({ tableReload, ref, ...props }) => {
    const formRef = useRef();
    const { message } = App.useApp();
    const [open, setOpen] = useState(false);
    const [currentId, setCurrentId] = useState(0);
    const [status, setStatus] = useState(0);

    // 暴露给父组件的方法
    useImperativeHandle(ref, () => ({
        open: (id, _status) => {
            setCurrentId(id);
            setStatus(_status);
            setOpen(true);
        }
    }));

    const handleOpenChange = (visible) => {
        if (!visible) {
            setOpen(false);
            setCurrentId(0);
        }
    };

    return (
        <ModalForm
            name="updateNumberCount"
            formRef={formRef}
            open={open}
            onOpenChange={handleOpenChange}
            title={status === 6 ? '审核拒绝' : '打款失败'}
            width={460}
            //第一个输入框获取焦点
            autoFocusFirstInput={true}
            //可以回车提交
            isKeyPressSubmit={true}
            //不干掉null跟undefined 的数据
            omitNil={false}
            modalProps={{
                destroyOnHidden: true,
            }}
            onFinish={async (values) => {
                const result = await balanceWithdrawApi.updateStatus({
                    id: currentId,
                    status: status,
                    ...values
                });
                if (result.code === 1) {
                    tableReload();
                    message.success(result.message)
                    return true;
                } else {
                    message.error(result.message)
                }
            }}
        >
            <ProFormTextArea
                name="reason"
                label={status === 6 ? '拒绝理由' : '失败原因'}
                placeholder="请输入"
                rules={[
                    { required: true, message: '请输入' }
                ]}
            />
        </ModalForm>
    );
};

export default Audit;