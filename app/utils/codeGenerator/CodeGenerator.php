<?php
namespace app\utils\codeGenerator;

use think\facade\Db;
use app\common\model\AdminCodeGeneratorModel;
use app\common\model\AdminMenuModel;
use support\Response;

/**
 * 代码生成器
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 */
class CodeGenerator
{

    /**
     * 获取所有的表
     * @return array
     */
    public static function getTableList() : array
    {
        return Db::query("show table status");
    }

    /**
     * 获取所有的表以及每个表的所有的列
     * @return array
     */
    public static function getTableColumnList() : array
    {
        $database = getenv('DB_NAME');
        return Db::query("SELECT TABLE_SCHEMA AS 'Database', TABLE_NAME AS 'Table', COLUMN_NAME AS 'Column' FROM information_schema.columns WHERE TABLE_SCHEMA = '{$database}' ORDER BY TABLE_NAME,ORDINAL_POSITION");
    }

    /**
     * 获取某个表的详情
     * @param string $table_name 表名，如 sa_admin_user
     * @return array
     */
    public static function getTableInfo(string $table_name) : array
    {
        $list = Db::query("show table status where name=:table_name", ['table_name' => $table_name]);
        return $list[0] ?? [];
    }

    /**
     * 获取某个表的列
     * @param string $table_name
     * @return array
     */
    public static function getTableColumn(string $table_name) : array
    {
        $list = Db::query("SHOW FULL COLUMNS FROM `{$table_name}`");

        // 如果此表有添加一些额外的字段，需要压进去，还需要将字段设置的中文名称压进去
        $data = self::getCodeGeneratorInfo($table_name);
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
                        'delete'      => 1
                    ];
                }
            }
        }
        return $list;
    }

    /**
     * 获取代码生成器设置的详情
     * @param string $table_name 
     * @return mixed
     */
    public static function getCodeGeneratorInfo(string $table_name) : mixed
    {
        return AdminCodeGeneratorModel::where('table_name', $table_name)->find();
    }

    /**
     * 更新代码生成器设置，有则更新，没得则创建
     * @param array $params 
     * @return void
     */
    public static function updateCodeGenerator(array $params) : void
    {
        $id = AdminCodeGeneratorModel::where('table_name', $params['table_name'])->value('id');
        if ($id) {
            $params['id'] = $id;
            AdminCodeGeneratorModel::update($params);
        } else {
            AdminCodeGeneratorModel::create($params);
        }
    }

    /**
     * 字符串转驼峰会自动去掉表前缀
     * @param string $string 要转的字符串 如 sa_admin_user 转换成AdminUser
     * @param bool $letter 首字母是否小写 如sa_admin_user 转换成 adminUser
     * @return string
     */
    public static function toCamelCase(string $string, bool $letter = false) : string
    {
        // 去除表前缀
        $dbPrefix = getenv('DB_PREFIX');
        if (strpos($string, $dbPrefix) === 0) {
            $string = substr($string, strlen($dbPrefix)); // 从索引3开始截取，因为'sa_'长度为3  
        }
        // 使用空格替换字符串中的下划线  
        $string = str_replace('_', ' ', $string);
        // 使用ucwords函数将字符串中的每个单词首字母转换为大写  
        $string = ucwords($string);
        // 将空格替换为空，实现驼峰命名  
        $string = str_replace(' ', '', $string);
        return $letter ? lcfirst($string) : $string;
    }

    /**
     * 生成代码
     * @param array $params 表AdminCodeGenerator的数据
     * @param string $code_name 生成的代码名称也是模板的名称如 validate model 
     * @return array
     */
    public static function generatorCode(array $params, string $code_name) : array
    {
        // 带入模板中要使用的变量
        $data = self::getCodeGeneratorInfo($params['table_name']);
        if (! $data) {
            abort('请先设置此表的字段名称');
        }
        $vars                 = $params[$code_name]; // 生成的xx代码需要的配置
        $vars['table_name']   = $params['table_name']; // 表名
        $vars['field_title']  = $data->field_title; // 字段的中文名
        $vars['table_title']  = $data->table_title; // 表的中文名
        $vars['plugin_name']  = $data->plugin_name; // 插件名称
        $vars['table_column'] = self::getTableColumn($params['table_name']); // 表的列

        // 如果是生成前端react的新增/更新页面
        if ($code_name == 'react_create_update') {
            // 生成新增页面代码
            $params["react_create_code"] = self::templateRender('react_create', $vars, $params[$code_name]['file_suffix']);

            // 是否需要生成更新页面
            if ($params[$code_name]['update_page'] == 1) {
                $params["react_update_code"] = self::templateRender('react_update', $vars, $params[$code_name]['file_suffix']);
            }

            // 生成form的字段组件，因为form可能是多标签Tab的，所以form的代码会生成N个组件
            $card_tab_list_count = 1; //生成form的个数
            if ($vars['open_type'] == 2 && isset($vars['card_tab_list']) && count($vars['card_tab_list']) > 0) {
                $card_tab_list_count = count($vars['card_tab_list']);
            }
            for ($i = 1; $i <= $card_tab_list_count; $i++) {
                // 如整个form共10个字段，找出每个form要生成的字段，其它的不要带进去
                $vars['form_fields_type_config'] = $params[$code_name]['form_fields_type_config'] ?? [];
                $vars['form_fileds_type']        = $params[$code_name]['form_fileds_type'] ?? [];
                foreach ($vars['form_fields_type_config'] as $k => $v) {
                    if (isset($v['field_to_tab']) && $v['field_to_tab'] != $i) {
                        unset($vars['form_fields_type_config'][$k]);
                        if (isset($vars['form_fileds_type'][$k])) {
                            unset($vars['form_fileds_type'][$k]);
                        }
                    }
                }
                $params['react_form_code'][$i] = self::templateRender('react_form', $vars, $params[$code_name]['file_suffix']);
            }
        }
        // 如果是生成react的列表页面 
        else if ($code_name == 'react_list') {
            // 如果有导入操作，则需要生成导入的组件
            if (
                isset($vars['table_action_list']) &&
                $vars['table_action_list'] &&
                in_array('import', $vars['table_action_list'])
            ) {
                $params["react_list_component_code"]['importData'] = self::templateRender('react_list_table_import', $vars, $params[$code_name]['file_suffix']);
            }
            // 如果有生成其它批量修改字段，则生成对应的修改弹窗
            if (
                isset($vars['table_action_all_list']) &&
                $vars['table_action_all_list']
            ) {
                foreach ($vars['table_action_all_list'] as $k => $v) {
                    $tmp = self::toCamelCase($v['field']);
                    // 当前正在生成的字段的名称
                    $vars['tmp_table_action_all_update_field'] = $v['field'];
                    // 当前正在生成的批量操作的权限id
                    $vars['tmp_table_action_all_update_auth_id'] = $v['update_field_auth_id'];
                    // 开始生成批量修改的弹窗
                    $params["react_list_component_code"]["update{$tmp}"] = self::templateRender('react_list_table_allUpdate', $vars, $params[$code_name]['file_suffix']);
                }
            }
            $params["{$code_name}_code"] = self::templateRender($code_name, $vars, $params[$code_name]['file_suffix']);
        } else {
            $params["{$code_name}_code"] = self::templateRender($code_name, $vars, $params[$code_name]['file_suffix']);
        }

        // 更新到表中保存
        self::updateCodeGenerator($params);
        return $params;
    }

    /**
     * 生成代码
     * @param string $code_name 生成代码的名称同时也是模板的名称，如 validate model controller等
     * @param array $vars 模板中需要使用的变量
     * @param string $suffix 生成的文件后缀，如 php jsx
     * @return string 
     */
    private static function templateRender(string $code_name, array $vars, string $suffix) : string
    {
        extract($vars);
        ob_start();
        try {
            include __DIR__ . "/template/{$code_name}.{$suffix}.stub";
        } catch (\Exception $e) {
            ob_end_clean();
            throw $e;
        }
        if ($suffix == 'php') {
            return "<?php\n" . ob_get_clean();
        }
        return ob_get_clean();
    }

    /**
     * 生成代码到项目中
     * @param string $table_name 操作的表
     * @param string $name 操作的代码，如 validate model controller
     * @param bool $forced 生成代码到项目中的时候是否强制覆盖现有文件
     * @return Response|null
     */
    public static function operationFile(string $table_name, string $name, bool $forced = false)
    {
        // 数据库中此表的设置信息
        $data = self::getCodeGeneratorInfo($table_name);
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

        // 如果是新增更新页面，则要生成两个文件
        if ($name == 'react_create_update') {
            // 从列表页的权限id，找生成的目录
            $adminMenu = AdminMenuModel::where('name', self::toCamelCase($table_name, true))->find();
            if (! $adminMenu) {
                abort('未设置列表页权限节点，无法找到生成目录~');
            }

            // 生成新增页面的代码
            $file_path = "public\admin_react\src\pages{$adminMenu->component_path}\create";
            self::generateFile($file_path, $file_name, $data['react_create_code'], $forced);

            // 是否需要更新页面
            if ($data[$name]['update_page'] == 1) {
                $file_path = "public\admin_react\src\pages{$adminMenu->component_path}\update";
                self::generateFile($file_path, $file_name, $data['react_update_code'], $forced);
            }

            // 生成表单字段的代码，可能是多标签tab的form会多个form的字段组件
            $file_path = "public\admin_react\src\pages{$adminMenu->component_path}\component";
            foreach ($data['react_form_code'] as $k => $v) {
                self::generateFile($file_path, "form{$k}.jsx", $v, $forced);
            }
        }
        // 如果生成的是前端的详情页面
        else if ($name == "react_info") {
            // 详情的权限id，从这找生成的目录
            $adminMenu = AdminMenuModel::where('name', self::toCamelCase($table_name, true))->find();
            if (! $adminMenu || ! $adminMenu['component_path']) {
                abort('未设置列表页权限节点，无法找到生成目录~');
            }

            // 开始生成代码并保存
            $file_path = "public\admin_react\src\pages{$adminMenu->component_path}\info";
            self::generateFile($file_path, $file_name, $data['react_info_code'], $forced);

        }
        // 如果生成的是前端的列表
        else if ($name == "react_list") {
            // 列表的权限id，从这找生成的目录
            $adminMenu = AdminMenuModel::where('name', self::toCamelCase($table_name, true))->find();
            if (! $adminMenu || ! $adminMenu['component_path']) {
                abort('未设置列表页权限节点，无法找到生成目录~');
            }

            // 开始生成代码并保存
            $file_path = "public\admin_react\src\pages{$adminMenu->component_path}";
            self::generateFile($file_path, $file_name, $data['react_list_code'], $forced);

            // 如果有生成其它组件，如批量导入、
            if (
                $data['react_list_component_code'] &&
                is_array($data['react_list_component_code']) &&
                count($data['react_list_component_code']) > 0
            ) {
                foreach ($data['react_list_component_code'] as $k => $v) {
                    self::generateFile($file_path, "{$k}.jsx", $v, $forced);
                }
            }

        }
        // 如果生成的是后端的其它组件
        else if ($name == "react_other") {

            // 生成的是搜索选择数据组件
            if ($data['react_other']['component_type'] == 'select') {
                $file_path = "public\admin_react\src\components";
                $file_name = 'select' . self::toCamelCase($table_name) . '.jsx';
            }

            // 生成的是弹窗form
            if ($data['react_other']['component_type'] == 'modalForm') {
                $file_path = $data['react_other']['modal_form_file_path'];
                $file_name = $data['react_other']['modal_form_file_name'];
            }

            // 生成的是弹窗table
            if ($data['react_other']['component_type'] == 'modalTable') {
                $file_path = $data['react_other']['modal_table_file_path'];
                $file_name = $data['react_other']['modal_table_file_name'];
            }

            self::generateFile($file_path, $file_name, $code, $forced);

        } else {
            self::generateFile($config['file_path'], $file_name, $code, $forced);
        }
    }

    /**
     * 将文件生成到项目中
     * @param string $file_path 生成的文件的路劲 xx/xx
     * @param string $file_name 生成的文件的名称 xx.txt
     * @param string $content 文件的内容
     * @param bool $forced 是否强制覆盖现有文件
     * @return void
     */
    private static function generateFile(string $file_path, string $file_name, string $content, bool $forced = false) : void
    {
        if (! $content) {
            abort('代码为空，请先生成预览代码');
        }

        $path_file_name = base_path() . "\\{$file_path}\\{$file_name}";

        if (! $forced && file_exists($path_file_name)) {
            abort('文件已存在，是否进行覆盖~', 2);
        }

        // 检测目录是否存在，不存在就创建
        if (! file_exists($file_path)) {
            mkdir($file_path, 0777, true);
        }

        // 开始写入文件
        if (file_put_contents($path_file_name, $content) === FALSE) {
            abort('文件写入失败');
        }
    }

    /**
     * 通过反射获取类所有自己的方法，非继承的方法
     * @param string $className 如 app\admin\controller\AdminUser
     * @return array
     */
    private static function getOwnMethods(string $className) : array
    {
        $reflectedClass = new \ReflectionClass($className);
        $ownMethods     = [];

        // 获取当前类的所有方法  
        $methods = $reflectedClass->getMethods(\ReflectionMethod::IS_PUBLIC | \ReflectionMethod::IS_PROTECTED | \ReflectionMethod::IS_PRIVATE);
        // 如果当前类有父类，获取父类的所有方法  
        $parentClass = $reflectedClass->getParentClass();
        if ($parentClass) {
            $parentMethods = $parentClass->getMethods(\ReflectionMethod::IS_PUBLIC | \ReflectionMethod::IS_PROTECTED | \ReflectionMethod::IS_PRIVATE);
            // 过滤掉继承的方法  
            foreach ($methods as $method) {
                $own = true;
                foreach ($parentMethods as $parentMethod) {
                    if ($method->getName() === $parentMethod->getName()) {
                        $own = false;
                        break;
                    }
                }
                if ($own) {
                    $ownMethods[] = $method;
                }
            }
        } else {
            // 如果没有父类，则所有方法都是自己定义的  
            $ownMethods = $methods;
        }
        return $ownMethods;
    }

    /**
     * 从方法的注释中提取内容
     * @param string $docComment 方法的注释
     * @param string $type 提取的内容，如title method等
     * @return mixed
     */
    private static function getMethodsDocComment(string $docComment, string $type)
    {
        // 移除开头的'/**'和结尾的'*/'，以便更容易地按行分割  
        $docComment = trim($docComment, "/*");
        // 按行分割字符串  
        $docComment = explode("\n", $docComment);

        //获取注释的标题
        if ($type == 'title') {
            // 假设第二行总是包含我们想要的中文内容  
            if (! empty($docComment[1])) {
                $title = str_replace('@log', '', $docComment[1]);
                $title = ltrim(trim($title), '*');
                return trim($title);
            }
        }

        //获取请求的类型
        if ($type == 'method') {
            // 遍历每一行来查找包含'@method'的行  
            $method = null;
            foreach ($docComment as $line) {
                // 使用正则表达式查找'@method'后跟一个或多个空格，然后是请求类型（直到行尾或遇到非字母字符）  
                if (preg_match('/@method\s+(\w+)/', $line, $matches)) {
                    $method = $matches[1]; // $matches[1]是捕获组，包含请求类型（如'post'）  
                    break; // 找到后退出循环  
                }
            }
            return $method;
        }
    }

}