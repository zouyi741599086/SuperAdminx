import { useRef, useState, useImperativeHandle } from 'react';
import {
    ModalForm
} from '@ant-design/pro-components';
import { balanceWithdrawApi } from '@/api/balanceWithdraw';
import { App, Descriptions } from 'antd';

/**
 * 查看详情
 */
const Info = ({ ref, ...props }) => {
    const formRef = useRef();
    const { message } = App.useApp();
    const [items, setItems] = useState([]);
    const [open, setOpen] = useState(false);
    const [currentId, setCurrentId] = useState(0);

    // 暴露给父组件的方法
    useImperativeHandle(ref, () => ({
        open: (id) => {
            setCurrentId(id);
            getData(id);
            setOpen(true);
        }
    }));

    const handleOpenChange = (visible) => {
        if (!visible) {
            setOpen(false);
            setCurrentId(0);
        }
    };

    const getData = (id) => {
        balanceWithdrawApi.findData({
            id: id
        }).then(res => {
            if (res.code === 1) {
                let _items = [
                    {
                        key: 'user',
                        label: '用户',
                        children: <>{res.data?.User?.name}/{res.data?.User?.tel}</>,
                    },
                    {
                        key: 'orderno',
                        label: '订单编号',
                        children: res.data?.orderno,
                    },
                    {
                        key: 'status',
                        label: '状态',
                        children: <>
                            {res.data?.status === 2 ? '待审核' : ''}
                            {res.data?.status === 4 ? '审核通过待打款' : ''}
                            {res.data?.status === 6 ? '审核拒绝' : ''}
                            {res.data?.status === 8 ? '已打款' : ''}
                            {res.data?.status === 10 ? '打款失败' : ''}
                        </>,
                    },
                    {
                        key: 'money',
                        label: '提现金额',
                        children: <>￥{res.data?.money}</>,
                    },
                    {
                        key: 'shouxufei',
                        label: '手续费',
                        children: <>￥{res.data?.shouxufei}</>,
                    },
                    {
                        key: 'on_money',
                        label: '真实到账',
                        children: <>￥{res.data?.on_money}</>,
                    },
                    {
                        key: 'bank_title',
                        label: '提现帐号',
                        children: <>
                            {res.data?.bank_title}/{res.data?.bank_name}<br />
                            {res.data?.bank_number}
                        </>,
                    },
                    {
                        key: 'create_time',
                        label: '申请时间',
                        children: res.data?.create_time,
                    }
                ];

                if (res.data?.audit_time) {
                    _items.push({
                        key: 'audit_time',
                        label: '审核时间',
                        children: res.data?.audit_time,
                    });
                }

                if (res.data?.pay_time) {
                    _items.push({
                        key: 'pay_time',
                        label: '打款时间',
                        children: res.data?.pay_time,
                    });
                }

                if (res.data?.reason) {
                    _items.push({
                        key: 'reason',
                        label: res.data?.status === 6 ? '拒绝原因' : '失败原因',
                        children: res.data?.reason,
                    });
                }

                setItems(_items);
            } else {
                message.error(result.message);
            }
        })
    };

    return (
        <ModalForm
            name="tixianinfo"
            formRef={formRef}
            open={open}
            onOpenChange={handleOpenChange}
            submitter={false}
            title="提现详情"
            width={460}
            modalProps={{
                destroyOnHidden: true,
            }}
        >
            <Descriptions
                size="small"
                column={1}
                bordered={true}
                items={items}
            />
        </ModalForm>
    );
};

export default Info;