import { useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { configApi } from '@/api/config';
import { ProTable } from '@ant-design/pro-components';
import {
    App, Button, Popconfirm, Space, InputNumber,
} from 'antd';
import {
    OrderedListOutlined,
    PlusOutlined,
} from '@ant-design/icons';
import { NavLink } from 'react-router-dom';
import { authCheck } from '@/common/function';

/**
 * 参数设置 管理
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 */
export default () => {
    const { message } = App.useApp();
    const tableRef = useRef();
    const formRef = useRef();

    // 刷新表格数据
    const tableReload = () => {
        tableRef.current.reload();
        tableRef.current.clearSelected();
    }

    ///////////////////////////保存排序///////////////////////////
    const [sortArr, setSortArr] = useState([]);
    const updateSort = () => {
        configApi.updateSort({ list: sortArr }).then(res => {
            if (res.code === 1) {
                message.success(res.message)
                tableReload();
                setSortArr([]);
                getList();
            } else {
                message.error(res.message)
            }
        })
    }
    // 排序改变的时候
    const sortArrChange = (id, sort) => {
        let _sortArr = [...sortArr];
        let whether = _sortArr.some(_item => {
            if (_item.id === id) {
                _item.sort = sort;
                return true;
            }
        })
        if (!whether) {
            _sortArr.push({
                id,
                sort
            })
        }
        setSortArr(_sortArr);
    }

    /////////////////删除//////////////
    const del = (id) => {
        configApi.delete({
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


    // 表格列
    const columns = [
        {
            title: '配置名称',
            dataIndex: 'title',
            search: false,
        },
        {
            title: '描述',
            dataIndex: 'description',
            ellipsis: true,
        },
        {
            title: '配置名称',
            dataIndex: 'name',
            search: false,
            copyable: true,
            render: (_, record) => _,
        },
        {
            title: '类型',
            dataIndex: 'type',
            search: false,
        },
        {
            title: '排序',
            dataIndex: 'sort',
            search: false,
            render: (_, record) => <>
                <InputNumber
                    defaultValue={record.sort}
                    style={{ width: '100px' }}
                    min={0}
                    disabled={authCheck('configUpdateSort')}
                    onChange={(value) => {
                        sortArrChange(record.id, value);
                    }}
                />
            </>
        },

        {
            title: '操作',
            dataIndex: 'action',
            search: false,
            render: (_, record) => {
                return <>
                    <NavLink to={authCheck('configUpdate') ? '' : `/config/create?id=${record.id}&type=${record.type}`}>
                        <Button
                            type="link"
                            size="small"
                            disabled={authCheck('configUpdate')}
                        >修改</Button>
                    </NavLink>
                    <Popconfirm
                        title="确认要删除吗？"
                        onConfirm={() => {
                            del(record.id)
                        }}
                        disabled={authCheck('configDelete')}
                    >
                        <Button
                            type="link"
                            size="small"
                            danger
                            disabled={authCheck('configDelete')}
                        >删除</Button>
                    </Popconfirm>
                </>
            },
        },
    ];
    return (
        <>
            <PageContainer
                className="sa-page-container"
                ghost
                header={{
                    title: '其它设置',
                    style: { padding: '0px 24px 12px' },
                }}
            >
                <ProTable
                    actionRef={tableRef}
                    formRef={formRef}
                    rowKey="id"
                    columns={columns}
                    scroll={{
                        x: 800
                    }}
                    search={false}
                    options={{
                        fullScreen: true
                    }}
                    columnsState={{
                        // 此table列设置后存储本地的唯一key
                        persistenceKey: 'table_column_' + 'Config',
                        persistenceType: 'localStorage'
                    }}
                    headerTitle={
                        <Space>
                            <NavLink to={authCheck('configCreate') ? '' : `/config/create?type=form`}>
                                <Button
                                    type="primary"
                                    disabled={authCheck('configCreate')}
                                    icon={<PlusOutlined />}
                                >添加Form设置</Button>
                            </NavLink>
                            <NavLink to={authCheck('configCreate') ? '' : `/config/create?type=list`}>
                                <Button
                                    type="primary"
                                    disabled={authCheck('configCreate')}
                                    icon={<PlusOutlined />}
                                >添加List设置</Button>
                            </NavLink>
                            <Button
                                type="primary"
                                onClick={updateSort}
                                disabled={authCheck('configUpdateSort')}
                                icon={<OrderedListOutlined />}
                            >保存排序</Button>
                        </Space>
                    }
                    pagination={false}
                    request={async (params = {}, sort, filter) => {
                        // 排序的时候
                        let orderBy = '';
                        for (let key in sort) {
                            orderBy = key + ' ' + (sort[key] === 'descend' ? 'desc' : 'asc');
                        }
                        const result = await configApi.getList({
                            ...params,// 包含了翻页参数跟搜索参数
                            orderBy, // 排序
                            page: params.current,
                        });
                        return {
                            data: result.data,
                            success: true,
                            total: result.data.length,
                        };
                    }}

                />
            </PageContainer>
        </>
    )
}
