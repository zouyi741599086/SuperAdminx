import { http } from '@/common/axios.js'

/**
 * 参数设置 API
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
export const configApi = {
    // 获取列表
    getList: (params = {}) => {
        return http.get('/admin/Config/getList', params);
    },
    // 添加
    create: (params = {}) => {
        return http.post('/admin/Config/create', params);
    },
    // 获取某条数据
    findData: (params = {}) => {
        return http.get('/admin/Config/findData', params);
    },
    // 修改
    update: (params = {}) => {
        return http.post('/admin/Config/update', params);
    },
    // 修改设置
    updateContent: (params = {}) => {
        return http.post('/admin/Config/updateContent', params);
    },
    // 删除
    delete: (params = {}) => {
        return http.post('/admin/Config/delete', params);
    },
    // 排序
    updateSort: (params = {}) => {
        return http.post('/admin/Config/updateSort', params);
    },
    // 获取配置
    getConfig: (params = {}) => {
        return http.get('/admin/Config/getConfig', params);
    },
}