import { http } from '@/common/axios.js'
import { config } from '@/common/config';

/**
 * 用户 API
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
export const userApi = {
    //列表
    getList: (params = {}) => {
        return http.get('/admin/User/getList',params);
    },
    //获取数据
    findData: (params = {}) => {
        return http.get('/admin/User/findData',params);
    },
    //更新
    update: (params = {}) => {
        return http.post('/admin/User/update',params);
    },
    //搜索选择某条数据
    selectUser: (params = {}) => {
        return http.get('/admin/User/selectUser',params);
    },
    //导出数据
    exportData: (params = {}) => {
        return http.get('/admin/User/exportData',params);
    },
    //用户推荐关系查询
    invitations: (params = {}) => {
        return http.get('/admin/User/invitations',params);
    },
        
}