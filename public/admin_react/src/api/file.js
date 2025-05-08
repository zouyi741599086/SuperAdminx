import { http } from '@/common/axios.js'
import { config } from '@/common/config';

/**
 * 文件上传 API
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
export const fileApi = {
    // 上传图片等
    upload: (params = {}) => {
        return http.upload('/admin/File/upload', params);
    },
    // 返回上传文件的url
    uploadUrl: `${config.url}/admin/File/upload`,
    // 返回下载文件的url
    download: `${config.url}/admin/File/download`,

    // 获取阿里云oss 前端直传的签名
    getSignature: (params = {}) => {
        return http.get('/admin/File/getSignature', params);
    },
    // 获取腾讯云cos 前端直传的签名
    getQcloudSignature: (params = {}) => {
        return http.get('/admin/File/getQcloudSignature', params);
    },
}