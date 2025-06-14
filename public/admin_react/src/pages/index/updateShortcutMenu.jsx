import { useRef, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { adminUserShortcutMenuApi } from '@/api/adminUserShortcutMenu';
import { App, Input, Card, Modal, Space, Tree } from 'antd';
import { useMount } from 'ahooks';
import { deepClone } from '@/common/function'

const { Search } = Input;

/**
 * 数组转多维数据，会给数组增加上级的路劲
 * @param {Array} arrs 需要转换的一维数据
 * @param {Any} pid 上级
 * @param {Array} pid_path_title 路劲标题
 * @returns 
 */
const menuToTree = (arrs, pid = null, pid_path_title = '') => {
    let arr = deepClone(arrs);
    let newArr = [];
    arr.forEach(item => {
        if (item['pid_name'] === pid) {
            item.pid_path_title = `${pid_path_title}${pid_path_title ? '-' : ''}${item.title}`;
            let children = menuToTree(arr, item['name'], item.pid_path_title);
            item['children'] = children;
            item['disabled'] = children.length > 0;
            newArr.push(item);
        }
    })
    return newArr
}

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
 * 用户快捷菜单 修改
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
export default (props) => {
    const formRef = useRef();
    const { message } = App.useApp();

    // 菜单列表 嵌套数组
    const [menuList, setMenuList] = useState([]);
    // 菜单列表 一维数组
    const [menuListArr, setMenuListArr] = useState([]);
    // 展开指定的父节点
    const [expandedKeys, setExpandedKeys] = useState([]);
    // 搜索的关键字
    const [searchKeywords, setSearchKeywords] = useState('');
    // 是否自动展开父节点
    const [autoExpandParent, setAutoExpandParent] = useState(true);
    // 所有的父节点id
    const [parentIds, setParentIds] = useState([]);
    // 提交的value值
    const [value, setValue] = useState([]);
    // 弹窗的开关
    const [open, setOpen] = useState(false);
    useMount(() => {
        getMenuList();
    })

    // 提交
    const formSubmit = () => {
        adminUserShortcutMenuApi.update({
            ...value
        }).then(result => {
            if (result.code === 1) {
                props.getMenuList();
                setOpen(false);
            } else {
                message.error(result.message);
            }
        });
    }

    // 获取我选中的菜单
    const getList = () => {
        adminUserShortcutMenuApi.getList().then(result => {
            if (result.code === 1) {
                const _value = result.data.map(item => {
                    return item.admin_menu_id;
                });
                setValue(_value);
            } else {
                message.error(result.message);
            }
        });
    }

    // 获取所有菜单
    const getMenuList = () => {
        adminUserShortcutMenuApi.getMenuList().then(result => {
            if (result.code === 1) {
                let _menuList = result.data.map(item => {
                    return {
                        id: item.id,
                        title: item.title,
                        name: item.name,
                        pid_name: item.pid_name,
                    }
                });
                // 一维数组
                setMenuListArr(_menuList);
                // 多维数组
                setMenuList(menuToTree(_menuList));

                // 找出所有父节点，用于展开
                const _parentIds = selectParentKey(menuToTree(_menuList));
                setParentIds(_parentIds);
                setExpandedKeys(_parentIds);
            } else {
                message.error(result.message);
            }
        });
    };

    // 选中节点的时候
    const changeValue = (selectedKeys) => {
        // 存在则删除，否则添加
        setValue(prevValue => {
            const index = prevValue.indexOf(selectedKeys[0]);
            if (index === -1) {
                return [...prevValue, selectedKeys[0]];
            } else {
                return prevValue.filter(v => v !== selectedKeys[0]);
            }
        });
    }

    // 搜索词发生改变的时候
    const searchKeywordsChange = (e) => {
        setSearchKeywords(e.target.value);
        if (!e.target.value) {
            setExpandedKeys(parentIds)
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

    return <>
        <Card
            hoverable={true}
            size="small"
            style={{
                width: 80,
                textAlign: 'center',
            }}
            onClick={() => {
                setOpen(true);
                getList();
            }}
        >
            <div>
                <PlusOutlined style={{
                    fontSize: 20,
                }} />
                <div
                    style={{
                        fontSize: 14,
                        width: 68
                    }}
                >添加菜单</div>
            </div>
        </Card>
        <Modal
            title="设置快捷菜单"
            closable={true}
            destroyOnHidden={true}
            open={open}
            onOk={formSubmit}
            onCancel={() => setOpen(false)}
        >
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
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
                    checkStrictly={false}
                    expandedKeys={expandedKeys}
                    onExpand={onExpand}
                    selectedKeys={[]} // 设置为空，不让节点为选中状态
                    onSelect={changeValue}
                    checkedKeys={value}
                    onCheck={setValue}
                    titleRender={({ title, name, id, hidden }) => {
                        if (title.indexOf(searchKeywords) > -1) {
                            return <div>
                                <span>{title.substr(0, title.indexOf(searchKeywords))}</span>
                                <span style={{ color: 'red' }}>{searchKeywords}</span>
                                <span>{title.substr(title.indexOf(searchKeywords) + searchKeywords.length)}</span>
                            </div>
                        } else {
                            return <span >{title}</span>
                        }
                    }}
                >
                </Tree>
            </Space>
        </Modal>
    </>;
};
