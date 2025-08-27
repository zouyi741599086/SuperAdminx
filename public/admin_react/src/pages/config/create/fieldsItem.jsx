import { Button, Card } from 'antd';
import {
    BetaSchemaForm,
} from '@ant-design/pro-components';
import { deepClone } from '@/common/function';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import CreateGroupItem from './createGroupItem';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import { restrictToParentElement } from "@dnd-kit/modifiers";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy, // 排序碰撞算法，有水平、垂直等
} from '@dnd-kit/sortable';

const FieldsItem = ({ data, delFields, setUpdateData, createFields, fields, setFields }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: data.id });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        marginBottom: '12px',
        cursor: 'pointer'
    };

    /////////////////////////子组件拖拽排序//////////////////////////
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
            // 先找是哪个组件的二级组件在排序
            let tmpIndex;
            fields.some((item, index) => {
                if (item.valueType == 'group' || item.valueType == 'formList') {
                    return item.columns.some((_item, _index) => {
                        if (_item.id == active.id) {
                            tmpIndex = index;
                            return true;
                        }
                    })
                }
                return false;
            })

            let _fields = [...fields];
            _fields[tmpIndex].columns = (() => {
                const oldIndex = _fields[tmpIndex].columns.findIndex((i) => i.id === active.id);
                const newIndex = _fields[tmpIndex].columns.findIndex((i) => i.id === over?.id);
                return arrayMove(_fields[tmpIndex].columns, oldIndex, newIndex);
            })();
            setFields(_fields);
        }
    }

    return <>
        <Card
            title={`${data.valueTypeTitle} ${data.valueType != 'group' && data.valueType != 'formList' ? data.name : ''}`}
            size="small"
            style={style}
            className={isDragging ? 'dragon' : ''}
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            extra={<>
                <Button
                    size="small"
                    type="link"
                    onClick={() => {
                        setUpdateData(data);
                    }}
                >设置</Button>
                <Button
                    size="small"
                    type="link"
                    danger
                    onClick={() => {
                        delFields(data.id)
                    }}
                >删除</Button>
            </>}
        >
            {/* 分组，则复用组件本身循环展示 分组下面的字段 */}
            {data.valueType == 'group' ? <>
                <div><b>{data.title}</b></div><br />
                {data.columns?.length > 0 ? <>
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={data?.columns?.map(i => i.id)}
                            strategy={verticalListSortingStrategy}
                            modifiers={[restrictToParentElement]}
                        >
                            {data?.columns?.map(item =>
                                <FieldsItem
                                    key={item.id}
                                    data={item}
                                    delFields={delFields}
                                    setUpdateData={setUpdateData}
                                    createFields={createFields}
                                />
                            )}
                        </SortableContext>
                    </DndContext>
                </> : ''}

                <CreateGroupItem
                    createFields={createFields}
                    data={data}
                />
            </> : ''}

            {/* 列表，则复用组件本身循环展示 列表下面的字段 */}
            {data.valueType == 'formList' ? <>
                <div><b>{data.title}</b></div><br />
                {data?.columns?.[0]?.columns?.length > 0 ? <>
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={data?.columns?.[0]?.columns?.map(i => i.id)}
                            strategy={verticalListSortingStrategy}
                            modifiers={[restrictToParentElement]}
                        >
                            {data?.columns?.[0]?.columns?.map(item =>
                                <FieldsItem
                                    key={item.id}
                                    data={item}
                                    delFields={delFields}
                                    setUpdateData={setUpdateData}
                                    createFields={createFields}
                                />
                            )}
                        </SortableContext>
                    </DndContext>
                </> : ''}

                <CreateGroupItem
                    createFields={createFields}
                    data={data}
                />
                <br />
            </> : ''}

            {['group', 'fromList'].indexOf(data.valueType) == -1 ? <>
                <BetaSchemaForm
                    shouldUpdate={true}
                    columns={[deepClone(data)]}
                    submitter={false}
                />
            </> : ''}
        </Card>
    </>
}

export default FieldsItem;