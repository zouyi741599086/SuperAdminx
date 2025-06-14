import { http } from '@/common/axios.js'
import { config } from '@/common/config';

/**
 * 用户快捷菜单 API
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
export const adminUserShortcutMenuApi = {
    //列表
    getList: (params = {}) => {
        return http.get('/admin/AdminUserShortcutMenu/getList',params);
    },
    //获取我所有的菜单
    getMenuList: (params = {}) => {
        return http.get('/admin/AdminUserShortcutMenu/getMenuList',params);
    },
    //更新
    update: (params = {}) => {
        return http.post('/admin/AdminUserShortcutMenu/update',params);
    },
        
}