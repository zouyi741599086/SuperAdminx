<?php
namespace plugin\admin\app\common\logic\adminCodeGenerator;

use plugin\admin\app\common\logic\adminCodeGenerator\{CodeGeneratorQueryLogic, CodeGeneratorUtilLogic};
use plugin\admin\app\common\model\AdminMenuModel;

/**
 * 代码生成器
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class GeneratorFileLogic
{
    public function __construct(
        private CodeGeneratorQueryLogic $codeGeneratorQueryLogic,
    ) {}


    /**
     * 生成代码到项目中
     * @param string $tableName 操作的表
     * @param string $name 操作的代码，如 validate model controller
     * @param bool $forced 生成代码到项目中的时候是否强制覆盖现有文件
     * @return void
     */
    public function operationFile(string $tableName, string $name, bool $forced = false) : void
    {
        // 数据库中此表的设置信息
        $data = $this->codeGeneratorQueryLogic->findData($tableName);
        if (! $data || ! isset($data[$name]['file_name']) || ! isset($data[$name]['file_suffix'])) {
            abort('未设置，请先生成预览代码');
        }

        if (config('app.debug') == false) {
            abort('正式环境不允许操作~');
        }
        // 配置
        $config = $data[$name];
        // 代码
        $code = $data["{$name}_code"] ?? '';
        // 文件名
        $file_name = "{$config['file_name']}.{$config['file_suffix']}";

        // 如果是逻辑层，则要生成多个文件
        if ($name == 'logic') {
            $this->generateLogicFile($tableName, $data, $forced);
        }
        // 如果是新增更新页面，则要生成多个文件
        else if ($name == 'react_create_update') {
            $this->generateReactCreateUpdateFile($tableName, $data, $file_name, $forced);
        }
        // 如果生成的是前端的详情页面
        else if ($name == "react_info") {
            $this->generateReactInfoFile($tableName, $data, $file_name, $forced);
        }
        // 如果生成的是前端的列表
        else if ($name == "react_list") {
            $this->generateReactListFile($tableName, $data, $file_name, $forced);
        }
        // 如果生成的是后端的其它组件
        else if ($name == "react_other") {
            $this->generateReactOtherFile($tableName, $data, $code, $forced);
        } else {
            $this->generateFile($config['file_path'], $file_name, $code, $forced);
        }
    }

    /**
     * 生成logic文件
     * @param string $tableName 操作的表
     * @param object $data 数据
     * @param bool $forced 覆盖
     * @return void
     */
    private function generateLogicFile(string $tableName, object $data, bool $forced = false) : void
    {
        $tableNameToCamelCaseLower = CodeGeneratorUtilLogic::toCamelCase($tableName, true);

        foreach ($data->logic_code as $logicFolder => $logicCode) {
            $this->generateFile("{$data->logic['file_path']}\\{$tableNameToCamelCaseLower}", "{$logicFolder}.{$data->logic['file_suffix']}", $logicCode, $forced);
        }
    }

    /**
     * 生成react_create_update文件
     * @param string $tableName 操作的表
     * @param object $data 数据
     * @param string $fileName 文件名
     * @param bool $forced 覆盖
     * @return void
     */
    private function generateReactCreateUpdateFile(string $tableName, object $data, string $fileName, bool $forced = false) : void
    {
        // 从列表页的权限id，找生成的目录
        $adminMenuName = CodeGeneratorUtilLogic::toCamelCase($tableName, true);
        $adminMenu     = AdminMenuModel::where('name', $adminMenuName)->find();
        if (! $adminMenu) {
            abort('未设置列表页权限节点，无法找到生成目录~');
        }

        // 生成新增页面的代码
        $file_path = "public\admin_react\src\pages{$adminMenu->component_path}\create";
        $this->generateFile($file_path, $fileName, $data->react_create_code, $forced);

        // 是否需要更新页面
        if ($data->react_create_update['update_page'] == 1) {
            $file_path = "public\admin_react\src\pages{$adminMenu->component_path}\update";
            $this->generateFile($file_path, $fileName, $data->react_update_code, $forced);
        }

        // 生成表单字段的代码，可能是多标签tab的form会多个form的字段组件
        $file_path = "public\admin_react\src\pages{$adminMenu->component_path}\component";
        foreach ($data->react_form_code as $k => $v) {
            $this->generateFile($file_path, "form{$k}.jsx", $v, $forced);
        }
    }

    /**
     * 生成react_info文件
     * @param string $tableName 操作的表
     * @param object $data 数据
     * @param string $file_name 文件名
     * @param bool $forced 覆盖
     * @return void
     */
    private function generateReactInfoFile(string $tableName, object $data, string $file_name, bool $forced = false) : void
    {
        // 详情的权限id，从这找生成的目录
        $adminMenu = AdminMenuModel::where('name', CodeGeneratorUtilLogic::toCamelCase($tableName, true))->find();
        if (! $adminMenu || ! $adminMenu['component_path']) {
            abort('未设置列表页权限节点，无法找到生成目录~');
        }

        // 开始生成代码并保存
        $file_path = "public\admin_react\src\pages{$adminMenu->component_path}\info";
        $this->generateFile($file_path, $file_name, $data->react_info_code, $forced);
    }

    /**
     * 生成react_list文件
     * @param string $tableName 操作的表
     * @param object $data 数据
     * @param string $file_name 文件名
     * @param bool $forced 覆盖
     * @return void
     */
    private function generateReactListFile(string $tableName, object $data, string $file_name, bool $forced = false) : void
    {
        // 列表的权限id，从这找生成的目录
        $adminMenu = AdminMenuModel::where('name', CodeGeneratorUtilLogic::toCamelCase($tableName, true))->find();
        if (! $adminMenu || ! $adminMenu['component_path']) {
            abort('未设置列表页权限节点，无法找到生成目录~');
        }

        // 开始生成代码并保存
        $file_path = "public\admin_react\src\pages{$adminMenu->component_path}";
        $this->generateFile($file_path, $file_name, $data->react_list_code, $forced);

        // 如果有生成其它组件，如批量导入
        if (
            $data->react_list_component_code &&
            is_array($data->react_list_component_code) &&
            count($data->react_list_component_code) > 0
        ) {
            foreach ($data->react_list_component_code as $k => $v) {
                $this->generateFile($file_path, "{$k}.jsx", $v, $forced);
            }
        }
    }

    /**
     * 生成react_other文件
     * @param string $tableName 操作的表
     * @param object $data 数据
     * @param string $code 代码
     * @param bool $forced 覆盖
     * @return void
     */
    private function generateReactOtherFile(string $tableName, object $data, string $code, bool $forced = false) : void
    {
        // 生成的是搜索选择数据组件
        if ($data->react_other->component_type == 'select') {
            $file_path = "public\admin_react\src\components";
            $file_name = 'select' . CodeGeneratorUtilLogic::toCamelCase($tableName) . '.jsx';
        }

        // 生成的是弹窗form
        if ($data->react_other->component_type == 'modalForm') {
            $file_path = $data->react_other->modal_form_file_path;
            $file_name = $data->react_other->modal_form_file_name;
        }

        // 生成的是弹窗table
        if ($data->react_other->component_type == 'modalTable') {
            $file_path = $data->react_other->modal_table_file_path;
            $file_name = $data->react_other->modal_table_file_name;
        }

        $this->generateFile($file_path, $file_name, $code, $forced);
    }

    /**
     * 将文件生成到项目中
     * @param string $filePath 生成的文件的路劲 xx/xx
     * @param string $fileName 生成的文件的名称 xx.txt
     * @param string $content 文件的内容
     * @param bool $forced 是否强制覆盖现有文件
     * @return void
     */
    private function generateFile(string $filePath, string $fileName, string $content, bool $forced = false) : void
    {
        if (! $content) {
            abort('代码为空，请先生成预览代码');
        }

        $path_file_name = base_path() . "\\{$filePath}\\{$fileName}";

        if (! $forced && file_exists($path_file_name)) {
            abort('文件已存在，是否进行覆盖~', 2);
        }

        // 检测目录是否存在，不存在就创建
        if (! file_exists($filePath)) {
            mkdir($filePath, 0777, true);
        }

        // 开始写入文件
        if (file_put_contents($path_file_name, $content) === FALSE) {
            abort('文件写入失败');
        }
    }
}