import { http } from '@/common/axios.js'

/**
 * 代码生成 API
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
export const adminCodeGeneratorApi = {
    // 获取数据库的设置
    getMysqlConfig: (params = {}) => {
        return http.get('/admin/AdminCodeGenerator/getMysqlConfig', params);
    },
    // 获取所有的表名
    getTableList: (params = {}) => {
        return http.get('/admin/AdminCodeGenerator/getTableList', params);
    },
    // 获取所有的表以及每个表的所有的列
    getTableColumnList: (params = {}) => {
        return http.get('/admin/AdminCodeGenerator/getTableColumnList', params);
    },
    // 获取单表详情
    getTableInfo: (params = {}) => {
        return http.get('/admin/AdminCodeGenerator/getTableInfo', params);
    },
    // 获取某个表的列
    getTableColumn: (params = {}) => {
        return http.get('/admin/AdminCodeGenerator/getTableColumn', params);
    },
    // 获取代码生成器设置的详情
    getCodeGeneratorInfo: (params = {}) => {
        return http.get('/admin/AdminCodeGenerator/getCodeGeneratorInfo', params);
    },
    // 更新代码生成器设置
    updateCodeGenerator: (params = {}) => {
        return http.post('/admin/AdminCodeGenerator/updateCodeGenerator', params);
    },
    // 更新设置并生成代码
    generatorCode: (params = {}) => {
        return http.post('/admin/AdminCodeGenerator/generatorCode', params);
    },
    // 操作文件代码，是下载文件代码，还是生成到项目中
    operationFile: (params = {}) => {
        return http.post('/admin/AdminCodeGenerator/operationFile', params);
    },
}