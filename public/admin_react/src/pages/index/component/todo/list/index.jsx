import { useRef, lazy, useState, useImperativeHandle } from 'react';
import { ProList } from '@ant-design/pro-components';
import { adminUserTodoApi } from '@/api/adminUserTodo';
import { App, Button, Modal, Tag, Popconfirm } from 'antd';
import Lazyload from '@/component/lazyLoad/index';

const Update = lazy(() => import('./../update/index'));

/**
 * 待办事项 
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
const AdminUserTodo = ({ tableReload, ref, ...props }) => {
    const tableRef = useRef();
    const updateRef = useRef();
    const { message } = App.useApp();
    const [open, setOpen] = useState(false);
    const [currentDate, setCurrentDate] = useState();

    // 暴露给父组件的方法
    useImperativeHandle(ref, () => ({
        open: (date) => {
            setCurrentDate(date);
            tableRe();
            setOpen(true);
        }
    }));

    // 关闭
    const closeOpen = () => {
        setOpen(false);
    };

    ///////////////////////////刷新表格数据///////////////////////
    const tableRe = () => {
        tableRef?.current?.reset?.();
    }

    //////////////////////////删除////////////////////////
    const del = (id) => {
        adminUserTodoApi.delete({
            id
        }).then(res => {
            if (res.code === 1) {
                message.success(res.message)
                tableRe();
                tableReload?.();
            } else {
                message.error(res.message)
            }
        })
    }

    ///////////////修改状态///////////////////
    const updateStatus = (id, status) => {
        adminUserTodoApi.updateStatus({
            id,
            status
        }).then(res => {
            if (res.code === 1) {
                message.success(res.message)
                tableRe();
                tableReload?.();
            } else {
                message.error(res.message)
            }
        })
    }

    // 表格列 
    const columns = [
        {
            title: '日期',
            dataIndex: 'date',
            listSlot: 'title',
        },
        {
            dataIndex: 'content',
            listSlot: 'description',
            render: (_, record) => <>
                {record.content}
                {record.status === 2 ? <><br /><small>完成时间：{record.complete_time}</small></> : ''}
            </>,
        },
        {
            dataIndex: 'status',
            listSlot: 'subTitle',
            render: (_, record) => <>
                {record.status === 1 ? <Tag color="error">未完成</Tag> : ''}
                {record.status === 2 ? <Tag color="success">已完成</Tag> : ''}

            </>,
        },
        {
            listSlot: 'actions',
            render: (_, record) => {
                const action = [];
                if (record.status === 1) {
                    action.push(
                        <Button
                            key="update"
                            type="link"
                            size="small"
                            onClick={() => {
                                updateRef.current?.open?.(record.id);
                            }}
                        >修改</Button>
                    );
                    action.push(
                        <Popconfirm
                            key="updateStatus"
                            title="确定改为已完成吗？"
                            onConfirm={() => { updateStatus(record.id, 2) }}
                        >
                            <Button
                                variant="link"
                                size="small"
                                color="green"
                            >已完成</Button>
                        </Popconfirm>
                    );
                }
				
				action.push(
                    <Popconfirm
                        key="delete"
                        title="确认要删除吗？"
                        onConfirm={() => { del(record.id) }}
                    >
                        <Button
                            type="link"
                            size="small"
                            danger
                        >删除</Button>
                    </Popconfirm>
                );
                return action;
            }
        },

    ];

    return <>
        <Modal
            open={open}
            onCancel={closeOpen}
            title={`${currentDate}待办事项`}
            width={800}
            footer={null}
        >
            <Lazyload block={false}>
                <Update
                    tableReload={tableRe}
                    ref={updateRef}
                />
            </Lazyload>
            <ProList
                actionRef={tableRef}
                rowKey="id"
                split
                cardProps={false}
                params={{
                    date: currentDate
                }}
                // 请求数据
                request={async (params = {}, sort, filter) => {
                    const res = await adminUserTodoApi.getList({
                        ...params,// 包含了翻页参数跟搜索参数
                    });
                    return {
                        data: res.data,
                        success: true,
                        total: res.data.total,
                    };
                }}
                columns={columns}
            />
        </Modal>
    </>;
};

export default AdminUserTodo;