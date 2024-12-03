import { useState, useEffect } from 'react';
import { Image, Typography } from 'antd';
import Item from './item';
import Create from './create';

import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    rectSortingStrategy, // 排序碰撞算法，有水平、垂直等
} from '@dnd-kit/sortable';

/**
 * 列表，每个元素是图片+姓名组成，类似于团队、演员
 * @param {Array} value 默认值
 * @param {fun} onChange 修改value事件
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 */
export default ({ value, onChange }) => {
    const [list, setList] = useState([]);

    // 父组件的value不等于本组件的value的时候，就更新本组价的value
    useEffect(() => {
        if (list !== value) {
            setList(value || []);
        }
    }, [value])

    //////////////////添加////////////////
    const handleCreate = (data) => {
        let _list = [...list];
        _list.push(data);
        setList(_list);
        onChange(_list)
    }

    /////////////////////删除某个///////////////
    // 图片删除的时候
    const remove = (data) => {
        let _list = [...list];
        _list.map((item, key) => {
            if (item === data) {
                _list.splice(key, 1);
                return false;
            }
        })
        setList(_list);
        onChange(_list)
    }

    /////////////////////////预览图片/////////////////////////
    // 预览图片开关
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewCurrent, setPreviewCurrent] = useState(0);
    const previewVisibleChange = () => {
        setPreviewVisible(!previewVisible);
    }
    // 图片预览的时候
    const preview = (data) => {
        list.some((item, key) => {
            if (item === data) {
                setPreviewCurrent(key);
                return true;
            }
        })
        previewVisibleChange();
    }

    /////////////////////////拖拽排序//////////////////////////
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            }
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),

    );
    // 拖拽结束后
    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (active.id !== over?.id) {
            const oldIndex = list.findIndex((i) => i.img === active.id);
            const newIndex = list.findIndex((i) => i.img === over?.id);
            const _list = arrayMove(list, oldIndex, newIndex);
            setList(_list);
            onChange(_list)
        }
    }

    return (
        <>
            <div style={{ width: '100%', overflow: 'hidden' }}>
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={list.map(i => {
                            return i.img
                        })}
                        strategy={rectSortingStrategy}
                    >
                        {list.map(data =>
                            <Item
                                data={data}
                                preview={preview}
                                remove={remove}
                                key={data.img}
                            />
                        )}
                    </SortableContext>
                </DndContext>
                <Create handleCreate={handleCreate} />
            </div>
            <Typography.Text type="secondary">添加后的数据可拖动排序~</Typography.Text>

            <div style={{ display: 'none' }}>
                <Image.PreviewGroup
                    preview={{
                        visible: previewVisible,
                        onVisibleChange: previewVisibleChange,
                        current: previewCurrent,
                        onChange: (current) => {
                            setPreviewCurrent(current);
                        }
                    }}
                >
                    {list.map((_item) => <Image src={_item.img} key={_item.img} />)}
                </Image.PreviewGroup>
            </div>
        </>
    )
}
