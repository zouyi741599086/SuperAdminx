import { http } from '@/common/axios.js'
import { config } from '@/common/config';

/**
 * 用户 API
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
export const adminTotalApi = {
    //首页统计
    index: (params = {}) => {
        return http.get('/app/admin/admin/AdminTotal/index',params);
    },
}