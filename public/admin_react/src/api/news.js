import { http } from '@/common/axios.js'

/**
 * 文章 API
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
export const newsApi = {
    // 获取列表
    getList: (params = {}) => {
        return http.get('/app/news/admin/News/getList', params);
    },
    // 添加
    create: (params = {}) => {
        return http.post('/app/news/admin/News/create', params);
    },
    // 获取某条数据
    findData: (params = {}) => {
        return http.get('/app/news/admin/News/findData', params);
    },
    // 修改
    update: (params = {}) => {
        return http.post('/app/news/admin/News/update', params);
    },
    // 删除
    delete: (params = {}) => {
        return http.post('/app/news/admin/News/delete', params);
    },
    // 修改排序
    updateSort: (params = {}) => {
        return http.post('/app/news/admin/News/updateSort', params);
    },
    // 批量操作
    updateAll: (params = {}) => {
        return http.post('/app/news/admin/News/updateAll', params);
    },
    // 状态修改
    updateStatus: (params = {}) => {
        return http.post('/app/news/admin/News/updateStatus', params);
    },

}