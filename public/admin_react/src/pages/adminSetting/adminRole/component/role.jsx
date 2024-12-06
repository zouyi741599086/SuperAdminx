import { useRef, useState } from 'react';
import { adminMenuApi } from '@/api/adminMenu';
import { App, Drawer, Space, Input, Tree, Button } from 'antd';
import { adminRoleApi } from '@/api/adminRole'
import { useMount, useUpdateEffect } from 'ahooks';
import { menuToTree } from '@/common/function';


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

// 找出某条数据往上所有父节点，用户搜索展开
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
 * 修改角色的权限
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
export default (props) => {
    const formRef = useRef();
    const { message } = App.useApp();
    const [open, setOpen] = useState(false);

    useMount(() => {
        // 加载菜单
        getList();
    })

    // 监听修改的时候加载修改的时间
    useUpdateEffect(() => {
        if (props.roleId > 0) {
            setOpen(true);
            adminRoleApi.getDataMenu({
                id: props.roleId
            }).then(res => {
                if (res.code === 1) {
                    setRoleArr(res.data.AdminRoleMenu.map(item => item.admin_menu_id))
                } else {
                    message.error(res.message)
                }
            })
        }
    }, [props.roleId])

    /////////////////////点击数据变化的时候////////////////////////////////////
    // 往选中的数据里面添加数据
    const createRoleArr = (_roleArr, id) => {
        if (_roleArr.indexOf(id) === -1) {
            _roleArr.push(id);
        }
        return _roleArr;
    }
    // 往选中的数据里面删除数据
    const delRoleArr = (_roleArr, id) => {
        let key = _roleArr.indexOf(id);
        if (key !== -1) {
            _roleArr.splice(key, 1);
        }
        return _roleArr;
    }

    // 当某一个权限选择或选中的时候：下级全选或取消、上级pid是否该选中
    const onCheck = (checkedKeys, { checked, node }) => {
        let _roleArr = [...roleArr];
        // 找出当前点击元素的所有下级，在判断是全部选中还是取消
        let nextArr = menuListArr.filter(item => item.pid_name_path.indexOf(`,${node.name},`) !== -1 && item.id !== node.id);
        nextArr.push(node);

        // 如果选中，则把所有下级都选中
        if (checked === true) {
            nextArr.map(item => {
                _roleArr = createRoleArr(_roleArr, item.id)
            })
        }
        // 如果取消，则把所有下级都取消
        if (checked === false) {
            nextArr.map(item => {
                // 存在就删除
                _roleArr = delRoleArr(_roleArr, item.id)
            })
        }

        // 不管选中或取消，往上找父级，判断每个父级下面是否有选中的，有则父级就要选中，没得父级就要取消
        // 要反向循环，才能一级一级往上找
        for (let i = node.pid_name_path.length - 1; i >= 0; i--) {
            let pid_name = node.pid_name_path[i];
            if (pid_name === node.name) {
                continue;
            }

            // 判断下级中是否有选中的
            let isCkecked = _roleArr.some(id => {
                let menu = menuListArr.find(item => item.id === id && item.name != pid_name);
                return menu ? menu.pid_name_path.indexOf(`,${pid_name},`) !== -1 : false;
            })

            if (isCkecked === true) {
                // 有选中的，如果没得就要添加
                _roleArr = createRoleArr(_roleArr, menuListArr.find(item => item.name == pid_name).id);
            } else {
                // 没得选中的，如果有就要删除
                _roleArr = delRoleArr(_roleArr, menuListArr.find(item => item.name == pid_name).id);
            }
        }
        setRoleArr(_roleArr);
    }

    ////////start////////////////////////////////////////////////
    // 全选
    const allSelect = () => {
        setRoleArr(roleArr.length === 0 ? menuListIdArr : [])
    }


    ///////////////////搜索/////////////////////
    // 展开指定的父节点
    const [expandedKeys, setExpandedKeys] = useState([]);
    // 搜索的关键字
    const [searchKeywords, setSearchKeywords] = useState('');
    // 是否自动展开父节点
    const [autoExpandParent, setAutoExpandParent] = useState(true);
    // 监听搜索词发生改变的时候
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

    ///////////////////获取数据/////////////////////
    // 菜单列表 嵌套数组
    const [menuList, setMenuList] = useState([]);
    // 菜单列表 一维数组
    const [menuListArr, setMenuListArr] = useState([]);
    // 所有权限的id，用在全选功能上
    const [menuListIdArr, setMenuListIdArr] = useState([]);
    // 加载菜单列表
    const getList = () => {
        adminMenuApi.getList().then(res => {
            if (res.code === 1) {
                // 一维数组
                setMenuListArr(res.data);
                setMenuListIdArr(res.data.map(item => item.id))
                // 多维数组
                setMenuList(menuToTree(res.data))
                // 找出所有父节点，用于展开
                //setExpandedKeys(selectParentKey(menuList))
            }
        })
    }

    ///////////////////保存/////////////////////
    const [roleArr, setRoleArr] = useState([]);
    const [formLoading, setFormLoading] = useState(false);
    // 保存修改结果
    const updateDataRole = () => {
        setFormLoading(true);
        adminRoleApi.updateDataMenu({
            id: props.roleId,
            admin_menu_id: roleArr,
        }).then(res => {
            if (res.code === 1) {
                message.success(res.message)
                props.tableReload();
                props.setRoleId(0);
                setOpen(false);

            } else {
                message.error(res.message)
            }
            setFormLoading(false);
        }).catch(info => {
            setFormLoading(false);
        });
    }

    return (

        <Drawer
            title="权限设置"
            placement="right"
            onClose={() => {
                setOpen(false)
                props.setRoleId(0);
            }}
            open={open}
            extra={
                <Space>
                    <Button onClick={allSelect}>全选</Button>
                    <Button type="primary" onClick={updateDataRole} loading={formLoading}>保存</Button>
                </Space>
            }
        >
            <Space
                direction="vertical"
                style={{ width: '100%' }}
                size="large"
            >
                <Input.Search
                    onChange={searchKeywordsChange}
                    placeholder="搜索..."
                />
                <Tree
                    checkable
                    blockNode
                    defaultExpandAll
                    checkStrictly
                    treeData={menuList}
                    fieldNames={{ key: 'id' }}
                    autoExpandParent={autoExpandParent}
                    checkedKeys={roleArr}
                    expandedKeys={expandedKeys}
                    onExpand={onExpand}
                    onCheck={onCheck}
                    titleRender={({ title, id }) => {
                        if (title.indexOf(searchKeywords) > -1) {
                            return <>
                                <span>{title.substr(0, title.indexOf(searchKeywords))}</span>
                                <span style={{ color: 'red' }}>{searchKeywords}</span>
                                <span>{title.substr(title.indexOf(searchKeywords) + searchKeywords.length)}</span>
                            </>
                        } else {
                            return <span >{title}[{id}]</span>
                        }
                    }}
                />
            </Space>
        </Drawer >

    );
};