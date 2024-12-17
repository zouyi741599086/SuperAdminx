import { useState } from 'react';
import { Card, Button, Upload, App, Image, Typography } from 'antd';
import {
    EyeOutlined,
    DeleteOutlined,
    PlusOutlined,
    LoadingOutlined,
} from '@ant-design/icons';
import { config } from '@/common/config';
import { getToken } from '@/common/function';
import ImgCrop from 'antd-img-crop';
import { fileApi } from '@/api/file';
import './index.css';

/**
 * 上传图片、mini型的
 * @param {String} value 默认值
 * @param {fun} onChange 修改value事件
 * @param {Number} width 图片裁剪宽度
 * @param {Number} height 图片裁剪高度
 * @param {Boolean} disabled 是否禁用
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 */
export default ({ value, onChange, width = 0, height = 0, disabled = false }) => {
    const { message } = App.useApp();

    /////////////////////图片上传修改后////////////////////
    const [uploadLoading, setUploadLoading] = useState(false);
    const imgChange = info => {
        if (info.file.status === 'uploading') {
            setUploadLoading(true);
        }
        if (info.file.status === 'error') {
            message.error('上传出错~')
            setUploadLoading(false);
        }
        if (info.file.status === 'done') {
            if (info.file.response.code === 1) {
                onChange(info.file.response.data.img);
            } else {
                message.error('上传出错~')
            }
            setUploadLoading(false);
        }
    }

    /////////////////////////删除图片//////////////////
    const remove = () => {
        onChange('');
    }

    /////////////////////////预览图片开关/////////////
    const [previewVisible, setPreviewVisible] = useState(false);
    const previewVisibleChange = () => {
        setPreviewVisible(!previewVisible);
    }

    /////////////////////////上传前验证////////////////////
    const beforeUpload = file => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('只能上传图片~');
            setUploadLoading(false);
            return false;
        }
        if (file.size / 1024 / 1024 > config.uploadImgMax) {
            message.error(`图片太大，请控制在 ${config.uploadImgMax}M 以内~`);
            setUploadLoading(false);
            return false;
        }
    };

    return (
        <>
            {value ? <>
                <Card
                    className="uploaddan-img-mini"
                    size="small"
                    styles={{
                        body: { padding: 2 }
                    }}
                >
                    <div className="bg">
                        <Image
                            src={`${value}`}
                            width='100%'
                            height='100%'
                            preview={{
                                visible: previewVisible,
                                onVisibleChange: previewVisibleChange,
                            }}
                        />
                        <div className="hover">
                            <div>
                                <Button type="text" size="small" onClick={previewVisibleChange}>
                                    <EyeOutlined className="icon" />
                                </Button>
                                <Button type="text" size="small" onClick={remove}>
                                    <DeleteOutlined className="icon" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </Card>
            </> : <>
                <ImgCrop
                    rotationSlider
                    quality={1}
                    fillColor="rgba(0,0,0,0)"
                    cropShape="rect" /*round*/
                    aspect={() => {
                        return width / height
                    }}
                    beforeCrop={() => {
                        //有宽高就不裁剪图片
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
                        showUploadList={false}
                        action={fileApi.uploadUrl}
                        headers={{
                            token: getToken()
                        }}
                        disabled={disabled}
                        className="uploadimgmini"
                        data={{
                            width,
                            height
                        }}
                        onChange={imgChange}
                        beforeUpload={beforeUpload}
                    >
                        <div>
                            {uploadLoading ? <LoadingOutlined /> : <PlusOutlined />}
                            <div className="ant-upload-text">上传</div>
                        </div>
                    </Upload>
                </ImgCrop>
            </>}
        </>
    )
}
