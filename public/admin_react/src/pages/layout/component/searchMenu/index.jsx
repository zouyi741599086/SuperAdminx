import { useState, useEffect } from 'react';
import { Tooltip } from 'antd';
import {
    ModalForm,
} from '@ant-design/pro-components';
import { App, Input, Table, Space } from 'antd';
import {
    SearchOutlined
} from '@ant-design/icons';
import { useDebounceFn } from 'ahooks';
import { deepClone } from '@/common/function';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { menuAuthStore } from '@/store/menuAuth';

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
            newArr.push(item);
        }
    })
    return newArr
}

/**
 * @param {array} pid_name_path 菜单的路劲，从上往下，一直找，按理说上面是不需要参数就能访问的，一直找到下面需要参数就停止找了
 * @param {array} arr 菜单数据，一维数组
 */
const upSearchPath = (pid_name_path, arr) => {
    let result = '';
    if (!pid_name_path) {
        return result;
    }

    pid_name_path.some(_name => {
        const menu = arr.find(item => item.name == _name);
        if (menu.path && menu.is_params == 1) {
            result = menu.path;
        }
        return (menu.path && menu.is_params == 1) ? true : false;
    })
    return result;
}

/**
 * 后台搜索功能，实际上就是搜索菜单
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 */
export default ({ placement = 'top' }) => {
    const { message } = App.useApp();
    const navigate = useNavigate();
    const [menuAuth] = useRecoilState(menuAuthStore);
    const [open, setOpen] = useState(false);

    // 原始是所有数据
    const [list, setList] = useState([]);
    // 搜索后需要展示的数据
    const [tmpList, setTmpList] = useState([]);

    useEffect(() => {
        // 第一次打开弹窗，去初始化数据等
        if (open && list.length == 0) {
            getSearchMenu();
        }
    }, [open])

    // 从后台获取所有的权限
    const getSearchMenu = async () => {

        // 将所有权限节点变多维数组，要过滤掉隐藏的菜单
        let tmpMenu = menuToTree(menuAuth.menu.filter(item => item.hidden == 1));

        let result = [];
        // 往result里面装数据
        const resultPush = (_item) => {
            // 如果有描述的话，就增加
            if (_item.desc) {
                _item.title = `${_item.title}[${_item.desc}]`;
            }
            result.push(_item);
        }

        // 在到多维数组里面找对所有的最底层的权限，用来当菜单权限数据进行搜索
        const tmpMenuFun = (arr) => {
            arr.map(item => {
                if (item.title != '只浏览数据') {
                    const url = upSearchPath(item.pid_name_path, menuAuth.menu)
                    if (url) {
                        resultPush({
                            id: item.id,
                            title: item.pid_path_title,
                            desc: item?.desc,
                            url: url
                        });
                    }
                }
                // 如果有下级继续找，需要把当前访问的url传进去
                if (item.children && item.children.length > 0) {
                    return tmpMenuFun(item.children);
                }
            })
        }
        tmpMenuFun(tmpMenu);
        setList(result);
        setTmpList(result);

    }

    // 搜索的关键字
    const [keywords, setKeywords] = useState('');
    // 触发搜索的时候，防抖处理
    const { run: onSearch } = useDebounceFn(
        (keywords) => {
            setKeywords(keywords);
            if (keywords) {
                setTmpList(list.filter(item => {
                    return item.title.includes(keywords);
                }))
            } else {
                setTmpList(list);
            }
        },
        {
            wait: 500,
        },
    );

    return <>
        <ModalForm
            open={open}
            onOpenChange={(_boolean) => {
                setOpen(_boolean);
            }}
            title="搜索菜单功能"
            width={600}
            submitter={false}
            trigger={
                <div className='item' >
                    <Tooltip title="搜索功能" placement={placement}>
                        <span className='circle'>
                            <SearchOutlined className='icon' />
                        </span>
                    </Tooltip>
                </div>
            }
        >
            <Space direction="vertical" style={{ width: '100%' }} size={24}>
                <Search
                    placeholder="请输入..."
                    onChange={(e) => {
                        onSearch(e.target.value)
                    }}
                    onSearch={onSearch}
                />
                <Table
                    bordered={false}
                    dataSource={tmpList}
                    showHeader={false}
                    style={{ cursor: 'pointer' }}
                    rowKey="id"
                    columns={[
                        {
                            dataIndex: 'title',
                            key: 'title',
                            title: '菜单名称',
                            render: (_, record) => {
                                // 搜索的关键字标红
                                if (keywords && record.title.indexOf(keywords) > -1) {
                                    return <>
                                        {record.title.substr(0, record.title.indexOf(keywords))}
                                        <span style={{ color: 'red' }}>{keywords}</span>
                                        {record.title.substr(record.title.indexOf(keywords) + keywords.length)}
                                    </>
                                } else {
                                    return record.title
                                }
                            }
                        },
                    ]}
                    size="small"
                    scroll={{
                        y: 500
                    }}
                    pagination={false}
                    onRow={(record) => {
                        return {
                            // 点击行的时候，跳转页面
                            onClick: (event) => {
                                setOpen(false);
                                navigate(record.url)
                            },
                        };
                    }}
                />
            </Space>
        </ModalForm>
    </>;
};
