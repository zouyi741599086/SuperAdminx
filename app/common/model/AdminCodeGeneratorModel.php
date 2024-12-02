<?php
namespace app\common\model;

use app\utils\codeGenerator\CodeGenerator;

/**
 * 代码生成器
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class AdminCodeGeneratorModel extends BaseModel
{
    // 自动时间戳
    protected $autoWriteTimestamp = false;

    // 表名
    protected $name = 'admin_code_generator';

    // 字段类型转换
    protected $type = [
        'field_title'               => 'json',
        'validate'                  => 'json',
        'model'                     => 'json',
        'logic'                     => 'json',
        'controller'                => 'json',
        'react_api'                 => 'json',
        'react_create_update'       => 'json',
        'react_form_code'           => 'json',
        'react_info'                => 'json',
        'react_list'                => 'json',
        'react_list_component_code' => 'json',
        'react_other'               => 'json',
        'react_other_code'          => 'json',
    ];

    // 新增前，自动写入一些数据
    public static function onBeforeInsert($data)
    {
        // 表名转驼峰
        $camelCaseTableName = CodeGenerator::toCamelCase($data->table_name);
        // 表里面所有的列
        $tableColumn = CodeGenerator::getTableColumn($data->table_name);

        // 是否有排序字段
        $isSort = false;
        // 是否有状态字段
        $isStatus = false;
        foreach ($tableColumn as $key => $value) {
            if ($value['Field'] == 'sort') {
                $isSort = true;
            }
            if ($value['Field'] == 'status') {
                $isStatus = true;
            }
        }

        // 验证器
        $data->validate = [
            // 默认类名
            'file_name' => "{$camelCaseTableName}Validate",
            // 默认存放路劲，就是命名空间
            'file_path' => 'app\common\validate',
        ];

        // 模型
        $data->model = [
            // 默认类名
            'file_name' => "{$camelCaseTableName}Model",
            // 默认存放路劲，就是命名空间
            'file_path' => 'app\common\model',
        ];

        // 逻辑层
        $functions = [
            'getList',
            'create',
            'findData',
            'update',
            'delete',
        ];
        if ($isSort) {
            $functions[] = 'updateSort';
        }
        if ($isStatus) {
            $functions[] = 'updateSort';
        }
        $data->logic = [
            // 默认类名
            'file_name'  => "{$camelCaseTableName}Logic",
            // 默认存放路劲，就是命名空间
            'file_path'  => 'app\common\logic',

            // 默认生成的方法
            'functions'  => $functions,
            // 逻辑层类型
            'logic_type' => 1,

        ];

        // 控制器
        $data->controller = [
            // 默认类名
            'file_name' => $camelCaseTableName,
            // 默认存放路劲，就是命名空间
            'file_path' => 'app\admin\controller',
        ];

        // 后台api
        $data->react_api = [
            // 文件名称
            'file_name'      => strtolower($camelCaseTableName[0]) . substr($camelCaseTableName, 1),
            // 文件生成的目录
            'file_path'      => 'public\admin_react\src\api',

            // 默认从哪生成api
            'generator_type' => 1,
        ];

        // 添加修改的form
        $data->react_create_update = [

            // 新增更新默认弹窗
            'open_type'          => 1,
            // form每行默认一列
            'row_columns_number' => 1,
            // 是否需要更新页面，如编辑列表就不需要更新页面
            'update_page'        => 1,
        ];

        // 详情页页面
        $data->react_info = [
            // 默认 新页面打开
            'info_open_type' => 1,
            // 默认 不引入底部操作栏
            'bottom_action'  => 1,
            // 默认 不引入右边时间轴
            'right_timeline' => 1,
            // 默认 不引入card
            'is_card'        => 1
        ];

        // 列表页面
        $data->react_info = [
            // 页面类型
            'table_type' => 1,
        ];

        // 后端其它组件
        $data->react_other = [
            // 弹窗form生成的目录
            'modal_form_file_path' => "public\admin_react\src\pages\\",
            // 弹窗table生成的目录
            'modal_table_file_path' => "public\admin_react\src\pages\\",
        ];
    }

}