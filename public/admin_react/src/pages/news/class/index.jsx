import { useRef, useState, lazy } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { newsClassApi } from '@/api/newsClass';
import { arrayToTree, authCheck } from '@/common/function';
import { Button, Popconfirm, InputNumber, App, Space, Switch } from 'antd';
import {
    OrderedListOutlined,
} from '@ant-design/icons';
import Lazyload from '@/component/lazyLoad/index';

const Create = lazy(() => import('./create'));
const Update = lazy(() => import('./update'));

/**
 * 文章分类
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 */
const NewsClass = () => {
    const tableRef = useRef();
    const [list, setList] = useState([]);
    const { message } = App.useApp();

    /////////////////////////修改数据////////////////////////
    const updateRef = useRef();

    ///////////////////////////刷新表格数据///////////////////////
    const tableReload = () => {
        tableRef.current.reload();
    }

    ///////////////////////////保存排序///////////////////////////
    const sortArrRef = useRef([]); 
    const updateSort = () => {
        const listToSave = sortArrRef.current; 
        if (listToSave.length === 0) {
            message.info('没有需要保存的排序');
            return;
        }
        newsClassApi.updateSort({ list: listToSave  }).then(res => {
            if (res.code === 1) {
                message.success(res.message)
                tableRef.current.reload();
                sortArrRef.current = []; 
                getList();
            } else {
                message.error(res.message)
            }
        })
    }
    // 排序改变的时候
    const sortArrChange = (id, sort) => {
        let _sortArr = sortArrRef.current;
        const index = _sortArr.findIndex(item => item.id === id);
        if (index !== -1) {
            _sortArr[index].sort = sort;
        } else {
            _sortArr.push({ id, sort });
        }
    }

    ///////////////修改状态///////////////////
    const updateStatus = (id, status) => {
        newsClassApi.updateStatus({
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
        newsClassApi.delete({
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
            title: 'ID',
            dataIndex: 'id',
            search: false,
        },
        {
            title: '分类名称',
            dataIndex: 'title',
        },
        {
            title: '排序',
            dataIndex: 'sort',
            render: (text, record) => {
                return <InputNumber
                    defaultValue={text}
                    styles={{
                        root: { width: '100px' }
                    }}
                    min={0}
                    disabled={authCheck('newsClassUpdateSort')}
                    onChange={(value) => {
                        sortArrChange(record.id, value);
                    }}
                />
            },
        },
        {
            title: '状态',
            dataIndex: 'status',
            // 列增加提示
            tooltip: '点击可切换状态',
            // 列增加提示的同时搜索也会增加，所以要干掉搜索的提示
            formItemProps: {
                tooltip: undefined
            },
            render: (_, record) => <Switch
                checkedChildren="显示"
                unCheckedChildren="隐藏"
                value={record.status == 1}
                disabled={authCheck('newsClassUpdateStatus')}
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
            title: '添加时间',
            dataIndex: 'create_time',
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
                            updateRef.current?.open(record.id);
                        }}
                        disabled={authCheck('newsClassUpdate')}
                    >修改</Button>
                    <Popconfirm
                        title={<div style={{ maxWidth: '200px' }}>谨慎操作：会将此分类下所有子分类及所有文章一并删除，确认删除吗？</div>}
                        onConfirm={() => { del(record.id) }}
                        disabled={authCheck('newsClassDelete')}
                    >
                        <Button
                            type="link"
                            size="small"
                            danger
                            disabled={authCheck('newsClassDelete')}
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
                    title: '文章分类',
                    style: { padding: '0 24px 12px' },
                }}
            >
                <ProTable
                    actionRef={tableRef}
                    rowKey="id"
                    search={false}
                    columns={columns}
                    scroll={{
                        x: 700
                    }}
                    options={{
                        fullScreen: true
                    }}
                    headerTitle={
                        <>
                            <Space>
                                <Lazyload block={false}>
                                    <Create tableReload={tableReload} list={list} />
                                </Lazyload>
                                <Button
                                    type="primary"
                                    onClick={updateSort}
                                    disabled={authCheck('newsClassUpdateSort')}
                                    icon={<OrderedListOutlined />}
                                >保存排序</Button>
                            </Space>
                            {/* 修改表单 */}
                            <Lazyload block={false}>
                                <Update
                                    tableReload={tableReload}
                                    ref={updateRef}
                                />
                            </Lazyload>
                        </>
                    }
                    pagination={false}
                    request={async (params = {}, sort, filter) => {
                        const result = await newsClassApi.getList();
                        if (result.code !== 1) {
                            message.error(result.message);
                        }
                        const _list = arrayToTree(result.data, null, 'children', [], false);
                        setList(_list);
                        return {
                            data: _list,
                            success: true,
                            total: result.data.total,
                        };
                    }}
                />
            </PageContainer>
        </>
    )
}

export default NewsClass;