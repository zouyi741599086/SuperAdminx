import { useRef, lazy, useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import {wordTemplateApi} from '@/api/wordTemplate';
import { ProTable } from '@ant-design/pro-components';
import { App, Button, Popconfirm, Typography, Space, Tooltip,
Switch, Tag, Image, InputNumber, Badge, } from 'antd';
import {
    OrderedListOutlined,
    QuestionCircleOutlined,
    CloudDownloadOutlined,
    DeleteOutlined,
    PlusOutlined,
    EyeOutlined,
    EyeInvisibleOutlined,
} from '@ant-design/icons';
import {config} from '@/common/config';
import { NavLink } from 'react-router-dom';
import { authCkeck, arrayToTree} from '@/common/function';
import {fileApi} from '@/api/file';
import ImportData from './importData';
import Lazyload from '@/pages/component/lazyLoad/index';
import PreviewTeditor from '@/pages/component/preview/teditor/index';
import SelectWordTemplate from '@/pages/components/selectWordTemplate';
import UpdateDescription from './updateDescription';
import UpdateCreateTime from './updateCreateTime';
import UpdateJingweidu from './updateJingweidu';
import UpdateDeleteTime from './updateDeleteTime';

const imgErr = new URL('@/static/default/imgErr.png', import.meta.url).href;
const Create = lazy(() => import('./create'));
const Update = lazy(() => import('./update'));
const Info = lazy(() => import('./info'));


export default () => {
    const { message } = App.useApp();
    const tableRef = useRef();
    const formRef = useRef();

    //刷新表格数据
    const tableReload = () => {
        tableRef.current.reload();
        tableRef.current.clearSelected();
    }

    //要修改的数据
    const [updateId, setUpdateId] = useState(0);
    //要查看详情的数据
    const [infoId, setInfoId] = useState(0);    

    /////////////修改状态///////////////
    const updateStatus = (id, status) => {
        wordTemplateApi.updateStatus({
            id,
            status
        }).then(res => {
            if (res.code === 1) {
                message.success(res.message)
                tableReload();
            } else {
                message.error(res.message)
            }
        })
    }

    ///////////////////////////保存排序///////////////////////////
    const [sortArr, setSortArr] = useState([]);
    const updateSort = () => {
        wordTemplateApi.updateSort({ list: sortArr }).then(res => {
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
    //排序改变的时候
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
        wordTemplateApi.delete({
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

    /////////////////////////导出////////////////////////
    const exportData = () => {
        message.open({
            type: 'loading',
            content: '数据生成中...',
            duration: 0,
            key: 'excel'
        });
        let params = formRef.current.getFieldsValue();
        wordTemplateApi.exportData(params).then(res => {
            message.destroy('excel')
            if (res.code === 1 && res.data.filePath && res.data.fileName) {
                message.success('数据已生成');
                setTimeout(() => {
                    window.open(`${fileApi.download}?filePath=${res.data.filePath}&fileName=${res.data.fileName}`);
                }, 1000)
            } else {
                message.error('数据导出失败');
            }
        })
    }

    ////////////////////顶部的tabs//////////////////////
    const [tabsKey, setTabsKey] = useState('0');
    const [tabsList] = useState([
        {
            key: '0',
            label: <Badge size="small" count={10} offset={[10, 0]}>所有</Badge>,
            
        },
        {
            key: '1',
            label: <Badge size="small" count={10} offset={[10, 0]}>待发货</Badge>,
            
        },
        {
            key: '2',
            label: <Badge size="small" count={10} offset={[10, 0]}>已完成</Badge>,
            
        },
    ]);
    
    //表格列
    const columns = [
        {
            title: '标题',
            dataIndex: 'title',
            search: true,
            valueType : 'text',
            render: (_, record) => _,
        },
        {
            title: '简介',
            dataIndex: 'description',
            search: true,
            valueType : 'text',
            ellipsis: true,
            render: (_, record) => _,
        },
        {
            title: '状态',
            dataIndex: 'status',
            search: true,
            valueType : 'select',
            fieldProps: {
                showSearch: true,
                options: [
                    {
                        value: 1,
                        label: '显示',
                    },
                    {
                        value: 2,
                        label: '隐藏',
                    },
                ]
            },
            render: (_, record) => <>
                <Switch
                    checked={record.status === 1 ? true : false}
                    checkedChildren="显示"
                    unCheckedChildren="隐藏"
                    onClick={() => {
                        updateStatus(record.id, record.status == 1 ? 2 : 1);
                    }}
                    disabled={authCkeck('wordTemplateStatus')}
                />
            </>
        },
        {
            title: '点击量',
            dataIndex: 'pv',
            search: false,
            render: (_, record) => <>
                {/* magenta red volcano orange gold lime green cyan blue geekblue purple*/}
                <Tag color='magenta'>{record.pv}</Tag>
            </>
        },
        {
            title: '内容',
            dataIndex: 'content',
            search: true,
            valueType : 'text',
            render: (_, record) => <>
                <PreviewTeditor title="内容" content={record.content} />
            </>
        },
        {
            title: '图片',
            dataIndex: 'img',
            search: false,
            render: (_, record) => (
                <Image
                    width={40}
                    src={`${record.img}`}
                    fallback={imgErr}
                />
            )
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
                    disabled={authCkeck('wordTemplateSort')}
                    onChange={(value) => {
                        sortArrChange(record.id, value);
                    }}
                />
            </>
        },
        {
            title: '新增时间',
            dataIndex: 'create_time',
            search: true,
            valueType : 'dateTimeRange',
            render: (_, record) => record.create_time,
        },
        {
            title: '所属用户',
            dataIndex: 'user_id',
            search: true,
            valueType : 'selectTable',
            renderFormItem: () => <SelectWordTemplate />,
            render: (_, record) => _,
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
                            setInfoId(record.id) 
                        }}
                        disabled={authCkeck('wordTemplateInfo')}
                    >详情</Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => { 
                            setUpdateId(record.id) 
                        }}
                        disabled={authCkeck('wordTemplatUpdate')}
                    >修改</Button>
                    <Popconfirm
                        title="确认要删除吗？"
                        onConfirm={() => { del(record.id) }}
                        disabled={authCkeck('wordTemplateDelete')}
                    >
                        <Button
                            type="link"
                            size="small"
                            danger
                            disabled={authCkeck('wordTemplateDelete')}
                        >删除</Button>
                    </Popconfirm>
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
           {/* 查看详情 */}
            <Lazyload block={false}>
                <Info
                    infoId={infoId}
                    setInfoId={setInfoId}
                />
            </Lazyload>
            <PageContainer
                className="sa-page-container"
                ghost
                header={{
                    title: 'word模板',
                    style: { padding: '0px 24px 12px' },
                }}
                
                tabProps={{
                    className: 'sa-page-container_ant-tabs'
                }}
                tabList={tabsList}
                tabActiveKey={tabsKey}
                onTabChange={setTabsKey}
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
                        //此table列设置后存储本地的唯一key
                        persistenceKey: 'table_column_' + 'WordTemplate', 
                        persistenceType: 'localStorage'
                    }}
                    headerTitle={
                        <Space>
                            <Lazyload block={false}>
                                <Create tableReload={tableReload} />
                            </Lazyload>
                                    
                            <Tooltip title="根据当前搜索条件导出数据~">
                                <Button
                                    type="primary"
                                    danger
                                    ghost
                                    icon={<CloudDownloadOutlined />}
                                    onClick={exportData}
                                    disabled={authCkeck('wordTemplateExport')}
                                >导出</Button>
                            </Tooltip>
                            <ImportData
                                tableReload={tableReload}
                            />
                            <Button
                                type="primary"
                                onClick={updateSort}
                                disabled={authCkeck('wordTemplateSort')}
                                icon={<OrderedListOutlined />}
                            >保存排序</Button>
                        </Space>
                    }
                    pagination={{
                        defaultPageSize: 10,
                        size: 'default',
                        //支持跳到多少页
                        showQuickJumper: true,
                        showSizeChanger: true,
                        responsive: true,
                    }}
                    request={async (params = {}, sort, filter) => {
                        //排序的时候
                        let orderBy = '';
                        for (let key in sort) {
                            orderBy = key + ' ' + (sort[key] === 'descend' ? 'desc' : 'asc');
                        }
                        const result = await wordTemplateApi.getList({
                            ...params,//包含了翻页参数跟搜索参数
                            orderBy, //排序
                            page: params.current,
                        });
                        return {
                            data: result.data.data,
                            success: true,
                            total: result.data.total,
                        };
                    }}

                    //开启批量选择
                    rowSelection={{
                        preserveSelectedRowKeys: true,
                    }}
                    //批量选择后左边操作
                    tableAlertRender={({ selectedRowKeys, }) => {
                        return (
                            <Space>
                                <span>已选 {selectedRowKeys.length} 项</span>
                                <Popconfirm
                                    title={`确定批量删除这${selectedRowKeys.length}条数据吗？`}
                                    onConfirm={() => { 
                                        del(selectedRowKeys) 
                                    }}
                                    disabled={authCkeck('wordTemplateDelete')}
                                >
                                    <Button 
                                        type="link" 
                                        size='small' 
                                        danger 
                                        icon={<DeleteOutlined />} 
                                        disabled={authCkeck('wordTemplateDelete')}
                                    >批量删除</Button>
                                </Popconfirm>

                                <Button
                                    type="link"
                                    size='small'
                                    icon={<EyeOutlined />}
                                    disabled={authCkeck('wordTemplateStatus')}
                                    onClick={()=>{
                                        updateStatus(selectedRowKeys,1);
                                    }}
                                >显示</Button>
                                <Button
                                    type="link"
                                    size='small'
                                    icon={<EyeInvisibleOutlined />}
                                    disabled={authCkeck('wordTemplateStatus')}
                                    onClick={()=>{
                                        updateStatus(selectedRowKeys,2);
                                    }}
                                >隐藏</Button>
                                <UpdateDescription 
                                    tableReload={tableReload} 
                                    ids={selectedRowKeys} 
                                />
                                <UpdateCreateTime 
                                    tableReload={tableReload} 
                                    ids={selectedRowKeys} 
                                />
                                <UpdateJingweidu 
                                    tableReload={tableReload} 
                                    ids={selectedRowKeys} 
                                />
                                <UpdateDeleteTime 
                                    tableReload={tableReload} 
                                    ids={selectedRowKeys} 
                                />

                            </Space>
                        );
                    }}                
                />
            </PageContainer>
        </>
    )
}
