import { http } from '@/common/axios.js'

/**
 * 省市区 API
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
export const regionApi = {
    // 根据id获取下级
    getList: (params = {}) => {
        return http.get('/admin/region/getList', params);
    },
    // 获取所有省
    getProvince: (params = {}) => {
        return http.get('/admin/region/getProvince', params);
    },
    // 获取所有省市，存在上下级关系的
    getProvinceCity: (params = {}) => {
        return http.get('/admin/region/getProvinceCity', params);
    },
    // 获取所有省市区，存在上下级关系的
    getListAll: (params = {}) => {
        return http.get('/admin/region/getListAll', params);
    },
    //////////////////////////////////////////////////
    ///////////////////////////////////////////////////
}