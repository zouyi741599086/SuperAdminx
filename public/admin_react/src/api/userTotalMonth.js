import { http } from '@/common/axios.js'
import { config } from '@/common/config';

/**
 * 用户月统计 API
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
export const userTotalMonthApi = {
    // 列表
    getList: (params = {}) => {
        return http.get('/app/user/admin/UserTotalMonth/getList', params);
    },
    // 导出数据
    exportData: (params = {}) => {
        return http.get('/app/user/admin/UserTotalMonth/exportData', params);
    },
    // 统计
    getTotal: (params = {}) => {
        return http.get('/app/user/admin/UserTotalMonth/getTotal', params);
    },
}