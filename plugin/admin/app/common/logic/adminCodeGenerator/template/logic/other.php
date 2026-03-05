<?php
    // 生成其它方法
    // 后端控制器的其他方法
    $adminOtherFunction = $data['controller_admin']['other_functions'] ?? [];
    $apiOtherFunction = $data['controller_api']['other_functions'] ?? [];
    $logicOtherFunction = $data['logic']['other_functions'] ?? [];
    $otherFunction = array_merge($adminOtherFunction, $apiOtherFunction, $logicOtherFunction);
    // 合并前后端其它方法后无法去重，只能弄个变量存是否已生成
    $tmpFunctoin = [];

    if (! in_array($logicFolder, ["{$tableNameToCamelCase}QueryLogic", "{$tableNameToCamelCase}ExecuteLogic"])) {
        $otherFunction = [];
    }
    // get 方法就装查询层，其他的干掉
    foreach ($otherFunction as $key => $value) {
        if ($value['method'] == 'post' && $logicFolder == "{$tableNameToCamelCase}QueryLogic") {
            unset($otherFunction[$key]);
        }
        if (! ($value['method'] == 'get' && $logicFolder == "{$tableNameToCamelCase}ExecuteLogic")) {
            unset($otherFunction[$key]);
        }
    }
    
    var_dump($logicFolder);
    var_dump($otherFunction);
    foreach ($otherFunction as $key => $value) {
        // 判断是否生成过
        if (in_array($value['name'], $tmpFunctoin)) {
            continue;
        }
        $tmpFunctoin[] = $value['name'];

        // 如果方法主体内容是批量更新字段
        if (isset($value['function_content']) && $value['function_content'] == 'updateAll') {
            echo "
    /**
     * {$value['title']}
     * @param array \$params
     */
    public function {$value['name']}(array \$params)
    {
        Db::startTrans();
        try {
            // 为了file表记录更新带附件的字段，所以用循环更新没用批量更新,因为批量更新BaseModel里面无法获取每条更新数据的id，导致file表无法记录到附件
            foreach (\$params['ids'] as \$id) {
                {$data['model']['file_name']}::update([
                    'xxx' => \$params['xxx'],
                    'id' => \$id,
                ]);
            }\n";
            
            // 是否有全表缓存
            if (isset($data['logic']['logic_type']) && $data['logic']['logic_type'] == 2) {
                echo "
            // 删除缓存
            Cache::delete(\"{$tableNameToCamelCase}\");
            foreach (\$params['ids'] as \$id) {
                Cache::delete(\"{$tableNameToCamelCase}{\$id}\");
            }";
            }
            
        echo "
            Db::commit();
        } catch (\Throwable \$e) {
            Db::rollback();
            abort(\$e->getMessage());
        }
    }\n";

        } else {
            echo "
    /**
     * {$value['title']}
     * @param array \$params
     */
    public function {$value['name']}(array \$params)
    {
        
    }\n";

        }

    }
?>