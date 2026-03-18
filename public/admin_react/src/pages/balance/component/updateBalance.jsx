import { useRef, useState } from 'react';
import { ModalForm, ProFormDependency } from '@ant-design/pro-components';
import { balanceApi } from '@/api/balance';
import { App } from 'antd';
import { useUpdateEffect } from 'ahooks';
import { ProFormDigit, ProFormSelect, ProFormText, ProFormRadio } from '@ant-design/pro-components';

/**
 * 对象转数组
 * @param {objec} obj 
 * @returns 
 */
const transformToLabelValueArray = (obj) => {
    return Object.entries(obj).map(([value, label]) => ({
        label: label,
        value: value
    }));
};

/**
 * 用户余额 修改
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
const UpdateBalance = ({ tableReload, balanceType, updateBalanceUserId, setUpdateBalanceUserId, ...props }) => {
    const formRef = useRef();
    const { message } = App.useApp();
    const open = updateBalanceUserId > 0;

    const handleOpenChange = (_boolean) => {
        if (!_boolean) {
            Promise.resolve().then(() => {
                setUpdateBalanceUserId(0);
            });
        }
    };

    useUpdateEffect(() => {
        if (updateBalanceUserId > 0) {
            formRef.current?.resetFields?.();
        }
    }, [updateBalanceUserId]);

    return <>
        <ModalForm
            name="updateBalance"
            formRef={formRef}
            open={open}
            onOpenChange={handleOpenChange}
            title="变更用户余额"
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
                const result = await balanceApi.updateBalance({
                    user_id: updateBalanceUserId,
                    ...values
                });
                if (result.code === 1) {
                    tableReload?.();
                    message.success(result.message)
                    formRef.current?.resetFields?.()
                    return true;
                } else {
                    message.error(result.message)
                }
            }}
        >
            <ProFormSelect
                name="balance_type"
                label="余额类型"
                placeholder="请选择"
                request={async () => {
                    return balanceType.map(item => {
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
                    if (balance_type) {
                        let tmp = balanceType.find(item => item.field == balance_type);
                        tmp = transformToLabelValueArray(tmp.details_type);
                        formRef?.current?.setFieldValue('details_type', null);
                        return <ProFormSelect
                            name="details_type"
                            label="明细类型"
                            key={balance_type}
                            placeholder="请选择"
                            options={tmp}
                            rules={[
                                { required: true, message: '请选择' },
                            ]}
                        />
                    }

                }}
            </ProFormDependency>
            <ProFormDependency name={['balance_type']}>
                {({ balance_type }) => {
                    let tmp = balanceType.find(item => item.field == balance_type);
                    return <ProFormDigit
                        name="change_value"
                        label="变更值"
                        placeholder="请输入"
                        min={-10000000}
                        fieldProps={{
                            precision: tmp?.precision || 0,
                            style: { width: '100%' },
                        }}
                        rules={[
                            { required: true, message: '请输入' },
                        ]}
                        extra="增加填写正数，减少填写负数"
                    />
                }}
            </ProFormDependency>
            <ProFormText
                name="title"
                label="变更原因"
                placeholder="请输入"
                rules={[
                    { required: true, message: '请输入' },
                ]}
            />

        </ModalForm>
    </>;
};

export default UpdateBalance;