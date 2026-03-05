import { http } from '@/common/axios.js'
import { config } from '@/common/config';

/**
 * 用户余额明细 API
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
export const balanceDetailsApi = {
    //列表
    getList: (params = {}) => {
        return http.get('/app/balance/admin/BalanceDetails/getList',params);
    },
    //导出数据
    exportData: (params = {}) => {
        return http.get('/app/balance/admin/BalanceDetails/exportData',params);
    },
        
}