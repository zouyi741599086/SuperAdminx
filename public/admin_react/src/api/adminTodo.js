import { http } from '@/common/axios.js'
import { config } from '@/common/config';

/**
 *  API
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
export const adminTodoApi = {
    // 列表
    getList: (params = {}) => {
        return http.get('/app/admin/admin/AdminTodo/getList',params);
    },
    // 获取某月的待办事项总数
    getMonthCount: (params = {}) => {
        return http.get('/app/admin/admin/AdminTodo/getMonthCount',params);
    },
    // 新增
    create: (params = {}) => {
        return http.post('/app/admin/admin/AdminTodo/create',params);
    },
    // 获取数据
    findData: (params = {}) => {
        return http.get('/app/admin/admin/AdminTodo/findData',params);
    },
    // 更新
    update: (params = {}) => {
        return http.post('/app/admin/admin/AdminTodo/update',params);
    },
    // 更新状态
    updateStatus: (params = {}) => {
        return http.post('/app/admin/admin/AdminTodo/updateStatus',params);
    },
    // 删除
    delete: (params = {}) => {
        return http.post('/app/admin/admin/AdminTodo/delete',params);
    },
        
}