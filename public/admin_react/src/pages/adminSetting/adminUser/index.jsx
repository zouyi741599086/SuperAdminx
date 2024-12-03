import { useRef, lazy, useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { adminUserApi } from '@/api/adminUser';
import { ProTable } from '@ant-design/pro-components';
import { App, Avatar, Button, Popconfirm, Switch } from 'antd';
import { config } from '@/common/config';
import { adminRoleApi } from '@/api/adminRole'
import { authCheck } from '@/common/function';
import Lazyload from '@/component/lazyLoad/index';

const Create = lazy(() => import('./create'));
const Update = lazy(() => import('./update'));

/**
 * 管理员
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
export default () => {
    const { message } = App.useApp();
    const tableRef = useRef();

    // 要修改的数据
    const [updateId, setUpdateId] = useState(0);

    // 修改状态
    const updateStatus = (id, status) => {
        adminUserApi.updateStatus({
            id,
            status
        }).then(res => {
            if (res.code === 1) {
                message.success(res.message)
                tableRef.current.reload();
            } else {
                message.error(res.message)
            }
        })
    }

    // 删除用户
    const del = (id) => {
        adminUserApi.delete({
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
            title: '头像',
            dataIndex: 'img',
            render: (_, render) => {
                return <Avatar src={`${config.url}${render.img}`}>{render.name?.substr(0, 1)}</Avatar>
            },
            search: false,
        },
        {
            title: '姓名',
            dataIndex: 'name',
        },
        {
            title: '联系电话',
            dataIndex: 'tel',
        },
        {
            title: '角色',
            dataIndex: 'admin_role_id',
            // 定义搜索框类型
            valueType: 'select',
            // 搜索框选择项
            request: async () => {
                const result = await adminRoleApi.getList({
                    isPage: 'no'
                });
                return result.data;
            },
            // 搜索框中的参数
            fieldProps: {
                fieldNames: {
                    label: 'title',
                    value: 'id'
                }
            },
        },
        {
            title: '登录帐号',
            dataIndex: 'username',
        },
        {
            title: '状态',
            dataIndex: 'status',
            // 列增加提示
            tooltip: '点击可切换状态',
            // 列增加提示的同时搜索也会增加，所以要干掉搜索的提示
            formItemProps: {
                tooltip: ''
            },
            render: (_, record) => <Switch
                checkedChildren="正常"
                unCheckedChildren="禁用"
                value={record.status == 1}
                disabled={authCheck('adminUserUpdateStatus')}
                onClick={() => {
                    updateStatus(record.id, record.status == 1 ? 2 : 1);
                }}
            />,
            // 定义搜索框类型
            valueType: 'select',
            // 订单搜索框的选择项
            fieldProps: {
                options: [
                    {
                        value: 1,
                        label: '正常',
                    },
                    {
                        value: 2,
                        label: '禁用',
                    }
                ]
            }
        },
        {
            title: '上次登录时间',
            dataIndex: 'last_time',
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
            render: (_, render) => {
                return <>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => { setUpdateId(render.id) }}
                        disabled={authCheck('adminUpdate')}
                    >修改</Button>
                    <Popconfirm
                        title="确认要删除吗？"
                        onConfirm={() => { del(render.id) }}
                        disabled={authCheck('adminUserDelete')}
                    >
                        <Button
                            type="link"
                            size="small"
                            danger
                            disabled={authCheck('adminUserDelete')}
                        >删除</Button>
                    </Popconfirm>
                </>
            },
            search: false,
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
                    title: '管理员',
                    style: { padding: '0 24px 12px' },
                }}
            >
                <ProTable
                    actionRef={tableRef}
                    rowKey="id"
                    columns={columns}
                    scroll={{
                        x: 1000
                    }}
                    options={{
                        fullScreen: true
                    }}
                    columnsState={{
                        //此table列设置后存储本地的唯一key
                        persistenceKey: 'table_column_' + 'adminUser',
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
                        const result = await adminUserApi.getList({
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
