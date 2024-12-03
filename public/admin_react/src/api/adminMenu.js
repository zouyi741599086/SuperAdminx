import { http } from '@/common/axios.js'

/**
 * 后台菜单 API
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
export const adminMenuApi = {
    // 获取列表
    getList: (params = {}) => {
        return http.get('/admin/AdminMenu/getList', params);
    },
    // 添加
    create: (params = {}) => {
        return http.post('/admin/AdminMenu/create', params);
    },
    // 获取某条数据
    findData: (params = {}) => {
        return http.get('/admin/AdminMenu/findData', params);
    },
    // 修改
    update: (params = {}) => {
        return http.post('/admin/AdminMenu/update', params);
    },
    // 删除
    delete: (params = {}) => {
        return http.post('/admin/AdminMenu/delete', params);
    },
}