import { useState, lazy } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Col, Row, Card, Space, Button, Popconfirm, App, Input, Tree, Skeleton, Alert } from 'antd';
import { adminMenuApi } from '@/api/adminMenu';
import { menuToTree } from '@/common/function';
import {
    EditOutlined,
    DeleteOutlined,
} from '@ant-design/icons';
import { useMount } from 'ahooks';
import { useRecoilState } from 'recoil';
import { layoutSettingStore } from '@/store/layoutSetting';
import Lazyload from '@/component/lazyLoad/index';

const { Search } = Input;

const Create = lazy(() => import('./create'));
const Update = lazy(() => import('./update'));

// 找出多维数组的所有的父节点
const selectParentKey = (list) => {
    let expandedKeys = []
    list.map((item) => {
        if (item.children && item.children.length > 0) {
            expandedKeys.push(item.id)
            const key = selectParentKey(item.children)
            if (key) {
                expandedKeys = expandedKeys.concat(key);
            }
        }
        return true;
    })
    return expandedKeys
}

// 找出某条数据往上所有父节点，用于搜索展开
const getParentKey = (id, tree) => {
    let parentKey;
    for (let i = 0; i < tree.length; i++) {
        const node = tree[i];
        if (node.children) {
            if (node.children.some(item => item.id === id)) {
                parentKey = node.id;
            } else if (getParentKey(id, node.children)) {
                parentKey = getParentKey(id, node.children);
            }
        }
    }
    return parentKey;
};

/**
 * 后台菜单
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
export default () => {
    const [layoutSetting] = useRecoilState(layoutSettingStore);
    const { message } = App.useApp();

    useMount(() => {
        // 加载菜单
        getList();
    })

    // 展开指定的父节点
    const [expandedKeys, setExpandedKeys] = useState([]);
    // 搜索的关键字
    const [searchKeywords, setSearchKeywords] = useState('');
    // 是否自动展开父节点
    const [autoExpandParent, setAutoExpandParent] = useState(true);
    // 搜索词发生改变的时候
    const searchKeywordsChange = (e) => {
        setSearchKeywords(e.target.value);
        if (!e.target.value) {
            setExpandedKeys([])
            return false;
        }
        const expanded = menuListArr.map(item => {
            if (item.title.indexOf(e.target.value) > -1) {
                return getParentKey(item.id, menuList);
            }
            return null;
        }).filter((item, i, self) => item && self.indexOf(item) === i);
        setExpandedKeys(expanded);
        setAutoExpandParent(true);
    }


    // 展开收起父节点时候
    const onExpand = keys => {
        setExpandedKeys(keys);
        setAutoExpandParent(false);
    }

    // 菜单列表 嵌套数组
    const [menuList, setMenuList] = useState([]);
    // 菜单列表 一维数组
    const [menuListArr, setMenuListArr] = useState([]);
    // 加载菜单列表
    const getList = () => {
        adminMenuApi.getList({
            hidden: 'all'
        }).then(res => {
            if (res.code === 1) {
                const tmp = res.data.map(item => {
                    return {
                        ...item,
                        //disabled: item.type === 7 // 类型为7的数据是参数设置管理里面自动同步过来的，不允许删除、编辑
                    }
                })
                // 一维数组
                setMenuListArr(tmp);
                // 多维数组
                setMenuList(menuToTree(tmp))
                // 找出所有父节点，用于展开
                //setExpandedKeys(selectParentKey(menuList))
            }
        })
    }

    ///////////////////修改的数据id//////////////
    const [updateId, setUpdateId] = useState([]);

    ////////////////删除///////////////////
    const [deleteArr, setDeleteArr] = useState([]);

    const del = () => {
        adminMenuApi.delete({
            id: deleteArr
        }).then(res => {
            if (res.code === 1) {
                message.success(res.message)
                getList();
                setDeleteArr([]);
            } else {
                message.error(res.message)
            }
        })
    }

    return (
        <>
            <PageContainer
                className="sa-page-container"
                ghost
                header={{
                    title: '权限节点',
                    subTitle: '非技术人员请不要做任何改动，否则将会导致系统瘫痪~',
                    style: { padding: '0 24px 12px' },
                }}
            >
                <Row>
                    <Col xs={24} md={12} lg={8} xl={8} xxl={8} style={{ marginBottom: '12px', paddingRight: layoutSetting.isMobile === false ? '12px' : '0px' }}>
                        <Card
                            variant="borderless"
                            title={`权限节点`}
                            extra={<>
                                <Space>
                                    <Button danger size="small" disabled={deleteArr.length > 0 ? false : true}>
                                        <Popconfirm
                                            title="确定要删除吗?"
                                            icon={<DeleteOutlined />}
                                            onConfirm={del}
                                        >
                                            删除({deleteArr.length})
                                        </Popconfirm>
                                    </Button>
                                    <Lazyload block={false}><Create menuList={menuList} getList={getList} /></Lazyload>
                                </Space>
                            </>}
                        >
                            <Space direction="vertical" style={{ width: '100%' }} size="large">
                                <Search
                                    onChange={searchKeywordsChange}
                                    placeholder="搜索..."
                                />
                                <Tree
                                    checkable={true}
                                    blockNode
                                    treeData={menuList}
                                    height={700}
                                    fieldNames={{
                                        key: 'id'
                                    }}
                                    autoExpandParent={autoExpandParent}
                                    checkedKeys={deleteArr}
                                    checkStrictly={false}
                                    selectedKeys={updateId}
                                    expandedKeys={expandedKeys}
                                    onExpand={onExpand}
                                    onSelect={setUpdateId}
                                    onCheck={setDeleteArr}
                                    titleRender={({ title, name, id, hidden }) => {
                                        if (title.indexOf(searchKeywords) > -1) {
                                            return <div style={{ opacity: hidden == 1 ? 1 : 0.6 }}>
                                                <span>{title.substr(0, title.indexOf(searchKeywords))}</span>
                                                <span style={{ color: 'red' }}>{searchKeywords}</span>
                                                <span>{title.substr(title.indexOf(searchKeywords) + searchKeywords.length)}[{name}]</span>
                                            </div>
                                        } else {
                                            return <span >{title}[{name}]</span>
                                        }
                                    }}
                                >
                                </Tree>
                            </Space>

                        </Card>
                    </Col>
                    <Col xs={24} md={12} lg={16} xl={16} xxl={16}>
                        <Card variant="borderless" title={<><EditOutlined /> <span>编辑节点</span></>}>
                            {updateId.length > 0 ? <>
                                <Lazyload>
                                    <Update
                                        updateId={updateId}
                                        menuList={menuList}
                                        getList={getList}
                                        setUpdateId={setUpdateId}
                                    />
                                </Lazyload>
                            </> : <>
                                <Space direction='vertical' size="middle" style={{ width: '100%' }}>
                                    <Alert message="请点击权限节点名称，然后进行编辑" type="info" showIcon />
                                    <Skeleton />
                                </Space>
                            </>}

                        </Card>
                    </Col>
                </Row>
            </PageContainer>
        </>
    )
}
