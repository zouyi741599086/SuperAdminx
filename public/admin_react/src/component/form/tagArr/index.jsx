import React, { useEffect, useRef, useState } from 'react';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { App, Input, Space, Tag } from 'antd';
import { useDynamicList } from 'ahooks';

/**
 * 列表tag输入
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 */
export default ({ value = [], onChange, ...props }) => {

    const { message } = App.useApp();

    const { list, remove, push, resetList, replace } = useDynamicList(value);

    useEffect(() => {
        if (value != list) {
            resetList(value);
        }
    }, [value])

    useEffect(() => {
        onChange?.(list)
    }, [list])

    // 添加的时候
    const addInputRef = useRef();
    const [addVisible, setAddVisible] = useState(false);
    const [addValue, setAddValue] = useState('');

    // 修改的时候
    const editInputRef = useRef();
    const [editIndex, setEditIndex] = useState(null);
    const [editValue, setEditValue] = useState('');


    ///////////////////添加///////////////////////
    // 开始添加标签
    const handAddVisible = () => {
        setAddVisible(true);
    }
    useEffect(() => {
        addInputRef.current?.focus();
    }, [addVisible]);
    // 输入框值改变的时候
    const handleAddInputChange = (e) => {
        setAddValue(e.target.value);
    };
    // 添加提交的时候
    const handleAddSubmit = () => {
        const title = addValue.replace(/^\s+|\s+$/g, "");
        if (!title) {
            setAddVisible(false);
            return false;
        }
        // 判断list中是否已经有这个value
        if (!list.some(item => item == title)) {
            push(title)
            setAddValue('');
            // 添加后继续添加
            setTimeout(() => {
                addInputRef.current?.focus();
            }, 300);
        } else {
            message.error('此值已存在~');
            setAddValue('');
            setAddVisible(false);
        }
    }

    ///////////////////修改////////////////////////
    // 开始修改标签
    const handleEditVisibleChange = (index, title) => {
        setEditIndex(index);
        setEditValue(title);
    }
    useEffect(() => {
        editInputRef.current?.focus();
    }, [editIndex]);
    // 输入框值改变的时候
    const handleEditInputChange = (e) => {
        setEditValue(e.target.value);
    };
    // 提交修改的标签
    const handleEditSubmit = () => {
        const title = editValue.replace(/^\s+|\s+$/g, "");;
        if (!title) {
            setEditIndex(null);
            return false;
        }
        // 判断是否修改了的
        if (list.some((item, index) => index === editIndex && item != title)) {
            replace(editIndex, title);
            setEditIndex(null);
        } else {
            setEditIndex(null);
        }
    }

    const tagInputStyle = {
        width: 78,
        height: 22,
        marginInlineEnd: 8,
        verticalAlign: 'top',
    };
    return (
        <Space size={[0, 8]} wrap>
            {list.map((item, index) => {
                { item }
                if (editIndex === index) {
                    return (
                        <Input
                            ref={editInputRef}
                            key={index}
                            size="small"
                            style={tagInputStyle}
                            value={editValue}
                            onChange={handleEditInputChange}
                            onBlur={handleEditSubmit}
                            onPressEnter={handleEditSubmit}
                        />
                    );
                }
                return (
                    <Tag
                        key={index}
                        closeIcon={
                            <DeleteOutlined style={{ fontSize: '14px', color: '#cf1322' }} onClick={() => remove(index)} />
                        }
                        onClose={(e) => e.preventDefault()}
                    >
                        <span
                            style={{ padding: '0px 5px' }}
                            onClick={(e) => {
                                handleEditVisibleChange(index, item);
                                e.preventDefault();
                            }}
                        >
                            {item}
                        </span>
                    </Tag>
                )

            })}
            {addVisible ? (
                <Input
                    ref={addInputRef}
                    type="text"
                    size="small"
                    style={tagInputStyle}
                    value={addValue}
                    onChange={handleAddInputChange}
                    onBlur={handleAddSubmit}
                    onPressEnter={handleAddSubmit}
                />
            ) : (
                <Tag
                    style={{ background: '#fff', borderStyle: 'dashed' }}
                    icon={<PlusOutlined />}
                    onClick={handAddVisible}
                >
                    添加
                </Tag>
            )}
        </Space>
    );
};