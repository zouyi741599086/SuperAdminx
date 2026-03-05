import { http } from '@/common/axios.js'

/**
 * 后台其他操作 API
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
export const adminIndexApi = {
    // 清除缓存
    clearCache: (params = {}) => {
        return http.get('/app/admin/admin/AdminIndex/clearCache', params);
    },
}