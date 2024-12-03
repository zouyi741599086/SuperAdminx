import {
    CheckOutlined,
    HolderOutlined
} from '@ant-design/icons';
import { Typography, Space, Tooltip, Drawer, Switch, Alert } from 'antd';
import { useBoolean } from 'ahooks';
import { useRecoilState } from 'recoil';
import { layoutSettingStore } from '@/store/layoutSetting';
import './index.css'

const { Text } = Typography;

/**
 * 后台布局设置 弹出框
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 */
export default ({ placement = 'top' }) => {
    const [open, { toggle: toggleOpen }] = useBoolean(false);
    const [layoutSetting, setLayoutSetting] = useRecoilState(layoutSettingStore);

    //////////////////主题////////////////////////////////
    const antdThemeList = {
        default: {
            img: new URL('@/static/default/default.png', import.meta.url).href,
            tip: '默认风格',
        },
        dark: {
            img: new URL('@/static/default/dark.png', import.meta.url).href,
            tip: '黑色风格',
        },
        compact: {
            img: new URL('@/static/default/compact.png', import.meta.url).href,
            tip: '紧凑风格',
        },
    };
    // 布局切换的时候
    const antdThemeValueChange = antdThemeValue => {
        setLayoutSetting(_val => {
            return {
                ..._val,
                antdThemeValue,
            }
        })
    }

    //////////////////布局////////////////////////////////
    const layoutList = {
        slide: {
            img: new URL('@/static/default/slide.png', import.meta.url).href,
            tip: '侧边菜单布局',
        },
        slideSplitMenus: {
            img: new URL('@/static/default/slideSplitMenus.png', import.meta.url).href,
            tip: '侧边分割菜单布局',
        },
        left: {
            img: new URL('@/static/default/left.png', import.meta.url).href,
            tip: '侧边菜单布局',
        },
        top: {
            img: new URL('@/static/default/top.png', import.meta.url).href,
            tip: '顶部菜单布局',
        },
        topSplitMenus: {
            img: new URL('@/static/default/topSplitMenus.png', import.meta.url).href,
            tip: '顶部混合布局',
        },
    };
    // 布局切换的时候
    const layoutListValueChange = layoutValue => {
        setLayoutSetting(_val => {
            return {
                ..._val,
                layoutValue,
            }
        })
    }

    ////////////////////主题色/////////////////////
    const primaryColorList = [
        '#1677ff',
        '#f5222d',
        '#13c2c2',
        '#fa541c',
        '#faad14',
        '#52c41a',
        '#2f54eb',
        '#722ed1',
        "#cb00bf"
    ];
    // 主题色改变的时候
    const primaryColorValueChange = primaryColorValue => {
        setLayoutSetting(_val => {
            return {
                ..._val,
                primaryColorValue,
            }
        })
    }

    /////////////////////色弱模式开关/////////////////////
    const bodyFilterValueChange = (bodyFilterValue) => {
        setLayoutSetting(_val => {
            return {
                ..._val,
                bodyFilterValue,
            }
        })
    }

    /////////////////////简约风格开关/////////////////////
    const themeSimpleChange = (themeSimple) => {
        setLayoutSetting(_val => {
            return {
                ..._val,
                themeSimple,
            }
        })
    }

    /////////////////////圆角开关/////////////////////
    const isRadiusChange = (isRadius) => {
        setLayoutSetting(_val => {
            return {
                ..._val,
                isRadius,
            }
        })
    }

    /////////////////////页面定宽/////////////////////
    const isWidthChange = (isWidth) => {
        setLayoutSetting(_val => {
            return {
                ..._val,
                isWidth,
            }
        })
    }

    return (
        <>
            <div className='item'>
                <Tooltip title="主题设置" placement={placement}>
                    <span className='circle' onClick={toggleOpen}>
                        <HolderOutlined className='icon' />
                    </span>
                </Tooltip>
            </div>
            <Drawer
                title="主题设置"
                placement="right"
                width={300}
                onClose={toggleOpen}
                open={open}
            >
                <Space direction="vertical" size='large'>
                    <Alert message="设置只保存在浏览器中，当更换浏览器后所有设置都将失效恢复到默认~" type="warning" />
                    <div>
                        <Text>整体风格</Text>
                        <ul className="theme-set-ul">
                            {
                                Object.keys(antdThemeList).map(key => {
                                    return (
                                        <Tooltip key={key} title={antdThemeList[key].tip}>
                                            <li onClick={() => antdThemeValueChange(key)} >
                                                <img src={antdThemeList[key].img} />
                                                {layoutSetting.antdThemeValue === key ? (
                                                    <span className="on">
                                                        <CheckOutlined style={{ color: layoutSetting.antdThemeValue === 'dark' ? '#fff' : '#333' }} />
                                                    </span>
                                                ) : ''}
                                            </li>
                                        </Tooltip >
                                    )
                                })
                            }
                        </ul>
                    </div>

                    <div>
                        <Text>导航布局</Text>
                        <ul className="theme-set-ul">
                            {
                                Object.keys(layoutList).map(key => {
                                    return (
                                        <Tooltip key={key} title={layoutList[key].tip}>
                                            <li onClick={() => layoutListValueChange(key)} >
                                                <img src={layoutList[key].img} />
                                                {layoutSetting.layoutValue === key ? (
                                                    <span className="on">
                                                        <CheckOutlined style={{ color: '#333' }} />
                                                    </span>
                                                ) : ''}
                                            </li>
                                        </Tooltip >
                                    )
                                })
                            }
                        </ul>
                    </div>

                    <div>
                        <Text>主题色</Text>
                        <ul className="theme-set-ul">
                            {primaryColorList.map(item => {
                                return (
                                    <li key={item} onClick={() => primaryColorValueChange(item)} >
                                        <div
                                            className="c"
                                            style={{ background: item }}
                                        >
                                            {layoutSetting.primaryColorValue === item ? (
                                                <span className="on">
                                                    <CheckOutlined style={{ color: '#fff' }} />
                                                </span>
                                            ) : ''}
                                        </div>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>

                    <ul className="theme-set-flex">
                        <li>
                            <span className='txt'><Text>简约风格</Text></span>
                            <div className="cont wauto">
                                <Switch checked={layoutSetting.themeSimple} onChange={themeSimpleChange} />
                            </div>
                        </li>
                        <li>
                            <span className='txt'><Text>圆角（导航/顶部）</Text></span>
                            <div className="cont wauto">
                                <Switch checked={layoutSetting.isRadius} onChange={isRadiusChange} />
                            </div>
                        </li>
                        <li>
                            <span className='txt'><Text>色弱模式</Text></span>
                            <div className="cont wauto">
                                <Switch checked={layoutSetting.bodyFilterValue} onChange={bodyFilterValueChange} />
                            </div>
                        </li>
                        <li>
                            <span className="txt"><Text>页面固定宽度</Text></span>
                            <div className="cont wauto">
                                <Switch checked={layoutSetting.isWidth} onChange={isWidthChange} />
                            </div>
                        </li>
                    </ul>
                </Space>
            </Drawer>
        </>
    );
};
