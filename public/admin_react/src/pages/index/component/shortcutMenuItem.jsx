import { useState } from 'react'
import { Card } from 'antd';
import { useRecoilState } from 'recoil';
import { menuAuthStore } from '@/store/menuAuth';
import { useNavigate } from 'react-router-dom';
import './shortcutMenu.css'
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

/**
 * 快捷菜单
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 */
export default ({ item, ...props }) => {
    const [menuAuth] = useRecoilState(menuAuthStore);
    const navigate = useNavigate();

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: item.id });

    const style = {
        width: 80,
        textAlign: 'center',
        transform: CSS.Transform.toString(transform),
        //transition,
    };

    // 跳转url
    const toUrl = (name) => {
        // 找出菜单进行跳转
        menuAuth.menuArr.some(item => {
            if (item.name === name) {
                // 外部链接
                if (item.type === 3) {
                    return window.open(item.url, '_blank', '');
                }
                navigate(item.path);
                return true;
            }
        })
    }
    // 控制样式类名
    const classBgName = `menu-card-item-bg` + item.id % 20;

    return <>
        <Card
            hoverable={true}
            size="small"
            style={style}
            className={isDragging ? `dragon ${classBgName}` : classBgName}
            onClick={() => {
                toUrl(item.name);
            }}
            ref={setNodeRef}
            {...attributes}
            {...listeners}
        >
            <div>
                <span className={`iconfont ${item.icon}`}></span>
                <div className="menu-title">{item.title}</div>
            </div>
        </Card>
    </>
}
