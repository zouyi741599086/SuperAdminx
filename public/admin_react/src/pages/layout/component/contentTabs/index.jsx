import { useState, useEffect } from 'react';
import { menuAuthStore } from '@/store/menuAuth';
import { useRecoilState } from 'recoil';
import { contentTabsStore } from '@/store/contentTabs';
import { layoutSettingStore } from '@/store/layoutSetting';
import { Layout, Dropdown, Button, Tabs } from 'antd';
import { deepClone } from '@/common/function';
import {
    DownOutlined,
    ArrowLeftOutlined,
    ArrowRightOutlined,
    CloseCircleOutlined,
    CloseCircleFilled,
} from '@ant-design/icons';
import {
    useLocation,
    useNavigate,
} from "react-router-dom";
import './index.css';
import Item from './item';

const { Header } = Layout;

/**
* 用当前页面，判断是不是内页，就是一直往上找上一级页面
* @param {String} pageName 当前页面的名称
* @returns 当前页面的数据
*/
const routerParent = (pageName, menuArrAll) => {
    let menu;
    // 判断当前页面是否是内页
    menuArrAll.some(item => {
        if (item.name === pageName) {
            item.pid_name_path.some(name => {
                menu = menuArrAll.find(some => {
                    return some.name === name && some.path !== "";
                })
                if (menu) {
                    return true;
                }
            })
            return true;
        }
    })
    return menu;
}

/**
 * 后台布局中的 多tabs页面切换
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 */
export default () => {
    const [layoutSetting] = useRecoilState(layoutSettingStore);
    const [contentTabs, setContentTabs] = useRecoilState(contentTabsStore);
    const [menuAuth] = useRecoilState(menuAuthStore);
    const location = useLocation();
    const navigate = useNavigate();
    // 设置tabs的数据
    const [tabsList, setTabsList] = useState([]);

    // 关闭多个页面
    const closePages = type => {
        // 需要关闭的页面
        let closeArr = [];
        // 需要保留的页面
        let retainArr = [];
        // 是否循环到当前页面
        let isActive = false;
        // 当前选中页面
        let activeName = contentTabs.activeName;

        // 关闭左侧
        if (type === 'left') {
            // 需要关闭的页面
            contentTabs.list.some((item) => {
                if (item.close === true && isActive === false && item.name !== contentTabs.activeName) {
                    closeArr.push(item)
                } else {
                    retainArr.push(item)
                }
                if (item.name === contentTabs.activeName) {
                    isActive = true;
                }
            })
        }
        // 关闭右侧
        if (type === 'right') {
            // 需要关闭的页面
            contentTabs.list.some((item) => {
                if (isActive === false || item.name === contentTabs.activeName) {
                    retainArr.push(item)
                } else {
                    closeArr.push(item)
                }
                if (item.name === contentTabs.activeName) {
                    isActive = true;
                }
            })
        }
        // 关闭其它
        if (type === 'other') {
            // 需要关闭的页面
            contentTabs.list.some((item) => {
                if (item.close === true && item.name !== contentTabs.activeName) {
                    closeArr.push(item)
                } else {
                    retainArr.push(item)
                }
            })
        }
        // 关闭全部
        if (type === 'all') {
            // 需要关闭的页面
            contentTabs.list.some((item) => {
                if (item.close === true) {
                    closeArr.push(item)
                } else {
                    navigate(item.path)
                    activeName = item.name;
                    retainArr.push(item)
                }
            })
        }

        setContentTabs((val) => ({
            ...val,
            activeName,
            list: retainArr,
        }))
    }

    // 导航钩子，监听url变化的时候
    useEffect(() => {
        if (!location.pathname) {
            return;
        }
        const menu = menuAuth.menuArrAll.find(item => location.pathname.toLowerCase() == item.path.toLowerCase());
        if (!menu) {
            return;
        }
        // 查找当前点击页面 最顶层的一级页面
        const menuTop = routerParent(menu.name, menuAuth.menuArrAll);
        if (menuTop) {
            let _list = deepClone(contentTabs.list);
            // 判断当前跳转页面的顶层一级页面是否在tabs中，没在说明是新开标签则添加
            const isTabsOn = contentTabs.list.some(item => item.name === menuTop.name)
            if (isTabsOn === false) {
                // 这是添加tabs中的顶级
                _list.push({
                    name: menuTop.name,
                    title: menuTop.title,
                    path: menuTop.path,
                    keepAlive: [menuTop.name],
                    close: menuTop.path === '/index' ? false : true // 首页不能关闭
                });
            }

            // 把当前跳转的url赋值给tabs顶级的path，这样切换tabs的时候不会变一级页面，因为tabs所在页面不可能全是一级页面，可能是内页
            let tabsIndex; //当前激活tabs的索引
            _list.some((item, index) => {
                if (item.name === menuTop.name) {
                    tabsIndex = index;
                    _list[index].path = `${location.pathname}${location.search}`;
                    return false;
                }
            })

            // 重新计算keepAlive该缓存哪些页面
            let keepAlive = [];
            // 在一个tabs的item中，任意级页面的跳转，重新计算出item中的keepAlive，该缓存多少级页面
            _list[tabsIndex].keepAlive = []; //先清空原tabs中item中的keepAlive
            menuAuth.menuArrAll.find(item => item.name === menu.name).pid_name_path?.some(menuName => {
                menuAuth.menuArrAll.some(_item => {
                    if (menuName === _item.name) {
                        if (_item.name) {
                            _list[tabsIndex].keepAlive.push(_item.name);
                            keepAlive.push(_item.name);
                        }
                        return true;
                    }
                })
            })
            // 缓存计算后删掉不要的缓存
            contentTabs.keepAlive.map(_item => {
                if (keepAlive.indexOf(_item) === -1) {
                    ///////开始删除////////////
                }
            })

            setContentTabs((val) => ({
                ...val,
                keepAlive,
                activeName: menuTop.name,
                list: _list
            }));
        }
    }, [location])

    // 点击关闭一个页面
    const closePage = name => {
        let activeName = contentTabs.activeName;
        // 判断当前所在页面是否是要关闭的页面，是的话找到关闭的左边一个页面，关闭了后自动跳到左边个页面
        if (name === contentTabs.activeName) {
            contentTabs.list.some((item, index) => {
                if (item.name === name) {
                    activeName = contentTabs.list[index - 1].name;
                    navigate(contentTabs.list[index - 1].path)
                    return true;
                }
            })
        }
        setContentTabs((val) => ({
            ...val,
            activeName,
            list: contentTabs.list.filter(item => item.name != name)
        }))
    }

    // 更新tabs标签
    useEffect(() => {
        let _tabsList = [];
        contentTabs.list.map(item => {
            let _item = deepClone(item);
            _tabsList.push({
                ..._item,
                key: _item.name,
                label: <Item
                    title={_item.title}
                    name={_item.name}
                    close={_item.close}
                    path={_item.path}
                    closePage={closePage}
                    activeName={contentTabs.activeName}
                />
            })
        })
        setTabsList(_tabsList)
    }, [contentTabs.list])



    return (
        <>
            <Header className='sa-tabs' style={{ height: layoutSetting.antdThemeValue == 'compact' ? 36 : 44 }}>
                <div className="tabs-l">
                    <Tabs
                        activeKey={null}
                        tabBarGutter={10}
                        size="small"
                        items={tabsList}
                    />
                </div>
                <div className="tabs-r">
                    <Dropdown
                        menu={{
                            items: [
                                {
                                    key: '1',
                                    label: <span>关闭左侧</span>,
                                    icon: <ArrowLeftOutlined className="tabs-r-icon" />,
                                    onClick: () => closePages('left'),
                                },
                                {
                                    key: '2',
                                    label: <span>关闭右侧</span>,
                                    icon: <ArrowRightOutlined className="tabs-r-icon" />,
                                    onClick: () => closePages('right'),
                                },
                                {
                                    key: '3',
                                    label: <span>关闭其它</span>,
                                    icon: <CloseCircleOutlined className="tabs-r-icon" />,
                                    onClick: () => closePages('other'),
                                },
                                {
                                    key: '4',
                                    label: <span>全部关闭</span>,
                                    icon: <CloseCircleFilled className="tabs-r-icon" />,
                                    onClick: () => closePages('all'),
                                }
                            ]
                        }}
                    >
                        <div className="span">
                            <Button className="btn" size="small" icon={<DownOutlined style={{ fontSize: '12px' }} />}></Button>
                        </div>
                    </Dropdown>
                </div>
            </Header>
        </>
    );
};
