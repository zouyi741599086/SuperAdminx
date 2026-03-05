import { useRef } from 'react';
import { userTotalMonthApi } from '@/api/userTotalMonth';
import { ProTable } from '@ant-design/pro-components';
import {
    App, Button, Typography, Space, Tooltip,
} from 'antd';
import {
    CloudDownloadOutlined,
} from '@ant-design/icons';
import { authCheck } from '@/common/function';
import { fileApi } from '@/api/file';

/**
 * 用户月统计 
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
        userTotalMonthApi.exportData(params).then(res => {
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
                message.error(res.message || '数据导出失败');
            }
        })
    }

    // 表格列
    const columns = [
        {
            title: '月份',
            dataIndex: 'month',
            search: true,
            valueType: 'dateMonth',
            render: (_, record) => _,
        },
        {
            title: '注册人数',
            dataIndex: 'count',
            search: false,
            sorter: true,
            render: (_, record) => <>
                <Typography.Text type="danger">{record.count}</Typography.Text>
            </>
        },

    ];
    return (
        <>
            <ProTable
                actionRef={tableRef}
                formRef={formRef}
                rowKey="id"
                columns={columns}
                scroll={{
                    x: 400
                }}
                options={{
                    fullScreen: true
                }}
                columnsState={{
                    // 此table列设置后存储本地的唯一key
                    persistenceKey: 'table_column_' + 'UserTotalMonth',
                    persistenceType: 'localStorage'
                }}
                headerTitle={
                    <Space>

                        <Tooltip title="根据当前搜索条件导出数据~">
                            <Button
                                type="primary"
                                danger
                                ghost
                                icon={<CloudDownloadOutlined />}
                                onClick={exportData}
                                disabled={authCheck('userTotalMonthExportData')}
                            >导出</Button>
                        </Tooltip>
                    </Space>
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
                    const result = await userTotalMonthApi.getList({
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
        </>
    )
}
