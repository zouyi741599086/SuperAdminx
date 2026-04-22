import { http } from '@/common/axios.js'
import { config } from '@/common/config';

/**
 *  API
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
export const adminUserTodoApi = {
    // 列表
    getList: (params = {}) => {
        return http.get('/app/admin/admin/AdminUserTodo/getList',params);
    },
    // 获取某月的待办事项总数
    getMonthCount: (params = {}) => {
        return http.get('/app/admin/admin/AdminUserTodo/getMonthCount',params);
    },
    // 新增
    create: (params = {}) => {
        return http.post('/app/admin/admin/AdminUserTodo/create',params);
    },
    // 获取数据
    findData: (params = {}) => {
        return http.get('/app/admin/admin/AdminUserTodo/findData',params);
    },
    // 更新
    update: (params = {}) => {
        return http.post('/app/admin/admin/AdminUserTodo/update',params);
    },
    // 更新状态
    updateStatus: (params = {}) => {
        return http.post('/app/admin/admin/AdminUserTodo/updateStatus',params);
    },
    // 删除
    delete: (params = {}) => {
        return http.post('/app/admin/admin/AdminUserTodo/delete',params);
    },
        
}