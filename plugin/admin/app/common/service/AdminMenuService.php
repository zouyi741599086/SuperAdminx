<?php
namespace plugin\admin\app\common\service;

use plugin\admin\app\common\logic\adminMenu\{MenuQueryLogic , MenuExecuteLogic, MenuCreateLogic, MenuUpdateLogic};

/**
 * 后台链接权限模型
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class AdminMenuService
{

    public function __construct(
        private MenuQueryLogic $menuQueryLogic,
        private MenuExecuteLogic $menuExecuteLogic,
        private MenuCreateLogic $menuCreateLogic,
        private MenuUpdateLogic $menuUpdateLogic,
    ) {}

    /**
     * 获取所有后台权限节点
     * @param array $params 参数
     */
    public function getList(array $params)
    {
        return $this->menuQueryLogic->getList($params);
    }

    /**
     * 添加权限节点
     * @param array $params 
     */
    public function create(array $params)
    {
        $this->menuCreateLogic->create($params);
    }

    /**
     * 修改权限节点
     * @param array $params
     */
    public function update(array $params)
    {
        $this->menuUpdateLogic->update($params);
    }

    /**
     * 获取一条数据
     * @param int $id
     */
    public function findData(int $id)
    {
        return $this->menuQueryLogic->findData($id);
    }

    /**
     * 删除权限节点
     * @param array $ids
     */
    public function delete(array $ids)
    {
        $this->menuExecuteLogic->delete($ids);
    }
}