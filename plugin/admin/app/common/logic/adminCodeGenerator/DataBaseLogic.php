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
class DataBaseLogic
{
    /**
     * 获取数据库的设置
     * @return array
     */
    public function getMysqlConfig() : array
    {
        return [
            //'hostname' => getenv('DB_HOST'),
            'database' => getenv('DB_NAME'),
            //'username' => getenv('DB_USER'),
            //'password' => getenv('DB_PASSWORD'),
            //'hostport' => getenv('DB_PORT'),
            'prefix'   => getenv('DB_PREFIX'),
        ];
    }

    /**
     * 获取所有表
     * @return array
     */
    public function getTableList() : array
    {
        return Db::query("show table status");
    }

    /**
     * 获取所有的表以及每个表的所有的列
     * @return array
     */
    public function getTableColumnList() : array
    {
        $database = getenv('DB_NAME');
        $sql      = "SELECT TABLE_SCHEMA AS 'Database', TABLE_NAME AS 'Table', COLUMN_NAME AS 'Column' FROM information_schema.columns WHERE TABLE_SCHEMA=:db_name ORDER BY TABLE_NAME,ORDINAL_POSITION";

        return Db::query($sql, ['db_name' => $database]);
    }

    /**
     * 获取单表详情：创建时间、数据量、存储引擎等
     * @param string $tableName 表名
     * @return array
     */
    public function getTableInfo(string $tableName) : array
    {
        $sql  = "show table status where name=:table_name";
        $list = Db::query($sql, ['table_name' => $tableName]);
        return $list[0] ?? [];
    }

    /**
     * 获取某个表的列
     * @param string $tableName
     * @return array
     */
    public function getTableColumn(string $tableName) : array
    {
        $list = Db::query("SHOW FULL COLUMNS FROM `{$tableName}`");

        // 如果此表有添加一些额外的字段，需要压进去，还需要将字段设置的中文名称压进去
        $data = AdminCodeGeneratorModel::where('table_name', $tableName)->field('id,field_title')->find();
        if (isset($data->field_title)) {
            foreach ($data->field_title as $k => $v) {
                $isOn = false;
                foreach ($list as $fieldKey => $field) {
                    if ($field['Field'] == $k) {
                        $list[$fieldKey]['field_title'] = $v;
                        $isOn                           = true;
                        break;
                    }
                }
                // 没有找到此字段，说明是额外添加的，则压进去
                if (! $isOn) {
                    $list[] = [
                        'Field'       => $k,
                        'field_title' => $v,
                        'delete'      => 1,
                    ];
                }
            }
        }
        return $list;
    }
}