import axios from 'axios';
import { config } from '@/common/config.js'
import { rsaEncrypt, aesEncrypt, aesDecrypt } from '@/common/encrypt';
import { getToken, getStr, storage } from '@/common/function'
import { message } from 'antd';
import qs from 'qs';

// 请求域名
axios.defaults.baseURL = config.url;
// 响应时间
axios.defaults.timeout = 1000 * 60 * 10; //10分钟

/**
 * 处理请求后返回的数据
 * @param {Object} response 请求后返回的数据
 * @param {string} aes_key 本次请求加密的key
 * @param {string} aes_iv 本次请求加密的iv
 */
function requestAfter(response, aes_key, aes_iv) {
    if (response && (response?.status === 200)) {
        // 登录过期，强制跳转到登录
        if (response.data.code === -2) {
            storage.remove(`adminUserToken`)
            sessionStorage.removeItem(`adminUserToken`);
            message.error(response.data.message);
            setTimeout(() => {
                location.reload();
            }, 1500)
        }
        // 解密数据
        if (config.api_encryptor.enable && response.data?.encrypt_data) {
            response.data.data = aesDecrypt(response.data?.encrypt_data, aes_key, aes_iv)
        }
        return response.data;
    } else {
        message.error('网络错误~');
        return {};
    }
}

/**
 * 请求前组装get的参数，对params参数进行加密，headers数据等
 * @param {string} url 
 * @param {object} params 
 * @param {string} method 
 * @returns 
 */
const requestBefore = (url, params, method) => {
    const aes_key = getStr(32);
    const aes_iv = getStr(16);
    if (config.api_encryptor.enable) {
        params = {
            encrypt_data: aesEncrypt(params, aes_key, aes_iv)
        }
    }
    // 组装get的参数
    if (method === 'get' && Object.keys(params).length > 0) {
        url += url.indexOf("?") !== -1 ? '&' : '?' + qs.stringify(params);
    }
    // headers
    const headers = {
        'Token': getToken(),
        'SuperAdminxKeySecret': rsaEncrypt(aes_key + aes_iv),
        'Content-Type': 'application/json;charset=UTF-8',
    };
    return {
        url,
        params,
        aes_key,
        aes_iv,
        headers
    };
}

// 发起请求
const request = (_url, _params, _method) => {
    const { url, params, aes_key, aes_iv, headers } = requestBefore(_url, _params, _method);
    return new Promise((resolve, reject) => {
        axios({
            method: _method,
            url: url,
            data: params,
            headers: headers,
        }).then(response => {
            resolve(requestAfter(response, aes_key, aes_iv))
        });
    })
}

export const http = {
    post(url, params = {}) {
        return request(url, params, 'post')
    },
    get(url, params = {}) {
        return request(url, params, 'get')
    },
    fetchPost(_url, _params = {}) {
        return new Promise((resolve, reject) => {
            const { url, headers } = requestBefore(_url, _params, 'post');
            fetch(`${config.url}${url}`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(_params)
            }).then(response => {
                resolve(response);
            }).catch(error => {
                reject(error);
            })
        });
    },
    upload(url, params = {}) {
        return axios({
            method: 'post',
            url: url,
            data: params,
            headers: {
                'Content-Type': 'multipart/form-data',
                'token': getToken()
            }
        })
    }
};