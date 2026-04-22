import { http } from '@/common/axios.js'
import { config } from '@/common/config';

/**
 * 支付记录 API
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
export const payRecordApi = {
    // 列表
    getList: (params = {}) => {
        return http.get('/app/payRecord/admin/PayRecord/getList',params);
    },
    // 获取数据
    findData: (params = {}) => {
        return http.get('/app/payRecord/admin/PayRecord/findData',params);
    },
    // 退款
    refundMoney: (params = {}) => {
        return http.post('/app/payRecord/admin/PayRecord/refundMoney',params);
    },
    // 导出数据
    exportData: (params = {}) => {
        return http.get('/app/payRecord/admin/PayRecord/exportData',params);
    },
        
}