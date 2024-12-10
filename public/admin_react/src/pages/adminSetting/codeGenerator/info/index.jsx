import { lazy, useState } from 'react';
import { PageContainer, ProCard } from '@ant-design/pro-components';
import { adminCodeGeneratorApi } from '@/api/adminCodeGenerator';
import { App, Space, Descriptions } from 'antd';
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { useMount } from 'ahooks';
import Lazyload from '@/component/lazyLoad/index';

const TableSetting = lazy(() => import('./component/tableSetting'));
const Validate = lazy(() => import('./component/validate'));
const Model = lazy(() => import('./component/model'));
const Logic = lazy(() => import('./component/logic'));
const Controller = lazy(() => import('./component/controller'));
const ReactApi = lazy(() => import('./component/reactApi'));
const ReactCreateUpdate = lazy(() => import('./component/reactCreateUpdate'));
const ReactInfo = lazy(() => import('./component/reactInfo'));
const ReactList = lazy(() => import('./component/reactList'));
const ReactOther = lazy(() => import('./component/reactOther'));

/**
 * 代码生成
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
export default () => {
    const navigate = useNavigate();
    const { message, modal } = App.useApp();
    const [search] = useSearchParams();

    // 表的名称
    const [tableName, setTableName] = useState();
    // 表的详情
    const [tableInfo, setTableInfo] = useState({});
    useMount(() => {
        const _tableName = search.get('name');
        if (!_tableName) {
            onBack();
        }
        setTableName(_tableName);
        getTableInfo(_tableName);
    });

    ////////////////获取详情////////////////////
    const getTableInfo = (_tableName = null) => {
        adminCodeGeneratorApi.getTableInfo({
            table_name: _tableName || tableName
        }).then(res => {
            if (res.code === 1) {
                setTableInfo(res.data);
            } else {
                message.error(res.message);
                onBack();
            }
        })
    }

    /**
     * 操作文件代码，是下载文件代码，还是生成到项目中
     * @param {string} name 要生成的文件，如 validate model logic controller react_api react_create_update react_list react_other 
     * @param {bool} forced 生成代码到项目中的时候是否强制覆盖现有文件
     */
    const operationFile = (name, forced = false) => {
        adminCodeGeneratorApi.operationFile({
            name,
            table_name: tableName,
            forced,
        }).then(res => {
            if (res.code === 1) {
                message.success(res.message);
            } else if (res.code === 2) {
                modal.confirm({
                    title: '提示',
                    content: res.message,
                    keyboard: true,
                    maskClosable: true,
                    onOk: () => {
                        operationFile(name, true);
                    }
                });
            } else {
                message.error(res.message);
            }
        })
    }
    // 返回上一页
    const onBack = () => {
        navigate('/adminSetting/codeGenerator');
    }

    // 切换选项卡
    const [tabsKey, setTabsKey] = useState('fields');
    const tabsList = [
        {
            label: `表设置`,
            key: 'fields',
            children: <Lazyload><TableSetting tableName={tableName} /></Lazyload>,

        },
        {
            label: `验证器`,
            key: 'validata',
            children: <Lazyload><Validate tableName={tableName} operationFile={operationFile} /></Lazyload>,
        },
        {
            label: `模型`,
            key: 'model',
            children: <Lazyload><Model tableName={tableName} operationFile={operationFile} /></Lazyload>,
        },
        {
            label: `后台控制器`,
            key: 'controller',
            children: <Lazyload><Controller tableName={tableName} operationFile={operationFile} /></Lazyload>,
        },
        {
            label: `后台逻辑层`,
            key: 'logic',
            children: <Lazyload><Logic tableName={tableName} operationFile={operationFile} /></Lazyload>,
        },
        {
            label: `后端api文件`,
            key: 'api',
            children: <Lazyload><ReactApi tableName={tableName} operationFile={operationFile} /></Lazyload>,
        },
        {
            label: `后端添加修改页面`,
            key: 'add',
            children: <Lazyload><ReactCreateUpdate tableName={tableName} operationFile={operationFile} /></Lazyload>,
        },
        {
            label: `后端详情页面`,
            key: 'info',
            children: <Lazyload><ReactInfo tableName={tableName} operationFile={operationFile} /></Lazyload>,
        },
        {
            label: `后端列表页`,
            key: 'list',
            children: <Lazyload><ReactList tableName={tableName} operationFile={operationFile} /></Lazyload>,
        },
        {
            label: `后端其它组件`,
            key: 'other',
            children: <Lazyload><ReactOther tableName={tableName} operationFile={operationFile} /></Lazyload>,
        },
    ]

    return (
        <>
            <PageContainer
                className="sa-page-container"
                ghost
                header={{
                    title: '代码生成',
                    style: { padding: '0 24px 12px' },
                    onBack: onBack
                }}
            >
                <Space direction="vertical" style={{ width: '100%' }} size="middle">
                    <ProCard>
                        <Descriptions
                            size="small"
                            column={{
                                xs: 1,
                                sm: 2,
                                md: 3,
                                lg: 3,
                                xl: 4,
                                xxl: 4,
                            }}
                        >
                            <Descriptions.Item label="表名">{tableInfo.Name}</Descriptions.Item>
                            <Descriptions.Item label="存储引擎">{tableInfo.Engine || '--'}</Descriptions.Item>
                            <Descriptions.Item label="数据量">{tableInfo.Rows || '--'}</Descriptions.Item>
                            <Descriptions.Item label="创建时间">{tableInfo.Create_time || '--'}</Descriptions.Item>
                            <Descriptions.Item label="更新时间">{tableInfo.Update_time || '--'}</Descriptions.Item>
                            <Descriptions.Item label="表注释">{tableInfo.Comment || '--'}</Descriptions.Item>
                        </Descriptions>
                    </ProCard>

                    {tableName ? <>
                        <ProCard
                            className='code-generator'
                            tabs={{
                                activeKey: tabsKey,
                                items: tabsList,
                                onChange: (key) => {
                                    setTabsKey(key);
                                },
                                destroyInactiveTabPane: true
                            }}
                        ></ProCard>
                    </> : null}
                </Space>
            </PageContainer>
        </>
    )
}
