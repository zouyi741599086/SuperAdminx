import { useState, useEffect } from 'react';
import { Button, Upload, App, Typography } from 'antd';
import {
    UploadOutlined,
} from '@ant-design/icons';
import { config } from '@/common/config';
import { getToken } from '@/common/function';
import { fileApi } from '@/api/file';
import { useMount } from 'ahooks';

/**
 * 上传多个附件
 * @param {String} value 默认值
 * @param {fun} onChange 修改value事件
 * @param {Array} accept 允许上传的文件后缀，如['docx','jpg']
 * @param {Number} maxCount 允许上的文件数量
 * @param {Boolean} aliyunOss 是否直接上传到阿里云oss，只有上传大文件才直接传oss
 * @param {String} disk 传到哪，public》本地，aliyun》阿里云，有时候需要强制传到本地，此参数跟aliyunOss不能同时出现即aliyunOss为true的时候次参数无效
 * @param {Int} maxSize 最大上传多少M的附件
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 */
export default ({ value = [], onChange, accept = [], maxCount = 10, aliyunOss = false, disk = '', maxSize = config.uploadFileMax }) => {
    const { message } = App.useApp();

    useMount(() => {
        if (aliyunOss) {
            getSignature();
        }
    })

    //////////////////获取直传阿里云oss的签名
    const [aliyunOssData, setAliyunOssData] = useState({});
    const getSignature = async () => {
        const res = await fileApi.getSignature();
        if (res.code === 1) {
            setAliyunOssData(res.data);
        } else {
            message.error(res.message)
        }
    }

    const [fileList, setFileList] = useState([]);
    useEffect(() => {
        // 将初始值设置上，只有组件值等于空的时候在赋值，防止编辑的时候无法赋值
        if (fileList.length === 0 && Array.isArray(value) && value?.length > 0) {
            let tmpValue = [];
            value.map((item, index) => {
                tmpValue.push({
                    uid: index + 1,
                    name: item.name,
                    status: 'done',
                    value_url: item.url,
                    url: `${item.url}`,
                    thumbUrl: `${item.url}`,
                })
            })
            setFileList(tmpValue)
        }
    }, [value])

    /////////////////////文件上传修改后////////////////////
    const uploadChange = info => {
        if (info.file.status === 'error') {
            message.error('上传出错~')
        }
        if (info.file.status === 'done') {
            // 如果不是上传阿里云oss
            if (!aliyunOss) {
                if (info.file.response.code === 1) {
                    info.fileList.map(item => {
                        if (item.uid === info.file.uid) {
                            item.value_url = item.response.data.file;
                            item.url = `${item.response.data.file}`;
                        }
                    })
                } else {
                    message.error('上传出错~')
                }
            }
            // 如果是上传阿里云oss
            if (aliyunOss) {
                info.fileList.map(item => {
                    if (item.uid === info.file.uid) {
                        let url = aliyunOssData.host + '/' + info.file.url;
                        item.value_url = url;
                        item.url = url;
                    }
                })
            }

        }
        setFileList(info.fileList);
    }

    /////////////////////////上传前验证////////////////////
    const beforeUpload = async (file) => {
        // 获取后缀
        let flieArr = file.name.split(".");
        let suffix = flieArr[flieArr.length - 1];

        if (accept.indexOf(suffix) === -1) {
            message.error('文件格式错误，不允许上传的文件类型~');
            return Upload.LIST_IGNORE;
        }
        if (file.size / 1024 / 1024 > maxSize) {
            message.error(`上传失败，文件大小请控制在 ${maxSize}M 以内`);
            return Upload.LIST_IGNORE;
        }

        /////如果是上传到阿里云oss/////
        if (aliyunOss) {
            const expire = Number(aliyunOssData.expire) * 1000;
            if (expire < Date.now()) {
                await getSignature();
            }
            file.url = aliyunOssData.dir + suffix + '/' + Date.now() + "." + suffix;;
            return file;
        }
    };

    ////////////////////////更新父组件的值/////////////
    useEffect(() => {
        let tmpValue = [];
        fileList.map(item => {
            if (item.status === 'done' && item.value_url) {
                tmpValue.push({
                    name: item.name,
                    url: item.value_url
                })
            }
        })
        onChange(tmpValue)
    }, [fileList])

    ////////////////////////允许上传的文件后缀/////////////////
    const [acceptValue, setAcceptValue] = useState([]);
    useEffect(() => {
        if (accept.length > 0) {
            let tmpAcceptValue = [];
            accept.map(item => {
                if (item) {
                    tmpAcceptValue.push(`.${item}`)
                }
            })
            setAcceptValue(tmpAcceptValue)
        }
    }, [accept])

    /////////////如果是上传到阿里云oss，则获取上传的参数
    const getExtraData = (file) => {
        return {
            key: file.url,
            OSSAccessKeyId: aliyunOssData?.accessid,
            policy: aliyunOssData?.policy,
            Signature: aliyunOssData?.signature,
            success_action_status: 200, // 让服务端返回200,不然，默认会返回204
            callback: aliyunOssData?.callback, // 上传成功后回调服务器的url
        };
    };

    const uploadProps = {
        accept: acceptValue,
        maxCount: maxCount,
        name: "file",
        listType: "picture",
        fileList: fileList,
        // 如果是上传到阿里云oss则地址不同
        action: aliyunOss ? aliyunOssData.host : fileApi.uploadUrl,
        // 如果是上传到阿里云oss则参数不同
        headers: aliyunOss ? {} : {
            token: getToken()
        },
        // 如果是上传到阿里云oss则参数不同
        data: aliyunOss ? getExtraData : { disk },
        multiple: true,
        onChange: uploadChange,
        beforeUpload: beforeUpload,
    };

    return (
        <>
            <Upload {...uploadProps}>
                {fileList.length < maxCount ? <Button icon={<UploadOutlined />}>选择文件</Button> : ''}
            </Upload>
            <div style={{ width: '100%' }}>
                <Typography.Text type="secondary">最多上传 {maxCount} 个文件，允许上传的文件类型：{acceptValue.join(',')}</Typography.Text>
            </div>
        </>
    )
}
