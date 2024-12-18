<?php
namespace app\admin\controller;

use support\Request;
use support\Response;
use app\utils\codeGenerator\CodeGenerator;

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

    /**
     * 获取数据库的设置
     * @method get
     * @param Request $request 
     * @return Response
     */
    public function getMysqlConfig(Request $request) : Response
    {
        $data = [
            //'hostname' => getenv('DB_HOST'),
            'database' => getenv('DB_NAME'),
            //'username' => getenv('DB_USER'),
            //'password' => getenv('DB_PASSWORD'),
            //'hostport' => getenv('DB_PORT'),
            'prefix' => getenv('DB_PREFIX'),
        ];
        return success($data);
    }

    /**
     * 获取所有表
     * @method get
     * @param Request $request 
     * @return Response
     */
    public function getTableList(Request $request) : Response
    {
        $list = CodeGenerator::getTableList();
        return success($list);
    }

    /**
     * 获取所有的表以及每个表的所有的列
     * @method get
     * @param Request $request 
     * @return Response
     */
    public function getTableColumnList(Request $request) : Response
    {
        $list = CodeGenerator::getTableColumnList();
        return success($list);
    }

    /**
     * 获取单表详情：创建时间、数据量、存储引擎等
     * @method get
     * @param Request $request 
     * @return Response
     */
    public function getTableInfo(Request $request) : Response
    {
        $data = CodeGenerator::getTableInfo($request->get('table_name'));
        return success($data);
    }

    /**
     * 获取某个表的列
     * @method get
     * @param Request $request 
     * @return Response
     */
    public function getTableColumn(Request $request) : Response
    {
        $list = CodeGenerator::getTableColumn($request->get('table_name'));
        return success($list);
    }

    /**
     * 获取代码生成器设置的详情
     * @method get
     * @param Request $request 
     * @return Response
     */
    public function getCodeGeneratorInfo(Request $request) : Response
    {
        $data = CodeGenerator::getCodeGeneratorInfo($request->get('table_name'));
        return success($data);
    }

    /**
     * 更新代码生成器设置
     * @method post
     * @param Request $request 
     * @return Response
     */
    public function updateCodeGenerator(Request $request) : Response
    {
        CodeGenerator::updateCodeGenerator($request->post());
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
        $data = CodeGenerator::generatorCode($request->post(), $request->post('code_name'));
        return success($data);
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
        CodeGenerator::operationFile($params['table_name'], $params['name'], $params['forced'] ?? false);
        return success([], '已成功生成');
    }

}
