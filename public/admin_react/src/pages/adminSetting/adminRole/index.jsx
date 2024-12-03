import { useRef, lazy, useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { App, Badge, Button, Popconfirm, Typography } from 'antd';
import {
    EditOutlined,
} from '@ant-design/icons';
import { adminRoleApi } from '@/api/adminRole'
import { authCheck } from '@/common/function';
import Lazyload from '@/component/lazyLoad/index';

const Create = lazy(() => import('./create'));
const Update = lazy(() => import('./update'));
const Role = lazy(() => import('./component/role'));

/**
 * 管理员角色
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
export default () => {
    const { message } = App.useApp();
    const tableRef = useRef();

    // 要修改的数据id
    const [updateId, setUpdateId] = useState(0);
    // 要修改的权限数据id
    const [roleId, setRoleId] = useState(0);

    // 删除
    const del = (id) => {
        adminRoleApi.delete({
            id
        }).then(res => {
            if (res.code === 1) {
                message.success(res.message)
                tableReload();
            } else {
                message.error(res.message)
            }
        })
    }

    // 刷新表格数据
    const tableReload = () => {
        tableRef.current.reload();
    }

    // 表格列
    const columns = [
        {
            title: '角色名称',
            dataIndex: 'title',
        },
        {
            title: '管理员数量',
            dataIndex: 'admin_user_count',
            render: (text) => <Badge text={text} status="success" />,
            search: false,
        },
        {
            title: '权限数量',
            dataIndex: 'admin_role_menu_count',
            render: (text) => <Badge text={text} status="processing" />,
            search: false,
        },
        {
            title: '添加时间',
            dataIndex: 'create_time',
            search: false,
        },
        {
            title: '操作',
            dataIndex: 'action',
            render: (_, record) => {
                return <>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            setUpdateId(record.id);
                        }}
                        disabled={authCheck('adminRoleUpdate')}
                    >修改</Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            setRoleId(record.id);
                        }}
                        disabled={authCheck('adminRoleAuth')}
                    >设置权限</Button>
                    <Popconfirm
                        title="确认要删除吗？"
                        onConfirm={() => del(record.id)}
                        disabled={authCheck('adminRoleDelete')}
                    >
                        <Button type="link" size="small" danger disabled={authCheck('adminRoleDelete')}>删除</Button>
                    </Popconfirm>
                </>
            },
            search: false,
        },
    ];

    return (
        <>
            {/* 权限设置表单 */}
            <Lazyload block={false}>
                <Role
                    tableReload={tableReload}
                    roleId={roleId}
                    setRoleId={setRoleId}
                />
            </Lazyload>
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
                    title: '角色管理',
                    style: { padding: '0 24px 12px' },
                }}
            >
                <ProTable
                    actionRef={tableRef}
                    rowKey="id"
                    columns={columns}
                    scroll={{
                        x: 600
                    }}
                    options={{
                        fullScreen: true
                    }}
                    columnsState={{
                        // 此table列设置后存储本地的唯一key
                        persistenceKey: 'table_column_' + 'adminRole',
                        persistenceType: 'localStorage'
                    }}
                    headerTitle={
                        <Lazyload block={false}><Create tableReload={tableReload} /></Lazyload>
                    }
                    pagination={{
                        defaultPageSize: 10,
                        size: 'default',
                        // 支持跳到多少页
                        showQuickJumper: true,
                        showSizeChanger: true,
                        responsive: true,
                    }}
                    request={async (params = {}, sort, filter) => {
                        const result = await adminRoleApi.getList({
                            ...params,// 包含了翻页参数跟搜索参数
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
