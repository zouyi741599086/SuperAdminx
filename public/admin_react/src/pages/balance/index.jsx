import { useRef, lazy, useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { balanceApi } from '@/api/balance';
import { ProTable } from '@ant-design/pro-components';
import { App, Button, Typography, Space, Tooltip, Avatar, Row, Col, Statistic } from 'antd';
import {
    CloudDownloadOutlined,
} from '@ant-design/icons';
import { authCheck } from '@/common/function';
import { fileApi } from '@/api/file';
import Lazyload from '@/component/lazyLoad/index';
import SelectUser from '@/components/selectUser';
import { useMount } from 'ahooks';
import { useNavigate } from "react-router-dom";

const UpdateBalance = lazy(() => import('./component/updateBalance'));
const Turn = lazy(() => import('./component/turn'));

/**
 * 用户余额 
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
export default () => {
    const { message } = App.useApp();
    const tableRef = useRef();
    const navigate = useNavigate();
    const formRef = useRef();

    useMount(() => {
        getBalanceType();
        getTotal();
    })

    // 刷新表格数据
    const tableReload = () => {
        tableRef.current.reload();
        tableRef.current.clearSelected();
        getTotal();
    }

    // 统计余额
    const [total, setTotal] = useState({});
    const getTotal = () => {
        balanceApi.getTotal().then(res => {
            if (res.code === 1) {
                setTotal(res.data[0]);
            } else {
                message.error(res.message);
            }
        })
    }

    // 转账的用户id
    const [turnUserId, setTurnUserId] = useState();

    // 变更余额的用户id
    const [updateBalanceUserId, setUpdateBalanceUserId] = useState();

    // 余额的类型配置
    const [balanceType, setBalanceType] = useState([])
    const getBalanceType = () => {
        balanceApi.getBalanceType().then(res => {
            if (res.code === 1) {
                setBalanceType(res.data);
            } else {
                message.error(res.message);
            }
        })
    }

    /////////////////////////导出////////////////////////
    const exportData = () => {
        message.open({
            type: 'loading',
            content: '数据生成中...',
            duration: 0,
            key: 'excel'
        });
        let params = formRef.current.getFieldsValue();
        balanceApi.exportData(params).then(res => {
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
    const columnsConst = [
        {
            title: '用户',
            dataIndex: 'user_id',
            search: true,
            valueType: 'selectTable',
            renderFormItem: () => <SelectUser />,
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
                            <Typography.Paragraph>{record.User?.tel}</Typography.Paragraph>
                        </div>
                    </div>
                }
                return '--';
            },
        },
        {
            title: '操作',
            dataIndex: 'action',
            search: false,
            render: (_, record) => <>
                <Button
                    type="link"
                    size="small"
                    disabled={authCheck('updateBalance')}
                    onClick={() => {
                        setUpdateBalanceUserId(record.user_id);
                    }}
                >变更余额</Button>
                <Button
                    type="link"
                    size="small"
                    disabled={authCheck('balanceTurn')}
                    onClick={() => {
                        setTurnUserId(record.user_id);
                    }}
                >转账</Button>
            </>,
        },
    ];
    const [columns, setColumns] = useState([]);
    useEffect(() => {
        let newColumns = balanceType.map(item => {
            return {
                title: item.title,
                dataIndex: item.field,
                search: false,
                sorter: true,
                render: (_, record) => <Typography.Text type="danger">{record[item.field]}</Typography.Text>
            }
        })
        let _columns = [...columnsConst];
        _columns.splice(1, 0, ...newColumns);
        setColumns(_columns);
    }, [balanceType])

    return (
        <>

            <PageContainer
                className="sa-page-container"
                ghost
                header={{
                    title: '用户余额',
                    style: { padding: '0px 24px 12px' },
                }}
                content={<>
                    <Row gutter={[16, 16]}>
                        {balanceType.map(item => {
                            return <Col xs={12} sm={12} md={12} lg={6} xl={4} key={item.field}>
                                <Statistic title={item.title} value={total[item.field] || 0} />
                            </Col>
                        })}
                    </Row>
                </>}
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
                        persistenceKey: 'table_column_' + 'Balance',
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
                                    disabled={authCheck('balanceExportData')}
                                >导出</Button>
                            </Tooltip>
                            {/* 变更余额 */}
                            <Lazyload block={false}>
                                <UpdateBalance
                                    tableReload={tableReload}
                                    balanceType={balanceType}
                                    updateBalanceUserId={updateBalanceUserId}
                                    setUpdateBalanceUserId={setUpdateBalanceUserId}
                                />
                            </Lazyload>
                            {/* 账户转账 */}
                            <Lazyload block={false}>
                                <Turn
                                    tableReload={tableReload}
                                    balanceType={balanceType}
                                    turnUserId={turnUserId}
                                    setTurnUserId={setTurnUserId}
                                />
                            </Lazyload>
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
                        const result = await balanceApi.getList({
                            ...params,// 包含了翻页参数跟搜索参数
                            orderBy, // 排序
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
