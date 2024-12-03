import { http } from '@/common/axios.js'

/**
 * 操作日志 API
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
export const adminLogApi = {
    // 获取列表
    getList: (params = {}) => {
        return http.get('/admin/AdminLog/getList', params);
    },
}