import { lazy, useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import Lazyload from '@/component/lazyLoad/index';

const List = lazy(() => import('./list'));
const Chart = lazy(() => import('./chart'));

/**
 * 用户日统计 
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
export default () => {

    /////////////////////顶部切换/////////////////
    const [topKey, setTopKey] = useState("1");
    const topList = [
        {
            key: "1",
            label: '图表',
        },
        {
            key: "2",
            label: '明细',
        },
    ];

    return (
        <>
            <PageContainer
                className="sa-page-container"
                ghost
                header={{
                    title: '用户月统计',
                    style: { padding: '0px 24px 0px' },
                }}
                tabList={topList}
                tabActiveKey={topKey}
                onTabChange={(key) => {
                    setTopKey(key);
                }}
            >
                <Lazyload>
                    {topKey == '1' ? <Chart /> : null}
                    {topKey == '2' ? <List /> : null}
                </Lazyload>
            </PageContainer>
        </>
    )
}
