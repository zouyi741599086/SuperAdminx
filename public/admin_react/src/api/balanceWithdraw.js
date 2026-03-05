import { http } from '@/common/axios.js'
import { config } from '@/common/config';

/**
 * 余额提现 API
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
export const balanceWithdrawApi = {
    //列表
    getList: (params = {}) => {
        return http.get('/app/balance/admin/BalanceWithdraw/getList',params);
    },
    //获取数据
    findData: (params = {}) => {
        return http.get('/app/balance/admin/BalanceWithdraw/findData',params);
    },
    //更新状态
    updateStatus: (params = {}) => {
        return http.post('/app/balance/admin/BalanceWithdraw/updateStatus',params);
    },
    //导出数据
    exportData: (params = {}) => {
        return http.get('/app/balance/admin/BalanceWithdraw/exportData',params);
    },
        
}