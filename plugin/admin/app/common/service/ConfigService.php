<?php
namespace plugin\admin\app\common\service;

use think\facade\Db;
use support\Cache;
use plugin\admin\app\common\logic\config\{ConfigExecuteLogic,ConfigQueryLogic};
use app\utils\ArrayObjectAccessUtils;

/**
 * 参数设置
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class ConfigService
{

    public function __construct(
        private ConfigExecuteLogic $configExecuteLogic,
        private ConfigQueryLogic $configQueryLogic
    ) {}
    
    /**
     * 获取列表
     * @param array $params
     */
    public function getList(array $params)
    {
        return $this->configQueryLogic->getList($params);
    }

    /**
     * 添加
     * @param array $params 
     */
    public function create(array $params)
    {
        $this->configExecuteLogic->create($params);
    }

    /**
     * 修改配置数据，这是后台在修改设置的字段等
     * @param array $params
     */
    public function update(array $params)
    {
        $this->configExecuteLogic->update($params);
    }

    /**
     * 修改配置数据，这是后台在修改设置
     * @param array $params
     */
    public function updateContent(array $params)
    {
        $this->configExecuteLogic->updateContent($params);
    }

    /**
     * 获取一条数据
     * @param int $id
     * @param int $name
     */
    public function findData(?int $id, ?string $name)
    {
        return $this->configQueryLogic->findData($id, $name);
    }

    /**
     * 删除配置
     * @param int $id
     */
    public function delete(int $id)
    {
        $this->configExecuteLogic->delete($id);
    }

    /**
     * 获取配置内容
     * @param string $name
     * @param string $resultType 返回结果类型 object|array
     * @return ArrayObjectAccessUtils|array
     */
    public function getConfig(string $name, string $resultType = 'object') : ArrayObjectAccessUtils|array
    {
        return $this->configQueryLogic->getConfig($name, $resultType);
    }

    /**
     * 修改排序
     * @param array $params
     */
    public function updateSort(array $params)
    {
        $this->configExecuteLogic->updateSort($params);
    }
}