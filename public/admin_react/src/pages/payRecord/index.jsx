import { useRef } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { payRecordApi } from '@/api/payRecord';
import { ProTable } from '@ant-design/pro-components';
import { App, Typography, Space, Avatar, Badge, Tooltip, Button } from 'antd';
import { authCheck } from '@/common/function';
import { fileApi } from '@/api/file';
import {
    CloudDownloadOutlined,
} from '@ant-design/icons';
import SelectUser from '@/components/selectUser';


/**
 * 支付记录 
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
export default () => {
    const { message } = App.useApp();
    const tableRef = useRef();
    const formRef = useRef();

    // 刷新表格数据
    const tableReload = () => {
        tableRef.current.reload();
        tableRef.current.clearSelected();
    }

    /////////////////////////导出////////////////////////
    const exportData = () => {
        message.open({
            type: 'loading',
            content: '数据生成中...',
            duration: 0,
            key: 'excel'
        });
        let params = formRef.current.getFieldsFormatValue();
        payRecordApi.exportData(params).then(res => {
            message.destroy('excel')
            if (res.code === 1 && res.data.filePath && res.data.fileName) {
                message.success('数据已生成');
                setTimeout(() => {
                    if (res.data.filePath.indexOf("http") !== -1) {
                        window.open(`${res.data.filePath}`);
                    } else {
                        window.open(`${fileApi.download}?filePath=${res.data.filePath}&fileName=${res.data.fileName}`);
                    }
                }, 1000)
            } else {
                message.error('数据导出失败');
            }
        })
    }


    // 表格列
    const columns = [
        {
            title: '用户',
            dataIndex: 'user_id',
            search: true,
            valueType: 'selectTable',
            formItemRender: () => <SelectUser />,
            render: (_, record) => {
                if (record.User) {
                    return <div style={{ display: 'flex' }}>
                        <Avatar
                            src={record.User?.img}
                            style={{
                                flexShrink: 0
                            }}
                        >{record.User?.name?.substr(0, 1)}</Avatar>
                        <div style={{ paddingLeft: '5px' }}>
                            {record.User?.name}<br />
                            <Typography.Paragraph
                                copyable
                                style={{
                                    margin: 0
                                }}
                            >{record.User?.tel}</Typography.Paragraph>
                        </div>
                    </div>
                }
                return '--';
            },
        },
        {
            title: '类型',
            dataIndex: 'type',
            search: true,
            valueType: 'select',
            fieldProps: {
                showSearch: true,
                options: [
                    {
                        value: 1,
                        label: '商城订单',
                    },
                    {
                        value: 2,
                        label: '余额充值',
                    },
                ]
            },
            render: (_, record) => <>
                {record.type === 1 ? <>
                    <Typography.Text type="danger">商城订单</Typography.Text>
                </> : ''}
                {record.type === 2 ? <>
                    <Typography.Text mark>余额充值</Typography.Text>
                </> : ''}
            </>
        },
        {
            title: '支付方式',
            dataIndex: 'pay_type',
            search: true,
            valueType: 'select',
            fieldProps: {
                showSearch: true,
                options: [
                    {
                        value: 'money',
                        label: '余额支付',
                    },
                    {
                        value: 'wechat',
                        label: '微信支付',
                    },
                    {
                        value: 'alipay',
                        label: '支付宝支付',
                    },
                ]
            },
            render: (_, record) => <>
                {record.pay_type === 'money' ? <>
                    <Badge status="error" text="余额支付" />
                </> : ''}
                {record.pay_type === 'wechat' ? <>
                    <Badge status="success" text="微信支付" />
                </> : ''}
                {record.pay_type === 'alipay' ? <>
                    <Badge status="default" text="支付宝支付" />
                </> : ''}
            </>
        },
        {
            title: '支付来源',
            dataIndex: 'pay_source',
            search: true,
            valueType: 'select',
            fieldProps: {
                showSearch: true,
                options: [
                    {
                        value: 'h5',
                        label: 'H5',
                    },
                    {
                        value: 'app',
                        label: 'APP',
                    },
                    {
                        value: 'mp',
                        label: '公众号',
                    },
                    {
                        value: 'mini',
                        label: '小程序',
                    },
                ]
            },
            render: (_, record) => <>
                {record.pay_source === 'h5' ? <>
                    <Badge color="pink" text="H5" />
                </> : ''}
                {record.pay_source === 'app' ? <>
                    <Badge color="yellow" text="APP" />
                </> : ''}
                {record.pay_source === 'mp' ? <>
                    <Badge color="green" text="公众号" />
                </> : ''}
                {record.pay_source === 'mini' ? <>
                    <Badge color="blue" text="小程序" />
                </> : ''}
                {/* 其它颜色 <Badge color="pink" text="状态名称" /> pink red yellow orange cyan green blue purple geekblue magenta volcano gold lime */}
            </>
        },
        {
            title: '我方订单号',
            dataIndex: 'out_trade_no',
            search: true,
            valueType: 'text',
            copyable: true,
        },
        {
            title: '对方订单号',
            dataIndex: 'orderno',
            search: true,
            valueType: 'text',
            copyable: true,
            // 列增加提示
            tooltip: '支付宝或微信方的订单单号',
            // 列增加提示的同时搜索也会增加，所以要干掉搜索的提示
            formItemProps: {
                tooltip: undefined
            },
        },
        {
            title: '支付金额',
            dataIndex: 'total',
            search: false,
            render: (_, record) => <>
                <Typography.Text type="danger">￥{record.total}</Typography.Text>
            </>
        },
        {
            title: '支付时间',
            dataIndex: 'success_time',
            search: true,
            valueType: 'dateRange',
            render: (_, record) => record.success_time,
        },

    ];
    return (
        <>
            <PageContainer
                className="sa-page-container"
                ghost
                header={{
                    title: '支付记录',
                    style: { padding: '0px 24px 12px' },
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
                    options={{
                        fullScreen: true
                    }}
                    columnsState={{
                        // 此table列设置后存储本地的唯一key
                        persistenceKey: 'table_column_' + 'PayRecord',
                        persistenceType: 'localStorage'
                    }}
                    headerTitle={
                        <>
                            <Space>
                                <Tooltip title="根据当前搜索条件导出数据~">
                                    <Button
                                        type="primary"
                                        danger
                                        ghost
                                        icon={<CloudDownloadOutlined />}
                                        onClick={exportData}
                                        disabled={authCheck('payRecordExportData')}
                                    >导出</Button>
                                </Tooltip>
                            </Space>
                        </>
                    }
                    pagination={{
                        defaultPageSize: 20,
                        size: 'default',
                        // 支持跳到多少页
                        showQuickJumper: true,
                        showSizeChanger: true,
                        responsive: true,
                    }}
                    request={async (params = {}, sort, filter) => {
                        // 排序的时候
                        let orderBy = '';
                        for (let key in sort) {
                            orderBy = key + ' ' + (sort[key] === 'descend' ? 'desc' : 'asc');
                        }
                        const result = await payRecordApi.getList({
                            ...params,// 包含了翻页参数跟搜索参数
                            orderBy, // 排序
                            page: params.current,
                        });
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
