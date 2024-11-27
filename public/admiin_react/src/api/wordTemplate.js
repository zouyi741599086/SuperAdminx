import { http } from '@/common/axios.js'
import { config } from '@/common/config';

/**
 * word模板 API
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
export const wordTemplateApi = {
    //列表
    getList: (params = {}) => {
        return http.get('/admin/WordTemplate/getList', params);
    },
    //新增
    create: (params = {}) => {
        return http.post('/admin/WordTemplate/create', params);
    },
    //获取数据
    findData: (params = {}) => {
        return http.get('/admin/WordTemplate/findData', params);
    },
    //更新
    update: (params = {}) => {
        return http.post('/admin/WordTemplate/update', params);
    },
    //删除
    delete: (params = {}) => {
        return http.post('/admin/WordTemplate/delete', params);
    },
    //更新排序
    updateSort: (params = {}) => {
        return http.post('/admin/WordTemplate/updateSort', params);
    },
    //更新状态
    updateStatus: (params = {}) => {
        return http.post('/admin/WordTemplate/updateStatus', params);
    },
    //搜索选择某条数据
    selectWordTemplate: (params = {}) => {
        return http.get('/admin/WordTemplate/selectWordTemplate', params);
    },
    //下载导入数据的表格模板
    downloadImportExcel: (params = {}) => {
        return http.get('/admin/WordTemplate/downloadImportExcel', params);
    },
    //导入数据
    importData: `${config.url}/admin/WordTemplate/importData`,
    //导出数据
    exportData: (params = {}) => {
        return http.get('/admin/WordTemplate/exportData', params);
    },
    //批量更新新增时间
    updateCreateTime: (params = {}) => {
        return http.post('/admin/WordTemplate/updateCreateTime', params);
    },
    //批量更新所属用户
    updateAllUserId: (params = {}) => {
        return http.post('/admin/WordTemplate/updateAllUserId', params);
    },

}