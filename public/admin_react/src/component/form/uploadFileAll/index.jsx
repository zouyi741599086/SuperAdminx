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
 * @param {String} disk 传到哪，public》本地，aliyun》阿里云，qcloud》腾讯云
 * @param {Int} maxSize 最大上传多少M的附件
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 */
export default ({ value = [], onChange, accept = [], maxCount = 10, disk = 'public', maxSize = config.uploadFileMax }) => {
    const { message } = App.useApp();

    useMount(() => {
        if (disk == 'aliyun') {
            getSignature();
        }
        if (disk == 'qcloud') {
            getQcloudSignature(accept[0]);
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
    //////////////////获取直传腾讯云cos的签名等
    const [qcloudData, setQcloudData] = useState({});
    const getQcloudSignature = async (dir) => {
        const res = await fileApi.getQcloudSignature({ dir });
        if (res.code === 1) {
            setQcloudData(res.data);
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
            // 如果上传到本地
            if (disk == 'public') {
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
            // 如果上传到阿里云
            if (disk == 'aliyun') {
                info.fileList.map(item => {
                    if (item.uid === info.file.uid) {
                        let url = aliyunOssData.host + '/' + info.file.url;
                        item.value_url = url;
                        item.url = url;
                    }
                })
            }
            // 如果上传到腾讯云
            if (disk == 'qcloud') {
                info.fileList.map(item => {
                    if (item.uid === info.file.uid) {
                        let url = qcloudData.cosHost + '/' + info.file.url;
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
        if (disk == 'aliyun') {
            const expire = Number(aliyunOssData.expire) * 1000;
            if (expire < Date.now()) {
                await getSignature();
            }
            file.url = aliyunOssData.dir + suffix + '/' + Date.now() + "." + suffix;;
            return file;
        }
        /////如果是上传到腾讯云cos/////
        if (disk == 'qcloud') {
            const date = new Date();
            const formattedDate = date.toISOString().split('T')[0];
            file.url = formattedDate + '/' + suffix + '/' + Date.now() + "." + suffix;
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

    // 获取上传携带额外的参数
    const getExtraData = async (file) => {
        // 阿里云
        if (disk == 'aliyun') {
            return {
                key: file.url,
                OSSAccessKeyId: aliyunOssData?.accessid,
                policy: aliyunOssData?.policy,
                Signature: aliyunOssData?.signature,
            };
        }
        // 腾讯云
        if (disk == 'qcloud') {
            // 上传前请求接口获取上传的额外参数
            const result = await fileApi.getQcloudSignature({
                dir: file.url,
            });
            return {
                key: result.data.cosKey,
                policy: result.data.policy,
                success_action_status: 200,
                'q-sign-algorithm': result.data.qSignAlgorithm,
                'q-ak': result.data.qAk,
                'q-key-time': result.data.qKeyTime,
                'q-signature': result.data.qSignature,
            };
        }
        // 本地
        return {};
    }

    // const uploadProps = {
    //     accept: acceptValue,
    //     maxCount: maxCount,
    //     name: "file",
    //     listType: "picture",
    //     fileList: fileList,
    //     // 如果是上传到阿里云oss则地址不同
    //     action: aliyunOss ? aliyunOssData.host : fileApi.uploadUrl,
    //     // 如果是上传到阿里云oss则参数不同
    //     headers: aliyunOss ? {} : {
    //         token: getToken()
    //     },
    //     // 如果是上传到阿里云oss则参数不同
    //     data: aliyunOss ? getExtraData : { disk },
    //     multiple: true,
    //     onChange: uploadChange,
    //     beforeUpload: beforeUpload,
    // };

    return (
        <>
            <Upload
                accept={acceptValue}
                maxCount={maxCount}
                name="file"
                listType="picture"
                fileList={fileList}
                // 上传的地方不同 上传的地址就不同
                action={disk == 'aliyun' ? aliyunOssData.host : disk == 'qcloud' ? qcloudData.cosHost : fileApi.uploadUrl}
                // 如果是上传到本地则需要携带token
                headers={disk != 'public' ? {} : {
                    token: getToken()
                }}
                // 如果是上传到阿里云oss则参数不同
                data={getExtraData}
                multiple={true}
                onChange={uploadChange}
                beforeUpload={beforeUpload}
            >
                {fileList.length < maxCount ? <Button icon={<UploadOutlined />}>选择文件</Button> : ''}
            </Upload>
            <div style={{ width: '100%' }}>
                <Typography.Text type="secondary">最多上传 {maxCount} 个文件，允许上传的文件类型：{acceptValue.join(',')}</Typography.Text>
            </div>
        </>
    )
}
