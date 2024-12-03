import { useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { newsClassApi } from '@/api/newsClass';
import { newsApi } from '@/api/news';
import { useMount } from 'ahooks';
import { arrayToTree, authCheck } from '@/common/function';
import { Button, Popconfirm, InputNumber, App, Space, Typography, Switch } from 'antd';
import {
    OrderedListOutlined,
    DeleteOutlined,
    PlusOutlined,
} from '@ant-design/icons';
import { NavLink } from "react-router-dom";
import MoveAll from './moveAll'
import CopyAll from './copyAll'

export default () => {
    const tableRef = useRef();
    const { message } = App.useApp();

    useMount(() => {
        // 加载列表数据
    })
    ///////////////////////////刷新表格数据///////////////////////
    const tableReload = (clearSelected = false) => {
        // 是否清空选中项
        if (clearSelected) {
            tableRef.current.clearSelected();
        }
        tableRef.current.reload();
    }

    ///////////////////////////保存排序///////////////////////////
    const [sortArr, setSortArr] = useState([]);
    const updateSort = () => {
        newsApi.updateSort({ list: sortArr }).then(res => {
            if (res.code === 1) {
                message.success(res.message)
                tableRef.current.reload();
                setSortArr([]);
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

    ///////////////修改状态///////////////////
    const updateStatus = (id, status) => {
        newsApi.updateStatus({
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

    //////////////////////////删除////////////////////////
    const del = (id) => {
        newsApi.delete({
            id
        }).then(res => {
            if (res.code === 1) {
                message.success(res.message)
                tableReload(true);
            } else {
                message.error(res.message)
            }
        })
    }

    // 表格列
    const columns = [
        {
            title: '标题',
            dataIndex: 'title',
        },
        {
            title: '所属分类',
            dataIndex: 'news_class_id',
            // 定义搜索框类型
            valueType: 'treeSelect',
            // 搜索框选择项
            request: async () => {
                const result = await newsClassApi.getList();
                return arrayToTree(result.data, null, 'children', [], false);
            },
            // 搜索框中的参数
            fieldProps: {
                fieldNames: {
                    label: 'title',
                    value: 'id'
                }
            },
            render: (_, record) => record.newsClass?.pid_path_title,
        },
        {
            title: '排序',
            dataIndex: 'sort',
            render: (text, record) => {
                return <InputNumber
                    defaultValue={text}
                    style={{ width: '100px' }}
                    min={0}
                    disabled={authCheck('newsUpdateSort')}
                    onChange={(value) => {
                        sortArrChange(record.id, value);
                    }}
                />
            },
            search: false,
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
                checkedChildren="显示"
                unCheckedChildren="隐藏"
                value={record.status == 1}
                disabled={authCheck('newsUpdateStatus')}
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
                        label: '显示',
                    },
                    {
                        value: 2,
                        label: '隐藏',
                    }
                ]
            }
        },
        {
            title: '浏览量',
            dataIndex: 'pv',
            sorter: true, // 支持排序
            search: false,
            render: (_, record) => <>
                <Typography.Text type="success">{record.pv}</Typography.Text>
            </>
        },
        {
            title: '添加时间',
            dataIndex: 'create_time',
            // 定义搜索框为日期区间
            valueType: 'dateRange',
            render: (_, render) => render.create_time
        },
        {
            title: '操作',
            dataIndex: 'action',
            search: false,
            render: (_, render) => {
                return <>
                    <NavLink to={authCheck('newsUpdate') ? '' : `/news/list/update?id=${render.id}`}>
                        <Button
                            type="link"
                            size="small"
                            disabled={authCheck('newsUpdate')}
                        >修改</Button>
                    </NavLink>

                    <Popconfirm
                        title="确认要删除吗？"
                        onConfirm={() => { del(render.id) }}
                        disabled={authCheck('newsDelete')}
                    >
                        <Button
                            type="link"
                            size="small"
                            danger
                            disabled={authCheck('newsDelete')}
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
                    title: '文章管理',
                    style: { padding: '0 24px 12px' },
                }}
            >
                <ProTable
                    actionRef={tableRef}
                    rowKey="id"
                    // 列名
                    columns={columns}
                    // 滚动条
                    scroll={{
                        x: 1000
                    }}
                    // 左上角操作
                    headerTitle={
                        <Space>
                            <NavLink to={authCheck('newsCreate') ? '' : `/news/list/create`}>
                                <Button
                                    type="primary"
                                    disabled={authCheck('newsCreate')}
                                    icon={<PlusOutlined />}
                                >添加文章</Button>
                            </NavLink>
                            <Button
                                type="primary"
                                onClick={updateSort}
                                disabled={authCheck('newsUpdateSort')}
                                icon={<OrderedListOutlined />}
                            >保存排序</Button>
                        </Space>
                    }
                    // 翻页
                    pagination={{
                        defaultPageSize: 10,
                        size: 'default',
                        // 支持跳到多少页
                        showQuickJumper: true,
                        showSizeChanger: true,
                        responsive: true,
                    }}
                    // 请求数据
                    request={async (params = {}, sort, filter) => {
                        // 排序的时候
                        let orderBy = '';
                        for (let key in sort) {
                            orderBy = key + ' ' + (sort[key] === 'descend' ? 'desc' : 'asc');
                        }
                        const res = await newsApi.getList({
                            ...params,// 包含了翻页参数跟搜索参数
                            orderBy, // 排序
                            page: params.current,
                        });
                        return {
                            data: res.data.data,
                            success: true,
                            total: res.data.total,
                        };
                    }}
                    // 开启批量选择
                    rowSelection={{
                        preserveSelectedRowKeys: true,
                    }}
                    // 批量选择后左边操作
                    tableAlertRender={({ selectedRowKeys, }) => {
                        return (
                            <Space>
                                <span>已选 {selectedRowKeys.length} 项</span>
                                <Popconfirm
                                    title={`确定批量删除这${selectedRowKeys.length}条数据吗？`}
                                    onConfirm={() => { del(selectedRowKeys) }}
                                    disabled={authCheck('newsDelete')}
                                >
                                    <Button type="link" size='small' danger icon={<DeleteOutlined />} disabled={authCheck('newsDelete')}>批量删除</Button>
                                </Popconfirm>
                                <MoveAll ids={selectedRowKeys} tableReload={tableReload} />
                                <CopyAll ids={selectedRowKeys} tableReload={tableReload} />
                            </Space>
                        );
                    }}
                />
            </PageContainer>
        </>
    )
}
