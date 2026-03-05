<?php
namespace plugin\admin\app\common\logic\adminCodeGenerator;

use plugin\admin\app\common\logic\adminCodeGenerator\{CodeGeneratorQueryLogic, CodeGeneratorExecuteLogic, DataBaseLogic, CodeGeneratorUtilLogic};

/**
 * 代码生成器
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class GeneratorCodeLogic
{
    public function __construct(
        private CodeGeneratorQueryLogic $codeGeneratorQueryLogic,
        private CodeGeneratorExecuteLogic $codeGeneratorExecuteLogic,
        private DataBaseLogic $dataBaseLogic,
    ) {}

    /**
     * 生成代码
     * @param array $params 表AdminCodeGenerator的数据
     * @return array
     */
    public function generatorCode(array $params) : array
    {
        // 先把设置保存下
        $this->codeGeneratorExecuteLogic->update($params['table_name'], $params);

        // 带入模板中要使用的变量
        $data = $this->codeGeneratorQueryLogic->findData($params['table_name']);
        if (! $data) {
            abort('请先设置此表的字段名称');
        }

        // 如果是生成逻辑层
        if ($params['code_name'] == 'logic') {
            $this->generatorLogicCode($params, $data);
        }
        // 如果是生成前端react的新增/更新页面
        else if ($params['code_name'] == 'react_create_update') {
            $this->generatorReactCreateUpdateCode($params);
        }
        // 如果是生成react的列表页面 
        else if ($params['code_name'] == 'react_list') {
            $this->generatorReactListCode($params);
        } else {
            $params["{$params['code_name']}_code"] = $this->templateRender($params['table_name'], $params['code_name'], $params[$params['code_name']]['file_suffix']);
        }

        // 再次保存生成的代码
        $this->codeGeneratorExecuteLogic->update($params['table_name'], $params);
        return $params;
    }

    /**
     * 生成logic的时候
     * @param array $params
     * @param object $data 表AdminCodeGenerator的数据
     * @return void
     */
    private function generatorLogicCode(array &$params, object $data)
    {
        // 一共有哪些方法
        $controllerAdminFunction = $data->controller_admin['functions'] ?? [];
        $controllerApiFunction   = $data->controller_api['functions'] ?? [];
        $logicFunction           = array_unique(array_merge($controllerAdminFunction, $controllerApiFunction));

        $tableNameToCamelCase = CodeGeneratorUtilLogic::toCamelCase($data->table_name);

        // 需要引入的逻辑层
        $logic = [];
        foreach ($logicFunction as $value) {
            $logicName = '';
            if (in_array($value, ['getList', 'findData', 'select'])) {
                $logicName = "{$tableNameToCamelCase}QueryLogic";
            }
            if (in_array($value, ['create', 'update', 'delete', 'updateSort', 'updateStatus'])) {
                $logicName = "{$tableNameToCamelCase}ExecuteLogic";
            }
            if (in_array($value, ['importData'])) {
                $logicName = "{$tableNameToCamelCase}ImportLogic";
            }
            if (in_array($value, ['exportData'])) {
                $logicName = "{$tableNameToCamelCase}ExportLogic";
            }
            $logic[$logicName][] = $value;
        }

        // 生成其它方法，全部找出来判断get还是post，当没得查询层跟修改层的时候强制包含这两个层
        $adminOtherFunction = $data->controller_admin['other_functions'] ?? [];
        $apiOtherFunction   = $data->controller_api['other_functions'] ?? [];
        $otherFunction      = array_merge($adminOtherFunction, $apiOtherFunction);
        foreach ($otherFunction as $value) {
            $logicName = '';
            if ($value['method'] == 'get') {
                $logicName = "{$tableNameToCamelCase}QueryLogic";
            }
            if ($value['method'] == 'post') {
                $logicName = "{$tableNameToCamelCase}ExecuteLogic";
            }
            $logic[$logicName][] = '';
        }

        // 生成代码
        foreach ($logic as $logicFolder => $logicFunctions) {
            $params["logic_code"][$logicFolder] = $this->templateRender($params['table_name'], $params['code_name'], $params[$params['code_name']]['file_suffix'], logicFolder: $logicFolder, logicFunctions: $logicFunctions);
        }
    }

    /**
     * 生成react_create_update的时候
     * @param array $params
     * @return void
     */
    private function generatorReactCreateUpdateCode(array &$params)
    {
        // 生成新增页面代码
        $params["react_create_code"] = $this->templateRender($params['table_name'], 'react_create', $params['react_create_update']['file_suffix']);

        // 是否需要生成更新页面
        if ($params['react_create_update']['update_page'] == 1) {
            $params["react_update_code"] = $this->templateRender($params['table_name'], 'react_update', $params['react_create_update']['file_suffix']);
        }

        // 生成form的字段组件，因为form可能是多标签Tab的，所以form的代码会生成N个组件，不管生成1个还是多少，key必须从1开始
        if (isset($params['react_create_update']['card_tab_list']) && is_array($params['react_create_update']['card_tab_list'])) {
            for ($i = 1; $i <= count($params['react_create_update']['card_tab_list']); $i++) {
                $params['react_form_code'][$i] = $this->templateRender($params['table_name'], 'react_form', $params['react_create_update']['file_suffix'], $i);
            }
        } else {
            $params['react_form_code']['1'] = $this->templateRender($params['table_name'], 'react_form', $params['react_create_update']['file_suffix']);
        }
    }

    /**
     * 生成react_list的时候
     * @param array $params
     * @return void
     */
    private function generatorReactListCode(array &$params)
    {
        // 如果有导入操作，则需要生成导入的组件
        if (
            isset($params['react_list']['table_action_list']) &&
            $params['react_list']['table_action_list'] &&
            in_array('import', $params['react_list']['table_action_list'])
        ) {
            $params["react_list_component_code"]['importData'] = $this->templateRender($params['table_name'], 'react_list_table_import', $params['react_list']['file_suffix']);
        }
        // 如果有生成其它批量修改字段，则生成对应的修改弹窗
        if (
            isset($params['react_list']['table_action_all_list']) &&
            $params['react_list']['table_action_all_list']
        ) {
            foreach ($params['react_list']['table_action_all_list'] as $k => $v) {
                $tmp = CodeGeneratorUtilLogic::toCamelCase($v['field']);
                // 开始生成批量修改的弹窗
                $params["react_list_component_code"]["update{$tmp}"] = $this->templateRender($params['table_name'], 'react_list_table_allUpdate', $params['react_list']['file_suffix'], $k);
            }
        }
        $params["react_list_code"] = $this->templateRender($params['table_name'], 'react_list', $params['react_list']['file_suffix']);
    }

    /**
     * 生成代码
     * @param string $tableName 表名
     * @param string $codeName 生成代码的名称同时也是模板的名称，如 validate model controller等
     * @param string $suffix 生成的文件后缀，如 php jsx
     * @param ?int $generatorIndex 创建和修改页面的时候，如果是多标签Tab的form的时候，生成哪个表单的索引，如果是生成后端reactList》批量修改字段的时候，修改的是react_list》table_action_all_list哪个的索引
     * @param array $logicFolder 生成逻辑层的时候，生成的类名
     * @param array $logicFunctions 生成逻辑层的时候，生成的函数名
     * @return string 
     */
    private function templateRender(string $tableName, string $codeName, string $suffix, ?int $generatorIndex = null, ?string $logicFolder = null, array $logicFunctions = []) : string
    {
        // 生成代码需要用到的变量
        $data        = $this->codeGeneratorQueryLogic->findData($tableName)->toArray();
        $tableColumn = $this->dataBaseLogic->getTableColumn($tableName);

        ob_start();
        try {
            include __DIR__ . "/template/{$codeName}/{$codeName}.{$suffix}.stub";
        } catch (\Throwable $e) {
            ob_end_clean();
            throw $e;
        }
        if ($suffix == 'php') {
            return "<?php\n" . ob_get_clean();
        }
        return ob_get_clean();
    }
}