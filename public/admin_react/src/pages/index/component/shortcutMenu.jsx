import { useState } from 'react'
import { ProCard } from '@ant-design/pro-components';
import UpdateShortcutMenu from './updateShortcutMenu';
import { useMount } from 'ahooks';
import { adminUserShortcutMenuApi } from '@/api/adminUserShortcutMenu';
import ShortcutMenuItem from './shortcutMenuItem';
import './shortcutMenu.css'
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
    rectSortingStrategy, // 排序碰撞算法，有水平、垂直等
} from '@dnd-kit/sortable';

/**
 * 快捷菜单
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 */
export default () => {

    // 我的快捷菜单
    const [menuList, setMenuList] = useState([]);
    useMount(() => {
        getMenuList();
    })

    // 获取我选中的菜单
    const getMenuList = () => {
        adminUserShortcutMenuApi.getList().then(result => {
            if (result.code === 1) {
                setMenuList(result.data.map(item => item.AdminMenu));
            } else {
                message.error(result.message);
            }
        });
    }

    // 保存排序
    const updateSort = (values) => {
        const formData = values.map((item, index) => {
            return {
                admin_menu_id: item.id,
                sort: values.length - index
            }
        })
        adminUserShortcutMenuApi.updateSort({
            ...formData
        }).then(result => {
            if (result.code === 1) {

            } else {
                message.error(result.message);
            }
        });
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
            let _menuList = (() => {
                const oldIndex = menuList.findIndex((i) => i.id === active.id);
                const newIndex = menuList.findIndex((i) => i.id === over?.id);
                return arrayMove(menuList, oldIndex, newIndex);
            })();
            setMenuList(_menuList);
            updateSort(_menuList)
        }
    }

    return <>
        <ProCard
            title="快捷菜单"
            subTitle={menuList.length > 0 ? '可拖动自定义排序' : ''}
            className="admin-user-shortcut-menu-card"
        >
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={menuList.map(i => i.id)}
                    strategy={rectSortingStrategy}
                    modifiers={[restrictToParentElement]}
                >
                    {menuList.map(item =>
                        <ShortcutMenuItem
                            item={item}
                        />
                    )}
                </SortableContext>
            </DndContext>
            <UpdateShortcutMenu
                getMenuList={getMenuList}
            />
        </ProCard>
    </>
}
