<?php
namespace plugin\admin\app\common\logic\adminCodeGenerator;

use plugin\admin\app\common\model\AdminCodeGeneratorModel;
use think\facade\Db;

/**
 * 代码生成器
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class CodeGeneratorQueryLogic
{
    /**
     * 获取代码生成器设置的详情
     * @param string $tableName 
     * @return mixed
     */
    public function findData(string $tableName) : mixed
    {
        return AdminCodeGeneratorModel::where('table_name', $tableName)->find();
    }
}