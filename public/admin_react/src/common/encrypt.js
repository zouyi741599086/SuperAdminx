import { config } from '@/common/config.js'
import CryptoJS from "crypto-js"
import JSEncrypt from 'jsencrypt';

/**
 * rsa 加密
 */
export const rsaEncrypt = (str) => {
    if (str instanceof Object) {
        str = JSON.stringify(str)
    }
    const encryptor = new JSEncrypt()
    encryptor.setPublicKey(config.api_encryptor.rsa_public)
    return encryptor.encrypt(str);
}

/**
 * aes 加密
 * 只能传对象多数组
 */
export const aesEncrypt = (data, aes_key, aes_iv) => {
    data = JSON.stringify(data)
    return CryptoJS.AES.encrypt(data, CryptoJS.enc.Utf8.parse(aes_key), {
        iv: CryptoJS.enc.Utf8.parse(aes_iv),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    }).toString();
}

/**
 * aes 解密
 */
export const aesDecrypt = (data, aes_key, aes_iv) => {
    try {
        let bytes = CryptoJS.AES.decrypt(data, CryptoJS.enc.Utf8.parse(aes_key), {
            iv: CryptoJS.enc.Utf8.parse(aes_iv),
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
        // 字符串转对象                      
        return JSON.parse(CryptoJS.enc.Utf8.stringify(bytes));
    } catch (error) {
        console.log('数据解密错误：' + error);
    }
}
