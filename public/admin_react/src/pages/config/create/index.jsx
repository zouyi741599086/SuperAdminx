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
    // 添加组件
    const createFields = (data) => {
        let _fields = [...fields];
        let tmp = {
            id: Date.now(),
            dataIndex: Date.now(),
            ...data,
            name: '',
            title: '',
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
            // 设置的form参数
            updateFields: {},
        }
        _fields.push(tmp)
        setFields(_fields);

        // 添加后立即弹窗设置字段
        setUpdateData(tmp);
    }
    // 删除组件
    const delFields = (id) => {
        let _fields = [...fields];
        _fields.splice(_fields.findIndex(i => i.id === id), 1);
        setFields(_fields);
    }
    // 设置组件
    const updateFields = (data) => {
        return new Promise((resolve) => {
            let _fields = [...fields];
            // 判断字段名是否重复
            let _boolean = _fields.some(_item => {
                let tmp = data.id != _item.id && _item.dataIndex === data.dataIndex
                if (_item.id === data.id) {
                    _item = { ...data };
                }
                return tmp;
            })
            if (_boolean) {
                message.error('字段name名称重复~');
                resolve(false);
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
                        <FormSubmit fields={fields} setFields={setFields} type={type} />
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
                                            return <Button type="dashed" key={_index} onClick={() => createFields(_item)}>{_item.valueTypeTitle}</Button>
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
