import { http } from '@/common/axios.js'

/**
 * 管理员角色 API
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
export const adminRoleApi = {
    // 获取列表
    getList: (params = {}) => {
        return http.get('/app/admin/admin/AdminRole/getList', params);
    },
    // 添加
    create: (params = {}) => {
        return http.post('/app/admin/admin/AdminRole/create', params);
    },
    // 获取某条数据
    findData: (params = {}) => {
        return http.get('/app/admin/admin/AdminRole/findData', params);
    },
    // 修改
    update: (params = {}) => {
        return http.post('/app/admin/admin/AdminRole/update', params);
    },
    // 删除
    delete: (params = {}) => {
        return http.post('/app/admin/admin/AdminRole/delete', params);
    },
    // 修改权限前获取拥有的权限
    getDataMenu: (params = {}) => {
        return http.get('/app/admin/admin/AdminRole/getDataMenu', params);
    },
    // 更新某个角色拥有的权限节点
    updateDataMenu: (params = {}) => {
        return http.post('/app/admin/admin/AdminRole/updateDataMenu', params);
    },
    // 搜索选择某条数据
    selectAdminRole: (params = {}) => {
        return http.get('/app/admin/admin/AdminRole/selectAdminRole', params);
    },
}