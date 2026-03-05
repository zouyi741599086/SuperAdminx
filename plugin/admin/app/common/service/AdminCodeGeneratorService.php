<?php
namespace plugin\admin\app\common\service;

use plugin\admin\app\common\logic\adminCodeGenerator\{DataBaseLogic, CodeGeneratorQueryLogic, CodeGeneratorExecuteLogic, GeneratorCodeLogic, GeneratorFileLogic};

/**
 * 代码生成
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class AdminCodeGeneratorService
{

    // 此控制器是否需要登录
    protected $onLogin = true;
    // 不需要登录的方法
    protected $noNeedLogin = [];
    // 不需要加密的方法
    protected $noNeedEncrypt = [];

    public function __construct(
        private DataBaseLogic $dataBaseLogic,
        private CodeGeneratorQueryLogic $codeGeneratorQueryLogic,
        private CodeGeneratorExecuteLogic $codeGeneratorExecuteLogic,
        private GeneratorCodeLogic $generatorCodeLogic,
        private GeneratorFileLogic $generatorFileLogic,
    ) {}

    /**
     * 获取数据库的设置
     * @return array
     */
    public function getMysqlConfig() : array
    {
        return $this->dataBaseLogic->getMysqlConfig();
    }

    /**
     * 获取所有表
     * @return array
     */
    public function getTableList() : array
    {
        return $this->dataBaseLogic->getTableList();
    }

    /**
     * 获取所有的表以及每个表的所有的列
     * @return array
     */
    public function getTableColumnList() : array
    {
        return $this->dataBaseLogic->getTableColumnList();
    }

    /**
     * 获取单表详情：创建时间、数据量、存储引擎等
     * @param string $tableName 表名
     * @return array
     */
    public function getTableInfo(string $tableName) : array
    {
        return $this->dataBaseLogic->getTableInfo($tableName);
    }

    /**
     * 获取某个表的列
     * @param string $tableName
     * @return array
     */
    public function getTableColumn(string $tableName) : array
    {
        return $this->dataBaseLogic->getTableColumn($tableName);
    }

    /**
     * 获取代码生成器设置的详情
     * @param string $tableName 
     * @return mixed
     */
    public function findData(string $tableName) : mixed
    {
        return $this->codeGeneratorQueryLogic->findData($tableName);
    }

    /**
     * 更新代码生成器设置，有则更新，没得则创建
     * @param string $tableName 表名
     * @param array $params 
     * @return void
     */
    public function update(string $tableName, array $params) : void
    {
        $this->codeGeneratorExecuteLogic->update($tableName, $params);
    }

    /**
     * 生成代码
     * @param array $params 表AdminCodeGenerator的数据
     * @return array
     */
    public function generatorCode(array $params) : array
    {
        return $this->generatorCodeLogic->generatorCode($params);
    }

    /**
     * 生成代码到项目中
     * @param string $tableName 操作的表
     * @param string $name 操作的代码，如 validate model controller
     * @param bool $forced 生成代码到项目中的时候是否强制覆盖现有文件
     * @return void
     */
    public function operationFile(string $tableName, string $name, bool $forced = false) : void
    {
        $this->generatorFileLogic->operationFile($tableName, $name, $forced);
    }
}
