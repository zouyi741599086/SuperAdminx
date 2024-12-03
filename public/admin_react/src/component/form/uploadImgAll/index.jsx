import { useState, useEffect } from 'react';
import { Upload, App, Image, Typography } from 'antd';
import {
    PlusOutlined,
} from '@ant-design/icons';
import { config } from '@/common/config';
import { getToken } from '@/common/function';
import Item from './item';
import ImgCrop from 'antd-img-crop';
import { fileApi } from '@/api/file';

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
 * 上传多个图片
 * @param {Array} value 默认值
 * @param {fun} onChange 修改value事件
 * @param {Number} width 图片裁剪宽度
 * @param {Number} height 图片裁剪高度
 * @param {Number} maxCount 图片最多上传张数
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 */
export default ({ value = [], onChange, width = 0, height = 0, maxCount = 10 }) => {
    const { message } = App.useApp();

    const [fileList, setFileList] = useState([]);
    useEffect(() => {
        // 将初始值设置上，只有组件值等于空的时候在赋值，防止编辑的时候无法赋值
        if (valueLength === 0 && Array.isArray(value) && value?.length > 0) {
            let _fileList = [];
            value.map(item => {
                _fileList.push({
                    status: 'done',
                    url: `${item}`,
                    img: item,
                    uid: item,
                })
            })
            setValueLength(_fileList.length);
            setFileList(_fileList);
        }
    }, [value])

    // 预览图片开关
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewCurrent, setPreviewCurrent] = useState(0);
    const previewVisibleChange = () => {
        setPreviewVisible(!previewVisible);
    }

    // 图片上传的时候
    const uploadImg = info => {
        if (info.file.status === 'error') {
            message.error('上传出错~')
        }
        if (info.file.status === 'done') {
            if (info.file.response.code === 1) {
                // 上传成功后修改图片为正式的url
                info.fileList.some(item => {
                    if (item.uid === info.file.uid) {
                        item.url = `${info.file.response.data.img}`;
                        item.thumbUrl = `${info.file.response.data.img}`;
                        item.img = info.file.response.data.img;
                        return true;
                    }
                })
            } else {
                info.fileList = info.fileList.filter(item => item.uid !== info.file.uid)
                message.error(info.file.response.message);
            }
        }
        setFileList(info.fileList);
        if (info.file.status === 'done' && info.file.response.code === 1) {
            // 更新父组件的值
            modelValueLastChange(info.fileList);
        }
    }
    // 图片删除的时候
    const remove = (file) => {
        let _fileList = [...fileList];
        _fileList.map((item, key) => {
            if (item.img === file.img) {
                _fileList.splice(key, 1);
                return false;
            }
        })
        setFileList(_fileList);
        modelValueLastChange(_fileList);
        return false;
    }

    // 图片预览的时候
    const preview = (file) => {
        fileList.some((item, key) => {
            if (item.uid === file.uid) {
                setPreviewCurrent(key);
                return true;
            }
        })
        previewVisibleChange();
    }

    // 更新父组件的值
    const [valueLength, setValueLength] = useState(0);
    const modelValueLastChange = (_fileList) => {
        let tmpList = [];
        _fileList.map(item => {
            if (item.status === 'done') {
                tmpList.push(item.img)
            }
        })
        setValueLength(tmpList.length);
        onChange(tmpList);
    }

    const beforeUpload = file => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('只能上传图片~');
            return Upload.LIST_IGNORE;
        }
        if (file.size / 1024 / 1024 > config.uploadImgMax) {
            message.error(`图片大小请控制在 ${config.uploadImgMax}M 以内`);
            return Upload.LIST_IGNORE;
        }
        if (fileList.length >= maxCount) {
            return false;
        }
    };

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
            let _fileList = (() => {
                const oldIndex = fileList.findIndex((i) => i.img === active.id);
                const newIndex = fileList.findIndex((i) => i.img === over?.id);
                return arrayMove(fileList, oldIndex, newIndex);
            })();
            setFileList(_fileList);
            modelValueLastChange(_fileList);
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
                        items={fileList.map(i => i.img)}
                        strategy={rectSortingStrategy}
                        modifiers={[restrictToParentElement]}
                    >
                        {fileList.map(item =>
                            <Item
                                key={item.uid}
                                data={item}
                                preview={preview}
                                remove={remove}
                            />
                        )}
                    </SortableContext>
                </DndContext>

                <div style={{ width: 'auto', overflow: 'hidden', display: valueLength >= maxCount ? 'none' : 'inline-block' }}>
                    <ImgCrop
                        rotationSlider
                        quality={1}
                        fillColor="rgba(0,0,0,0)"
                        cropShape="rect" /*round*/
                        aspect={() => {
                            return width / height
                        }}
                        beforeCrop={() => {
                            // 有宽高就不裁剪图片
                            if (width <= 0 || height <= 0) {
                                return false;
                            }
                        }}
                    >
                        <Upload
                            accept="image/*"
                            capture={null}
                            name="img"
                            listType="picture-card"
                            action={fileApi.uploadUrl}
                            headers={{
                                token: getToken()
                            }}
                            data={{
                                width,
                                height
                            }}
                            onChange={uploadImg}
                            fileList={fileList}
                            maxCount={maxCount}
                            // 因为有裁剪组件，所以有宽高的情况下不能多选上传
                            multiple={(width > 0 && height > 0) ? false : true}
                            beforeUpload={beforeUpload}
                            showUploadList={false}
                        >
                            <div >
                                <PlusOutlined />
                                <div className="ant-upload-text">上传</div>
                            </div>
                        </Upload>
                    </ImgCrop>
                </div>
            </div>
            {/* <Alert message="上传后的图片可拖动排序~" type="info" showIcon={true} /> */}
            {width > 0 && height > 0 ? <>
                <Typography.Text type="secondary">请上传宽高：{width}*{height}的图片，最多可上传{maxCount}张图片，上传后的图片可拖动排序~</Typography.Text>
            </> : <>
                {width > 0 ? <>
                    <Typography.Text type="secondary">请上传宽为{width}px的图片，最多可上传{maxCount}张图片，上传后的图片可拖动排序~</Typography.Text>
                </> : <>
                    {height > 0 ? <>
                        <Typography.Text type="secondary">请上传高为{height}px的图片，最多可上传{maxCount}张图片，上传后的图片可拖动排序~</Typography.Text>
                    </> : <>
                        <Typography.Text type="secondary">最多可上传{maxCount}张图片，上传后的图片可拖动排序~</Typography.Text>
                    </>}
                </>}
            </>}
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
                    {fileList.map((_item) => _item.status === 'done' ? <Image src={_item.url} key={_item.url} /> : '')}
                </Image.PreviewGroup>
            </div>
        </>
    )
}
