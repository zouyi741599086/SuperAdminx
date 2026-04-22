import { useState, lazy, useRef } from 'react';
import { App, Button, Space, Calendar, Tooltip, Badge } from 'antd';
import { ProCard } from '@ant-design/pro-components';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import Lazyload from '@/component/lazyLoad/index';
import { adminTodoApi } from '@/api/adminTodo';
import { useMount } from 'ahooks';

const Create = lazy(() => import('./create/index'));
const List = lazy(() => import('./list/index'));

const Todo = () => {
    const { message } = App.useApp();
    const [monthCount, setMonthCount] = useState(0);
    const listRef = useRef();

    useMount(() => {
        getMonthCount();
    })

    // 获取当前月的待办事项总数
    const getMonthCount = (start_date = null, end_date = null) => {
        adminTodoApi.getMonthCount({ start_date, end_date }).then(result => {
            if (result.code === 1) {
                setMonthCount(result.data);
            } else {
                message.error(result.message);
            }
        })
    }
    // 当前日期变化的时候
    const handleDateChange = (date, { source }) => {
        // 切换月份也会触发，所以这只要点击日期的时候才触发打开
        if (source === 'date') {
            listRef.current?.open?.(date.format('YYYY-MM-DD'));
        }
    };

    // 切换月份的时候获取当前月的待办事项总数
    const onPanelChange = (date, mode) => {
        if (mode === 'month') {
            const start = date.clone().startOf('month');
            const end = date.clone().endOf('month');
            getMonthCount(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));
        }
    };

    // 自定义日期单元格渲染，使用 Badge 展示待办数量或已办数量
    const cellRender = (date) => {
        date = date.format('YYYY-MM-DD');
        if (monthCount[date]) {
            if (monthCount[date].todo > 0) {
                return <Badge
                    count={monthCount[date].todo}
                    color="error"
                    style={{
                        position: 'relative',
                        top: -2
                    }}
                />;
            }
            if (monthCount[date].done > 0) {
                return <Badge
                    count={monthCount[date].done}
                    color="green"
                    style={{
                        position: 'relative',
                        top: -2
                    }}
                />;
            }
        }
    };

    // 自定义日历头部：左侧显示当前年月+待办事项文字，右侧显示“添加”按钮和上下月切换按钮
    const renderHeader = ({ value, onChange }) => {
        const goPrevMonth = () => {
            const newValue = value.subtract(1, 'month');
            onChange(newValue);
        };

        const goNextMonth = () => {
            const newValue = value.add(1, 'month');
            onChange(newValue);
        };

        return (
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0px 0px 12px',
                }}
            >
                <div style={{ fontSize: '16px', fontWeight: 500 }}>
                    <b>{value.format('YYYY年MM月')}</b>-待办事项
                </div>
                <div>
                    <Space>
                        <Lazyload block={false}>
                            <Create
                                tableReload={() => getMonthCount()}
                            />
                        </Lazyload>
                        <Tooltip title="上一月">
                            <Button shape="circle" size="small" onClick={goPrevMonth} icon={<LeftOutlined />} />
                        </Tooltip>
                        <Tooltip title="下一月">
                            <Button shape="circle" size="small" onClick={goNextMonth} icon={<RightOutlined />} />
                        </Tooltip>
                    </Space>
                </div>
            </div>
        );
    };

    return (
        <>
            <Lazyload block={false}>
                <List
                    ref={listRef}
                    tableReload={() => getMonthCount()}
                />
            </Lazyload>
            <ProCard variant="borderless">
                <Calendar
                    fullscreen={false}
                    headerRender={renderHeader}
                    cellRender={cellRender}
                    onSelect={handleDateChange}
                    onPanelChange={onPanelChange}
                />
            </ProCard>
        </>
    );
};

export default Todo;