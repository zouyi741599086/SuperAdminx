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
class CodeGeneratorExecuteLogic
{
    /**
     * 更新代码生成器设置，有则更新，没得则创建
     * @param string $tableName 表名
     * @param array $params 
     * @return void
     */
    public function update(string $tableName, array $params) : void
    {
        $id = AdminCodeGeneratorModel::where('table_name', $tableName)->value('id');
        if ($id) {
            $params['id'] = $id;
            AdminCodeGeneratorModel::update($params);
        } else {
            AdminCodeGeneratorModel::create($params);
        }
    }
}