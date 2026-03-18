import { lazy, useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { adminCodeGeneratorApi } from '@/api/adminCodeGenerator';
import { App, Space, Descriptions, Card } from 'antd';
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { useMount } from 'ahooks';
import Lazyload from '@/component/lazyLoad/index';

const TableSetting = lazy(() => import('./tableSetting'));
const Validate = lazy(() => import('./validate'));
const Model = lazy(() => import('./model'));
const Logic = lazy(() => import('./logic'));
const Service = lazy(() => import('./service'));
const ControllerAdmin = lazy(() => import('./controllerAdmin'));
const ControllerApi = lazy(() => import('./controllerApi'));
const ReactApi = lazy(() => import('./reactApi'));
const UniApi = lazy(() => import('./uniApi'));
const ReactCreateUpdate = lazy(() => import('./reactCreateUpdate'));
const ReactInfo = lazy(() => import('./reactInfo'));
const ReactList = lazy(() => import('./reactList'));
const ReactOther = lazy(() => import('./reactOther'));

/**
 * 代码生成
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
const Info = () => {
    const navigate = useNavigate();
    const { message, modal } = App.useApp();
    const [search] = useSearchParams();

    // 表的名称
    const [tableName, setTableName] = useState();
    // 表的详情
    const [tableInfo, setTableInfo] = useState({});
    const [tableInfoItems, setTableInfoItems] = useState([]);

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

                setTableInfoItems([
                    {
                        key: 'Name',
                        label: '表名',
                        children: res.data.Name,
                    },
                    {
                        key: 'Engine',
                        label: '存储引擎',
                        children: res.data.Engine,
                    },
                    {
                        key: 'Rows',
                        label: '数据量',
                        children: res.data.Rows,
                    },
                    {
                        key: 'Create_time',
                        label: '创建时间',
                        children: res.data.Create_time,
                    },
                    {
                        key: 'Update_time',
                        label: '更新时间',
                        children: res.data.Update_time,
                    },
                    {
                        key: 'Comment',
                        label: '表注释',
                        children: res.data.Comment,
                    },
                ])
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
            destroyOnHidden: true,
            children: <Lazyload><Validate tableName={tableName} operationFile={operationFile} /></Lazyload>,
        },
        {
            label: `模型`,
            key: 'model',
            destroyOnHidden: true,
            children: <Lazyload><Model tableName={tableName} operationFile={operationFile} /></Lazyload>,
        },
        {
            label: `后台控制器`,
            key: 'controllerAdmin',
            destroyOnHidden: true,
            children: <Lazyload><ControllerAdmin tableName={tableName} operationFile={operationFile} /></Lazyload>,
        },
        {
            label: `前端控制器`,
            key: 'controllerApi',
            destroyOnHidden: true,
            children: <Lazyload><ControllerApi tableName={tableName} operationFile={operationFile} /></Lazyload>,
        },
        {
            label: `服务层`,
            key: 'service',
            destroyOnHidden: true,
            children: <Lazyload><Service tableName={tableName} operationFile={operationFile} /></Lazyload>,
        },
        {
            label: `逻辑层`,
            key: 'logic',
            destroyOnHidden: true,
            children: <Lazyload><Logic tableName={tableName} operationFile={operationFile} /></Lazyload>,
        },
        {
            label: `后端api文件`,
            key: 'react_api',
            destroyOnHidden: true,
            children: <Lazyload><ReactApi tableName={tableName} operationFile={operationFile} /></Lazyload>,
        },
        {
            label: `前端api文件`,
            key: 'api',
            destroyOnHidden: true,
            children: <Lazyload><UniApi tableName={tableName} operationFile={operationFile} /></Lazyload>,
        },
        {
            label: `后端添加修改页面`,
            key: 'add',
            destroyOnHidden: true,
            children: <Lazyload><ReactCreateUpdate tableName={tableName} operationFile={operationFile} /></Lazyload>,
        },
        {
            label: `后端详情页面`,
            key: 'info',
            destroyOnHidden: true,
            children: <Lazyload><ReactInfo tableName={tableName} operationFile={operationFile} /></Lazyload>,
        },
        {
            label: `后端列表页`,
            key: 'list',
            destroyOnHidden: true,
            children: <Lazyload><ReactList tableName={tableName} operationFile={operationFile} /></Lazyload>,
        },
        {
            label: `后端其它组件`,
            key: 'other',
            destroyOnHidden: true,
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
                <Space
                    orientation="vertical"
                    size="middle"
                    styles={{
                        root: { width: '100%' }
                    }}
                >
                    <Card
                        variant="borderless"
                    >
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
                            items={tableInfoItems}
                        />
                    </Card>

                    {tableName ? <>
                        <Card
                            tabList={tabsList}
                            activeTabKey={tabsKey}
                            onTabChange={(key) => {
                                setTabsKey(key);
                            }}
                            variant="borderless"
                        ></Card>
                    </> : null}
                </Space>
            </PageContainer>
        </>
    )
}

export default Info;