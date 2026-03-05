import { http } from '@/common/axios.js'

/**
 * 文章分类 API
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
export const newsClassApi = {
    // 获取列表
    getList: (params = {}) => {
        return http.get('/app/news/admin/NewsClass/getList', params);
    },
    // 添加
    create: (params = {}) => {
        return http.post('/app/news/admin/NewsClass/create', params);
    },
    // 获取某条数据
    findData: (params = {}) => {
        return http.get('/app/news/admin/NewsClass/findData', params);
    },
    // 修改
    update: (params = {}) => {
        return http.post('/app/news/admin/NewsClass/update', params);
    },
    // 删除
    delete: (params = {}) => {
        return http.post('/app/news/admin/NewsClass/delete', params);
    },
    // 修改排序
    updateSort: (params = {}) => {
        return http.post('/app/news/admin/NewsClass/updateSort', params);
    },
    // 上下架
    updateStatus: (params = {}) => {
        return http.post('/app/news/admin/NewsClass/updateStatus', params);
    },

}