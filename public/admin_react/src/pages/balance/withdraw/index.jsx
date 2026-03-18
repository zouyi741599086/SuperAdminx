import { useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { balanceWithdrawApi } from '@/api/balanceWithdraw';
import { fileApi } from '@/api/file';
import { ProTable } from '@ant-design/pro-components';
import { App, Button, Typography, Space, Avatar, Tooltip, Popconfirm } from 'antd';
import { authCheck } from '@/common/function';
import {
    CloudDownloadOutlined
} from '@ant-design/icons';
import SelectUser from '@/components/selectUser';
import Info from './component/info';
import Audit from './component/audit';

const Withdraw = () => {
    const { message } = App.useApp();
    const tableRef = useRef();
    const formRef = useRef();

    //刷新表格数据
    const tableReload = () => {
        tableRef.current.reload();
        //清空选择项
        tableRef.current.clearSelected();
    }

    /////////////////////////导出////////////////////////
    const exportExcel = () => {
        message.open({
            type: 'loading',
            content: '表格生成中...',
            duration: 0,
            key: 'excel'
        });
        balanceWithdrawApi.exportData(formRef.current.getFieldsValue()).then(res => {
            message.destroy('excel')
            if (res.code === 1 && res.data.filePath && res.data.fileName) {
                message.success('表格已生成');
                setTimeout(() => {
                    window.open(`${fileApi.download}?filePath=${res.data.filePath}&fileName=${res.data.fileName}`);
                }, 1000)
            } else {
                message.error('数据导出失败');
            }
        })
    }

    //////////////////查看详情的id////////////////
    const [infoId, setInfoId] = useState(0);

    ///////////////////审核通过、已打款////////////////////
    const updateStatus = (id, status) => {
        balanceWithdrawApi.updateStatus({
            id,
            status
        }).then(res => {
            if (res.code === 1) {
                message.success(res.message);
                tableReload();
            } else {
                message.error(res.message);
            }
        })
    }
    ////////////////////审核拒绝、打款失败 的id////////////////
    const [updateId, setUpdateId] = useState([]);
    const [updateStatusValue, setUpdateStatusValue] = useState(0);


    //表格列
    const columns = [
        {
            title: '用户',
            dataIndex: 'user_id',
            render: (_, record) => <>
                <div style={{ display: 'flex' }}>
                    <Avatar src={record.User?.img} size="large" />
                    <div style={{ paddingLeft: '5px' }}>
                        {record.User?.name}<br />
                        {record.User?.tel}
                    </div>
                </div>
            </>,
            formItemRender: () => <SelectUser />
        },
        {
            title: '订单号',
            dataIndex: 'orderno',
        },
        {
            title: '状态',
            dataIndex: 'status',
            //定义搜索框类型
            valueType: 'select',
            //订单搜索框的选择项
            fieldProps: {
                options: [
                    {
                        value: 2,
                        label: '审核中',
                    },
                    {
                        value: 4,
                        label: '审核通过待打款',
                    },
                    {
                        value: 6,
                        label: '审核拒绝',
                    },
                    {
                        value: 8,
                        label: '已打款',
                    },
                    {
                        value: 10,
                        label: '打款失败',
                    },
                ]
            }
        },
        {
            title: '提现金额',
            key: 'money',
            search: false,
            render: (_, record) => <>
                提现：<Typography.Text type='danger'>{record.money}</Typography.Text><br />
                手续费：<Typography.Text type='warning'>{record.shouxufei}</Typography.Text><br />
                真实到账：<Typography.Text type='success'>{record.on_money}</Typography.Text><br />
            </>
        },
        {
            title: '提现账号',
            key: 'withdraw',
            search: false,
            render: (_, record) => <>
                {record.bank_title}/{record.bank_name}<br />
                {record.bank_number}
            </>
        },
        {
            title: '申请时间',
            dataIndex: 'create_time',
            //定义搜索框为日期区间
            valueType: 'dateRange',
            render: (text, record) => record.create_time
        },
        {
            title: '操作',
            dataIndex: 'action',
            render: (_, record) => {
                return <>
                    <Button
                        type="link"
                        size="small"
                        disabled={authCheck('balanceWithdrawInfo')}
                        onClick={() => {
                            setInfoId(record.id);
                        }}
                    >详情</Button>

                    {record.status === 2 ? <>
                        <Popconfirm
                            title="确认审核通过吗？"
                            onConfirm={() => {
                                updateStatus([record.id], 4);
                            }}
                            disabled={authCheck('balanceWithdrawUpdateStatus')}
                        >
                            <Button
                                type="link"
                                size="small"
                                disabled={authCheck('balanceWithdrawUpdateStatus')}
                            >审核通过</Button>
                        </Popconfirm>
                        <Button
                            type="link"
                            size="small"
                            danger
                            disabled={authCheck('balanceWithdrawUpdateStatus')}
                            onClick={() => {
                                setUpdateStatusValue(6);
                                setUpdateId([record.id]);
                            }}
                        >审核拒绝</Button>
                    </> : ''}
                    {record.status === 4 ? <>
                        <Popconfirm
                            title="确认已打款吗？"
                            onConfirm={() => {
                                updateStatus([record.id], 8);
                            }}
                            disabled={authCheck('balanceWithdrawUpdateStatus')}
                        >
                            <Button
                                type="link"
                                size="small"
                                disabled={authCheck('balanceWithdrawUpdateStatus')}
                            >已打款</Button>
                        </Popconfirm>
                        <Button
                            type="link"
                            size="small"
                            danger
                            disabled={authCheck('balanceWithdrawUpdateStatus')}
                            onClick={() => {
                                setUpdateStatusValue(10);
                                setUpdateId([record.id]);
                            }}
                        >打款失败</Button>
                    </> : ''}

                </>
            },
            search: false,
        },
    ];
    return (
        <>
            <Info
                infoId={infoId}
                setInfoId={setInfoId}
            />
            <Audit
                updateId={updateId}
                setUpdateId={setUpdateId}
                updateStatusValue={updateStatusValue}
                tableReload={tableReload}
            />
            <PageContainer
                className="rx-page-container"
                ghost
                header={{
                    title: '用户提现',
                    style: { padding: '0 24px 12px' },
                }}
            >
                <ProTable
                    actionRef={tableRef}
                    formRef={formRef}
                    rowKey="id"
                    columns={columns}
                    scroll={{
                        x: 1000
                    }}
                    headerTitle={
                        <Space>
                            <Tooltip title="是根据当前搜索的条件进行导出">
                                <Button
                                    type="primary"
                                    danger
                                    ghost
                                    icon={<CloudDownloadOutlined />}
                                    onClick={exportExcel}
                                    disabled={authCheck('balanceWithdrawExportData')}
                                >导出</Button>
                            </Tooltip>
                        </Space>
                    }
                    pagination={{
                        defaultPageSize: 10,
                        size: 'default',
                        //支持跳到多少页
                        showQuickJumper: true,
                        showSizeChanger: true,
                        responsive: true,
                    }}
                    //开启批量选择
                    rowSelection={{
                        preserveSelectedRowKeys: true,
                    }}
                    //批量选择后左边操作
                    tableAlertRender={({ selectedRowKeys }) => {
                        return (
                            <Space>
                                <span>已选 {selectedRowKeys.length} 项</span>
                                <Popconfirm
                                    title="确认审核通过吗？"
                                    onConfirm={() => {
                                        updateStatus(selectedRowKeys, 4);
                                    }}
                                    disabled={authCheck('balanceWithdrawUpdateStatus')}
                                >
                                    <Button
                                        type="link"
                                        size="small"
                                        disabled={authCheck('balanceWithdrawUpdateStatus')}
                                    >批量审核通过</Button>
                                </Popconfirm>
                                <Button
                                    type="link"
                                    size="small"
                                    danger
                                    disabled={authCheck('balanceWithdrawUpdateStatus')}
                                    onClick={() => {
                                        setUpdateStatusValue(6);
                                        setUpdateId(selectedRowKeys);
                                    }}
                                >批量审核拒绝</Button>
                                <Popconfirm
                                    title="确认已打款？"
                                    onConfirm={() => {
                                        updateStatus(selectedRowKeys, 8);
                                    }}
                                    disabled={authCheck('balanceWithdrawUpdateStatus')}
                                >
                                    <Button
                                        type="link"
                                        size="small"
                                        disabled={authCheck('balanceWithdrawUpdateStatus')}
                                    >批量已打款</Button>
                                </Popconfirm>
                                <Button
                                    type="link"
                                    size="small"
                                    danger
                                    disabled={authCheck('balanceWithdrawUpdateStatus')}
                                    onClick={() => {
                                        setUpdateStatusValue(8);
                                        setUpdateId(selectedRowKeys);
                                    }}
                                >批量打款失败</Button>
                            </Space>
                        );
                    }}
                    request={async (params = {}, sort, filter) => {
                        const result = await balanceWithdrawApi.getList({
                            ...params,//包含了翻页参数跟搜索参数
                            page: params.current,
                        });
                        if (result.code !== 1) {
                            message.error(result.message);
                        }
                        return {
                            data: result.data.data,
                            success: true,
                            total: result.data.total,
                        };
                    }}
                />
            </PageContainer>
        </>
    )
}

export default Withdraw;