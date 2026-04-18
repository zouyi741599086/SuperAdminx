import { useRef, useState, useImperativeHandle} from 'react';
import { ModalForm, ProForm, ProFormDependency } from '@ant-design/pro-components';
import { balanceApi } from '@/api/balance';
import { App } from 'antd';
import { ProFormDigit, ProFormSelect } from '@ant-design/pro-components';
import SelectUser from '@/components/selectUser';

/**
 * 账户转账
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
const Trun = ({ tableReload, balanceType, ref, ...props }) => {
    const formRef = useRef();
    const { message } = App.useApp();
    const [open, setOpen] = useState(false);
    const [userId, setUserId] = useState(0);

    // 暴露给父组件的方法
    useImperativeHandle(ref, () => ({
        open: (id) => {
            setUserId(id);
            setOpen(true);
        }
    }));

    const handleOpenChange = (visible) => {
        if (!visible) {
            setOpen(false);
            setUserId(0);
        }
    };

    return <>
        <ModalForm
            name="updateBalance"
            formRef={formRef}
            open={open}
            onOpenChange={handleOpenChange}
            title="账户转账"
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
            onFinish={async (values) => {
                const result = await balanceApi.turn({
                    user_id: userId,
                    ...values
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
            <ProFormSelect
                name="balance_type"
                label="转账余额类型"
                placeholder="请选择"
                request={async () => {
                    return balanceType.filter(item => item.turn).map(item => {
                        return {
                            value: item.field,
                            label: item.title
                        }
                    })
                }}
                rules={[
                    { required: true, message: '请选择' },
                ]}
            />
            <ProFormDependency name={['balance_type']}>
                {({ balance_type }) => {
                    let tmp = balanceType.find(item => item.field == balance_type);
                    return <ProFormDigit
                        name="value"
                        label="转账金额"
                        placeholder="请输入"
                        min={-10000000}
                        fieldProps={{
                            precision: tmp?.precision || 0,
                            style: { width: '100%' },
                        }}
                        rules={[
                            { required: true, message: '请输入' },
                        ]}
                    />
                }}
            </ProFormDependency>
            <ProForm.Item
                name="to_user_id"
                label="转账给"
                rules={[
                    { required: true, message: '请输入' },
                ]}
            >
                <SelectUser />
            </ProForm.Item>

        </ModalForm>
    </>;
};

export default Trun;