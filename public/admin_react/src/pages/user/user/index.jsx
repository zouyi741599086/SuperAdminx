import { useRef, lazy, useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { userApi } from '@/api/user';
import { ProTable } from '@ant-design/pro-components';
import { App, Button, Typography, Space, Tooltip, Avatar, Switch, } from 'antd';
import {
    CloudDownloadOutlined,
} from '@ant-design/icons';
import { authCheck} from '@/common/function';
import { fileApi } from '@/api/file';
import Lazyload from '@/component/lazyLoad/index';
import SelectUser from '@/components/selectUser';

// const Create = lazy(() => import('./create'));
const Update = lazy(() => import('./update'));

/**
 * 用户 
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

    // 要修改的数据
    const [updateId, setUpdateId] = useState(0);    


    /////////////////////////导出////////////////////////
    const exportData = () => {
        message.open({
            type: 'loading',
            content: '数据生成中...',
            duration: 0,
            key: 'excel'
        });
        let params = formRef.current.getFieldsFormatValue();
        userApi.exportData(params).then(res => {
            message.destroy('excel')
            if (res.code === 1 && res.data.filePath && res.data.fileName) {
                message.success('数据已生成');
                setTimeout(() => {
                    window.open(`${fileApi.download}?filePath=${res.data.filePath}&fileName=${res.data.fileName}`);
                }, 1000)
            } else {
                message.error(res.message || '数据导出失败');
            }
        })
    }

    // 表格列
    const columns = [
        {
            title: '头像',
            dataIndex: 'img',
            search: false,
            render: (_, record) => <>
                <Avatar src={`${record.img}`}>{record.name?.substr(0, 1)}</Avatar>
            </>
        },
        {
            title: '姓名',
            dataIndex: 'name',
            search: true,
            valueType : 'text',
            render: (_, record) => _,
        },
        {
            title: '手机号',
            dataIndex: 'tel',
            search: true,
            valueType : 'text',
            copyable: true,
            render: (_, record) => _,
        },
        {
            title: '上级用户',
            dataIndex: 'pid',
            search: true,
            valueType : 'selectTable',
            renderFormItem: () => <SelectUser />,
            render: (_, record) => {
                if (record.PUser) {
                    return <div style={{ display: 'flex' }}>
                        <Avatar
                            src={record.PUser?.img}
                            style={{
                                flexShrink: 0
                            }}
                        >{record.PUser?.name?.substr(0, 1)}</Avatar>
                        <div style={{ paddingLeft: '5px' }}>
                            {record.PUser?.name}<br />
                            <Typography.Paragraph
                                copyable
                                style={{
                                    margin: 0
                                }}
                            >{record.PUser?.tel}</Typography.Paragraph>
                        </div>
                    </div>
                }
                return '--';
            },
        },
        {
            title: '注册时间',
            dataIndex: 'create_time',
            search: true,
            valueType : 'dateRange',
            render: (_, record) => record.create_time,
        },

        {
            title: '操作',
            dataIndex: 'action',
            search: false,
            render: (_, record) => {
                return <>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => { 
                            setUpdateId(record.id) 
                        }}
                        disabled={authCheck('userUpdate')}
                    >修改</Button>
                </>
            },
        },        
    ];
    return (
        <>
            {/* 修改表单 */}
            <Lazyload block={false}>
                <Update
                    tableReload={tableReload}
                    updateId={updateId}
                    setUpdateId={setUpdateId}
                />
            </Lazyload>
            <PageContainer
                className="sa-page-container"
                ghost
                header={{
                    title: '用户',
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
                        persistenceKey: 'table_column_' + 'User', 
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
                                    disabled={authCheck('userExportData')}
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
                        const result = await userApi.getList({
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
