import { useRef, useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { balanceDetailsApi } from '@/api/balanceDetails';
import { balanceApi } from '@/api/balance';
import { fileApi } from '@/api/file';
import { ProTable } from '@ant-design/pro-components';
import { App, Button, Typography, Space, Tooltip, Avatar, Tag } from 'antd';
import {
    CloudDownloadOutlined,
} from '@ant-design/icons';
import { storage, authCheck } from '@/common/function';
import SelectUser from '@/components/selectUser';
import { useNavigate } from "react-router-dom";
import { useMount } from 'ahooks';


/**
 * 获取指定年月到当前年月的年月列表
 * @param {string} startYearMonth 年月，如 2022-01
 * @returns 
 */
function getMonthsBetween(startYearMonth) {
    const [startYear, startMonth] = startYearMonth.split('-').map(Number);
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1; // 月份从0开始，所以+1

    const result = [];
    let year = startYear;
    let month = startMonth;

    while (year < currentYear || (year === currentYear && month <= currentMonth)) {
        // 格式化为 YYYY-MM，确保月份是两位数
        result.push(`${year}-${String(month).padStart(2, '0')}`);

        // 移动到下一个月
        month++;
        if (month > 12) {
            month = 1;
            year++;
        }
    }
    result.reverse();
    return result;
}

/**
 * 对象转数组
 * @param {objec} obj 
 * @returns 
 */
const transformToLabelValueArray = (obj) => {
    return Object.entries(obj).map(([value, label]) => ({
        label: label,
        value: value
    }));
};

/**
 * 用户余额明细 
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
export default () => {
    const { message } = App.useApp();
    const navigate = useNavigate();
    const tableRef = useRef();
    const formRef = useRef();

    useMount(async () => {
        await getBalanceType();
    });

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
        balanceDetailsApi.exportData({
            ...params,
            balance_type: topKey,
        }).then(res => {
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

    /////////////////////顶部切换/////////////////
    const [topKey, setTopKey] = useState();
    const [topList, setTtopList] = useState([]);
    const getBalanceType = async () => {
        const resut = await balanceApi.getBalanceType();
        if (resut.code === 1) {
            let _balanceType = resut.data.map(item => {
                return {
                    key: item.field,
                    label: item.title,
                    details: item.details,
                    submeter_start_month: item.submeter_start_month
                }
            });
            // 过滤掉没得明细的余额
            _balanceType = _balanceType.filter(item => item.details == true);

            setTtopList(_balanceType);
            setTopKey(_balanceType[0].key);
        } else {
            message.error(resut.message);
        }
    }


    // 表格列
    const _columns = [
        {
            title: '用户',
            dataIndex: 'user_id',
            search: true,
            valueType: 'selectTable',
            renderFormItem: () => <SelectUser />,
            render: (_, record) => <div style={{ display: 'flex' }}>
                <Avatar src={record.User?.img}>{record.User?.name?.substr(0, 1)}</Avatar>
                <div style={{ paddingLeft: '5px' }}>
                    {record.User?.name}<br />
                    <Typography.Paragraph copyable style={{ marginBottom: '0' }}>{record.User?.tel}</Typography.Paragraph>
                </div>
            </div>,
        },
        {
            title: '标题',
            dataIndex: 'title',
            search: true,
            valueType: 'text',
            render: (_, record) => _,
        },
        {
            title: '明细类型',
            dataIndex: 'details_type',
            search: true,
            valueType: 'select',
            params: {
                balance_type: topKey,
            },
            request: async (params) => {
                const res = await balanceApi.getDetailsType(params);
                return transformToLabelValueArray(res.data)
            },
        },
        {
            title: '变更值',
            dataIndex: 'change_value',
            search: false,
            sorter: true,
            render: (_, record) => <>
                {record.change_value > 0 ? <>
                    <Typography.Text type="danger">{record.change_value}</Typography.Text>
                </> : <>
                    <Typography.Text type="success">{record.change_value}</Typography.Text>
                </>}
            </>
        },
        {
            title: '变更后余额',
            sorter: true,
            dataIndex: 'change_balance',
            search: false,
            render: (_, record) => <>
                <Typography.Text type="warning">{record.change_balance}</Typography.Text>
            </>
        },
        {
            title: '变化时间',
            dataIndex: 'create_time',
            search: true,
            sorter: true,
            valueType: 'dateRange',
            render: (_, record) => record.create_time,
        },
    ];
    const [columns, setColumns] = useState(_columns);

    /////监听顶部切换的时候，看明细是否有分表
    const [subTitle, setSubTitle] = useState();
    useEffect(() => {
        if (topList && topKey) {
            const _balanceType = topList.find(item => item.key == topKey);
            let __columns = [..._columns];
            let __subTitle = '';

            if (_balanceType?.submeter_start_month) {
                __subTitle = '此数据量大按照月份存储，所以列表必须按照月份浏览数据~';

                const yearMonthList = getMonthsBetween(_balanceType.submeter_start_month);
                __columns.unshift({
                    title: '月份',
                    dataIndex: 'submeter_month',
                    //定义搜索框类型
                    valueType: 'select',
                    //订单搜索框的选择项
                    fieldProps: {
                        allowClear: false,
                        options: yearMonthList.map((item) => {
                            return {
                                label: item,
                                value: item,
                            };
                        }),
                    },
                    hideInTable: true,
                    initialValue: yearMonthList[0],
                });
            }
            setSubTitle(__subTitle);
            setColumns(__columns);
        }

    }, [topKey, topList]);
    return (
        <>
            <PageContainer
                className="sa-page-container"
                ghost
                header={{
                    title: '用户余额明细',
                    style: { padding: '0px 24px 0px' },
                    subTitle: subTitle,
                }}
                tabList={topList}
                tabActiveKey={topKey}
                onTabChange={(key) => {
                    tableRef.current.reset();
                    setTopKey(key);
                }}
            >
                {topKey && <>
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
                            persistenceKey: 'table_column_' + 'BalanceDetails',
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
                                        disabled={authCheck('balanceDetailsExportData')}
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
                        params={{
                            balance_type: topKey,
                        }}
                        request={async (params = {}, sort, filter) => {
                            // 排序的时候
                            let orderBy = '';
                            for (let key in sort) {
                                orderBy = key + ' ' + (sort[key] === 'descend' ? 'desc' : 'asc');
                            }
                            const result = await balanceDetailsApi.getList({
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
                </>}

            </PageContainer>
        </>
    )
}
