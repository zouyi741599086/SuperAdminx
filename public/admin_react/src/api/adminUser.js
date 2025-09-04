import { http } from '@/common/axios.js'

/**
 * 管理员 API
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
export const adminUserApi = {
    // 登录
    login: (params = {}) => {
        return http.post('/app/admin/admin/Login/index', params);
    },
    // 登录的用户修改密码
    updatePassword: (params = {}) => {
        return http.post('/app/admin/admin/AdminUser/updatePassword', params);
    },
    // 获取列表
    getList: (params = {}) => {
        return http.get('/app/admin/admin/AdminUser/getList', params);
    },
    // 添加
    create: (params = {}) => {
        return http.post('/app/admin/admin/AdminUser/create', params);
    },
    // 获取某条数据
    findData: (params = {}) => {
        return http.get('/app/admin/admin/AdminUser/findData', params);
    },
    // 修改
    update: (params = {}) => {
        return http.post('/app/admin/admin/AdminUser/update', params);
    },
    // 删除
    delete: (params = {}) => {
        return http.post('/app/admin/admin/AdminUser/delete', params);
    },
    // 状态修改
    updateStatus: (params = {}) => {
        return http.post('/app/admin/admin/AdminUser/updateStatus', params);
    },
    // 获取用户的资料
    getAdminUser: (params = {}) => {
        return http.get('/app/admin/admin/AdminUser/getAdminUser', params);
    },
    // 修改用户的资料
    updateInfo: (params = {}) => {
        return http.post('/app/admin/admin/AdminUser/updateInfo', params);
    },
}