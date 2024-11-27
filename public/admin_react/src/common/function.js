import { rsaEncrypt } from './encrypt'
import { config } from '@/common/config.js'
import * as Lockr from 'lockr'
import { aesEncrypt, aesDecrypt } from '@/common/encrypt';

/**
 * 永久存储
 */
export const storage = {
    /**
     * 保存storage
     * @param {String} key 
     * @param {Any} data 
     */
    set(key, data) {
        if (!config.debug) {
            let aes_key = getStr(16);
            let aes_iv = getStr(16);
            data = aes_key + aes_iv + aesEncrypt(data, aes_key, aes_iv);
        }
        Lockr.set(`${config.storageDbPrefix}/${key}`, data);
    },
    /**
     * 获取storage
     * @param {String} key 
     */
    get(key) {
        try {
            let data = Lockr.get(`${config.storageDbPrefix}/${key}`);
            if (!config.debug && data) {
                return aesDecrypt(data.substring(32), data.substring(0, 16), data.substring(16, 32));
            }
            return data;
        } catch (error) {
            this.remove();
        }
    },
    /**
     * 删除或清除所有storage
     * @param {String} key 
     */
    remove(key = '') {
        if (key) {
            Lockr.rm(`${config.storageDbPrefix}/${key}`);
        } else {
            Lockr.flush()
        }
    }
}

/**
 * 深拷贝
 * @param {any} obj 数据
 * @returns 
 */
export const deepClone = (obj) => {
    let _obj = JSON.stringify(obj) //  对象转成字符串
    let objClone = JSON.parse(_obj) //  字符串转成对象
    return objClone
}

/**
 * 数组转多维数据，会给数组增加上级的路劲
 * @param {Array} arrs 需要转换的一维数据
 * @param {Any} pid 上级
 * @param {String} key 装下级的key
 * @param {Array} pid_path 路劲
 * @param {Boolean} empty_children 当下级为空的时候，是否需要保留key-children
 * @returns Array
 */
export const arrayToTree = (arrs, pid = null, key = 'children', pid_path = [], empty_children = true) => {
    let arr = deepClone(arrs);
    let newArr = [];
    arr.forEach(item => {
        if (item['pid'] === pid) {
            item.pid_path = pid_path.concat([item.id])
            let children = arrayToTree(arr, item['id'], key, item.pid_path, empty_children);
            if (empty_children) {
                item[key] = children;
            } else if (children.length > 0) {
                item[key] = children;
            }
            newArr.push(item);
        }
    })
    return newArr
}

/**
 * 数组转多维数据，会给数组增加上级的路劲（数组），这是专门是后台菜单用的
 * @param {Array} arrs 需要转换的一维数据
 * @param {Any} pid 上级
 * @param {String} key 装下级的key
 * @param {Array} pid_name_path 路劲
 * @param {Boolean} empty_children 当下级为空的时候，是否需要保留key-children
 * @returns Array
 */
export const menuToTree = (arrs, pid = null, key = 'children', pid_name_path = [], empty_children = true) => {
    let arr = deepClone(arrs);
    let newArr = [];
    arr.forEach(item => {
        if (item['pid_name'] === pid) {
            item.pid_name_path = pid_name_path.concat([item.name])
            let children = menuToTree(arr, item['name'], key, item.pid_name_path, empty_children);
            if (empty_children) {
                item[key] = children;
            } else if (children.length > 0) {
                item[key] = children;
            }
            newArr.push(item);
        }
    })
    return newArr
}

/**
 * 对登录的token进行加密
 * @returns string
 */
export const getToken = () => {
    let token = storage.get(`adminUserToken`) || sessionStorage.getItem(`adminUserToken`);
    return token ? rsaEncrypt({
        token,
        time: new Date().getTime()
    }) : '';
}

/**
 * 判断是否是移动端
 * @returns boolean
 */
export const isMobileFun = () => {
    let mobile = navigator.userAgent.toLowerCase().match(/(ipod|ipad|iphone|android|coolpad|mmp|smartphone|midp|wap|xoom|symbian|j2me|blackberry|wince)/i) != null;
    return mobile ? true : document.documentElement.clientWidth <= 768 ? true : false;
}

/**
 * //权限验证 
 * @param {string} name 验证的权限名称
 * @returns boolean 有权限返回false，无权限返回true
 */
export const authCkeck = (name) => {
    if (!name) {
        return true;
    }
    const actionAuthArr = storage.get('actionAuthArr');
    if (actionAuthArr.indexOf(name) !== -1) {
        return false
    }
    return true;
}

/**
 * 获取随机字符串
 * @param {Number} number 字符串的长度 
 * @returns string
 */
export const getStr = (number) => {
    let x = 'AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz0123456789'
    let str = ''
    for (let i = 0; i < number; i++) {
        str += x[parseInt(Math.random() * x.length)]
    }
    return str
}

/**
 * 颜色转为hsb
 * @param {string} string 如#ff5500
 * @returns array
 */
export const colorHsb = (string) => {
    let sColor = string.toLowerCase()
    let arr = []
    for (let i = 1; i < 7; i += 2) {
        arr.push(parseInt("0x" + sColor.slice(i, i + 2)));
    }
    let h = 0, s = 0, v = 0;
    let r = arr[0], g = arr[1], b = arr[2];
    arr.sort(function (a, b) {
        return a - b;
    })
    let max = arr[2]
    let min = arr[0];
    v = max / 255;
    if (max === 0) {
        s = 0;
    } else {
        s = 1 - (min / max);
    }
    if (max === min) {
        h = 0;//事实上，max===min的时候，h无论为多少都无所谓
    } else if (max === r && g >= b) {
        h = 60 * ((g - b) / (max - min)) + 0;
    } else if (max === r && g < b) {
        h = 60 * ((g - b) / (max - min)) + 360
    } else if (max === g) {
        h = 60 * ((b - r) / (max - min)) + 120
    } else if (max === b) {
        h = 60 * ((r - g) / (max - min)) + 240
    }
    h = parseInt(h);
    s = parseInt(s * 100);
    v = parseInt(v * 100);
    return [h, s, v]
}