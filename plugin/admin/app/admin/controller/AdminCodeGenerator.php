<?php
namespace plugin\admin\app\admin\controller;

use support\Request;
use support\Response;
use plugin\admin\app\common\service\AdminCodeGeneratorService;

/**
 * 代码生成
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class AdminCodeGenerator
{

    // 此控制器是否需要登录
    protected $onLogin = true;
    // 不需要登录的方法
    protected $noNeedLogin = [];
    // 不需要加密的方法
    protected $noNeedEncrypt = [];

    public function __construct(
        private AdminCodeGeneratorService $adminCodeGeneratorService,
    ) {}

    /**
     * 获取数据库的设置
     * @method get
     * @param Request $request 
     * @return Response
     */
    public function getMysqlConfig(Request $request) : Response
    {
        $result = $this->adminCodeGeneratorService->getMysqlConfig();
        return success($result);
    }

    /**
     * 获取所有表
     * @method get
     * @param Request $request 
     * @return Response
     */
    public function getTableList(Request $request) : Response
    {
        $result = $this->adminCodeGeneratorService->getTableList();
        return success($result);
    }

    /**
     * 获取所有的表以及每个表的所有的列
     * @method get
     * @param Request $request 
     * @return Response
     */
    public function getTableColumnList(Request $request) : Response
    {
        $result = $this->adminCodeGeneratorService->getTableColumnList();
        return success($result);
    }

    /**
     * 获取单表详情：创建时间、数据量、存储引擎等
     * @method get
     * @param Request $request 
     * @param string $table_name 表名
     * @return Response
     */
    public function getTableInfo(Request $request, string $table_name) : Response
    {
        $result = $this->adminCodeGeneratorService->getTableInfo($table_name);
        return success($result);
    }

    /**
     * 获取某个表的列
     * @method get
     * @param Request $request 
     * @param string $table_name 表名
     * @return Response
     */
    public function getTableColumn(Request $request, string $table_name) : Response
    {
        $result = $this->adminCodeGeneratorService->getTableColumn($table_name);
        return success($result);
    }

    /**
     * 获取代码生成器设置的详情
     * @method get
     * @param Request $request 
     * @param string $table_name 表名
     * @return Response
     */
    public function findData(Request $request, string $table_name) : Response
    {
        $result = $this->adminCodeGeneratorService->findData($table_name);
        return success($result);
    }

    /**
     * 更新代码生成器设置
     * @method post
     * @param Request $request 
     * @param string $table_name 表名
     * @return Response
     */
    public function update(Request $request, string $table_name) : Response
    {
        $this->adminCodeGeneratorService->update($table_name, $request->post());
        return success();
    }

    /**
     * 更新并生成代码
     * @method post
     * @param Request $request 
     * @return Response
     */
    public function generatorCode(Request $request) : Response
    {
        $result = $this->adminCodeGeneratorService->generatorCode($request->post());
        return success($result);
    }

    /**
     * 生成代码到项目中
     * @method post
     * @param Request $request
     * @return Response
     */
    public function operationFile(Request $request) : Response
    {
        $params = $request->all();
        $this->adminCodeGeneratorService->operationFile($params['table_name'], $params['name'], $params['forced'] ?? false);
        return success();
    }

}
