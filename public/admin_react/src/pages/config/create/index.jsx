import { useRef, useState, lazy } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { configApi } from '@/api/config';
import { App, Space, Button, Alert, Divider } from 'antd';
import { useNavigate } from "react-router-dom";
import {
    ProCard,
} from '@ant-design/pro-components';
import fieldsData from './fields-data';
import FieldsItem from './fieldsItem';
import FormSubmit from './formSubmit';
import FieldsItemSetting from './fieldsItemSetting';
import { useSearchParams } from "react-router-dom";
import { useMount } from 'ahooks';
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

const ProConfigProvider = lazy(() => import('@/component/form/proConfigProvider/index'));

/**
 * 添加修改参数设置 共用一个页面
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 */
export default () => {
    const formRef = useRef();
    const navigate = useNavigate();
    const { message } = App.useApp();
    const [search] = useSearchParams();

    // 修改的时候
    const [id, setId] = useState(0);
    const [type, setType] = useState('');
    useMount(() => {
        let id = search.get('id');
        setType(search.get('type'));
        if (id) {
            setId(id);
            configApi.findData({ id }).then(res => {
                if (res.code === 1) {
                    setFields(res.data.type === 'form' ? res.data.fields_config : res.data.fields_config[0].columns);
                    formRef?.current?.setFieldsValue(res.data);
                } else {
                    message.error(res.message)
                    onBack();
                }
            })
        }
    })

    ////////////////返回上一页//////////////////
    const onBack = () => {
        navigate('/config');
    }

    /////////////////////已选择的组件///////////////
    const [fields, setFields] = useState([]);

    /**
     * 添加表单组件
     * @param {object} data  添加的表单组件
     * @param {int} id 有就代表添加在某个分组下的表单组件
     */
    const createFields = (data, id = null) => {
        let _fields = [...fields];
        let tmp = {
            id: Date.now(),
            dataIndex: Date.now(),
            ...data,
            title: '',
            // 设置的form参数
            updateFields: {},

        };

        // 非分组、列表的时候
        if (['group', 'fromList'].indexOf(data.valueType) == -1) {
            tmp = {
                ...tmp,
                name: '',
                // formItem的属性
                formItemProps: {
                    rules: [],
                    style: { width: '100%' }
                },
                // formItem里面字段的属性
                fieldProps: {
                    style: { width: '100%' }
                },
                // 列表组件才有的
                fields: [],
            }
        }
        // 分组的时候加入分组的字段
        if (data.valueType == 'group') {
            tmp = {
                ...tmp,
                columns: [],
            }
        }
        // 列表的时候加入列表的字段
        if (data.valueType == 'formList') {
            tmp = {
                ...tmp,
                name: '',
                columns: [
                    {
                        valueType: 'group', // 列表内要多用group包一层，这样展示的时候才能每行展示多个item
                        colProps: {
                            xs: 24,
                            sm: 24,
                        },
                        columns: [],
                    }
                ],
            }
        }
        // 这些字段占用一行
        if (['uploadImgAll', 'uploadImgVideoAll', 'uploadFileAll', 'teditor', 'group', 'formList'].indexOf(data.valueType) > -1) {
            tmp = {
                ...tmp,
                // 独占一行
                colProps: {
                    xs: 24,
                    sm: 24,
                },
            }
        }
        // 有id 说明是子表单组件，如分组下面的组件
        if (id) {
            tmp = {
                ...tmp,
                pid: id,
            }
        }

        // 非子组件的时候
        if (!id) {
            _fields.push(tmp)
        }

        // 子组件的时候
        if (id) {
            const field = _fields.find(item => item.id == id);
            // 分组group子组件
            if (field.valueType == 'group') {
                _fields = _fields.map(item => {
                    if (item.id == id) {
                        item.columns.push(tmp)
                    }
                    return item;
                })
            }
            // 列表formList子组件
            if (field.valueType == 'formList') {
                _fields = _fields.map(item => {
                    if (item.id == id) {
                        item.columns[0].columns.push(tmp)
                    }
                    return item;
                })
            }
        }

        setFields(_fields);

        // 添加后立即弹窗设置字段
        setUpdateData(tmp);
    }
    // 删除组件
    const delFields = (id) => {
        let _fields = [...fields];

        // 删除的是哪个表单组件，判断是删除一级组件，还是分组这种二级组件
        let delLevelType; // 删除的类型，1》一级组件，2》分组group内的组件，2》列表formList内的组件
        let delOneIndex = false; // 删除的一级索引
        let delTwoIndex = false; // 删除的二级索引，如分组group下或列表formList下
        fields.map((item, index) => {
            if (item.id == id) {
                delLevelType = 1;
                delOneIndex = index;
            }
            if (item.valueType == 'group') {
                item.columns.some((_item, _index) => {
                    if (_item.id == id) {
                        delLevelType = 2;
                        delOneIndex = index;
                        delTwoIndex = _index;
                        return true;
                    }
                })
            }
            if (item.valueType == 'formList') {
                item.columns[0].columns.some((_item, _index) => {
                    if (_item.id == id) {
                        delLevelType = 3;
                        delOneIndex = index;
                        delTwoIndex = _index;
                        return true;
                    }
                })
            }
        })

        // 说明是删除
        switch (delLevelType) {
            // 删除的是一级字段
            case 1:
                _fields.splice(delOneIndex, 1);
                break;
            // 删除分组的组件
            case 2:
                _fields[delOneIndex].columns.splice(delTwoIndex, 1);
                break;
            // 删除列表的组件
            case 3:
                _fields[delOneIndex].columns[0].columns.splice(delTwoIndex, 1);
                break;
        }

        setFields(_fields);
    }
    // 设置组件
    const updateFields = (data) => {
        return new Promise((resolve) => {
            let _fields = [...fields];

            // 修改
            _fields = _fields.map(item => {
                if (item.id === data.id) {
                    item = { ...data };
                }
                // 如果是分组组件
                if (item.valueType == 'group') {
                    item.columns = item.columns.map(_item => {
                        if (_item.id === data.id) {
                            _item = { ...data };
                        }
                        return _item;
                    })
                }
                // 如果是列表组件
                if (item.valueType == 'formList') {
                    item.columns[0].columns = item.columns[0].columns.map(_item => {
                        if (_item.id === data.id) {
                            _item = { ...data };
                        }
                        return _item;
                    })
                }
                return item;
            })

            // 判断是否有重名的 字段name
            try {
                let nameArr = [];
                _fields.map(item => {
                    if (item.valueType != 'group') {
                        nameArr.push(item.name);
                    }
                    if (item.valueType == 'group') {
                        item.columns.map(_item => {
                            nameArr.push(_item.name);
                        })
                    }
                    if (item.valueType == 'formList') {
                        let _nameArr = [];
                        item.columns[0].columns.map(_item => {
                            _nameArr.push(_item.name);
                        })
                        if (new Set(_nameArr).size !== _nameArr.length) {
                            throw new Error('字段name名称重复');
                        }
                    }
                })
                if (new Set(nameArr).size !== nameArr.length) {
                    throw new Error('字段name名称重复');
                }
            } catch (error) {
                message.error(error.message);
                resolve(false);
                return;
            }

            setFields(_fields);
            resolve(true);
        });
    }
    // 当前修改的组件
    const [updateData, setUpdateData] = useState({});

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
            let _fields = (() => {
                const oldIndex = fields.findIndex((i) => i.id === active.id);
                const newIndex = fields.findIndex((i) => i.id === over?.id);
                return arrayMove(fields, oldIndex, newIndex);
            })();
            setFields(_fields);
        }
    }

    return (
        <>
            <FieldsItemSetting
                data={updateData}
                setUpdateData={setUpdateData}
                updateFields={updateFields}
                className="config-create-form"
            />
            <PageContainer
                ghost
                header={{
                    title: id ? `修改${type}配置` : `添加${type}配置`,
                    style: { padding: '0 24px 12px' },
                    onBack: onBack
                }}
            >
                <ProCard split="vertical">
                    <ProCard colSpan={{ xs: 24, sm: 6, md: 5 }}>
                        <FormSubmit
                            fields={fields}
                            setFields={setFields}
                            type={type}
                        />
                    </ProCard>

                    <ProCard colSpan={{ xs: 24, sm: 10, md: 12 }} style={{ height: '100%' }} bodyStyle={{ display: 'flex', flexDirection: 'column' }}>
                        <Alert message="点击右侧增加表单组件，组件可以拖拽排序~" type="warning" showIcon style={{ marginBottom: '24px' }} />

                        <ProConfigProvider>
                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragEnd={handleDragEnd}
                            >
                                <SortableContext
                                    items={fields.map(i => i.id)}
                                    strategy={verticalListSortingStrategy}
                                    modifiers={[restrictToParentElement]}
                                >
                                    {fields.map(item =>
                                        <FieldsItem
                                            key={item.id}
                                            data={item}
                                            delFields={delFields}
                                            setUpdateData={setUpdateData}
                                            createFields={createFields}
                                            fields={fields}
                                            setFields={setFields}
                                        />
                                    )}
                                </SortableContext>
                            </DndContext>
                        </ProConfigProvider>
                    </ProCard>

                    <ProCard title="表单组件" colSpan={{ xs: 24, sm: 8, md: 7 }}>
                        {fieldsData.map((item) => {
                            return (
                                <div key={item.title}>
                                    <Divider orientation="left" key={item.title}>{item.title}</Divider>
                                    <Space wrap>
                                        {item.children.map((_item, _index) => {
                                            return <Button
                                                type="dashed"
                                                key={_index}
                                                onClick={() => createFields(_item)}
                                            >{_item.valueTypeTitle}</Button>
                                        })}
                                    </Space>
                                </div>
                            )
                        })}
                    </ProCard>
                </ProCard>
            </PageContainer>
        </>
    )
}
