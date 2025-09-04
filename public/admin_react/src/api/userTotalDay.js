import { http } from '@/common/axios.js'
import { config } from '@/common/config';

/**
 * 用户日统计 API
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
export const userTotalDayApi = {
    // 列表
    getList: (params = {}) => {
        return http.get('/app/user/admin/UserTotalDay/getList', params);
    },
    // 导出数据
    exportData: (params = {}) => {
        return http.get('/app/user/admin/UserTotalDay/exportData', params);
    },
    // 统计
    getTotal: (params = {}) => {
        return http.get('/app/user/admin/UserTotalDay/getTotal', params);
    },
}