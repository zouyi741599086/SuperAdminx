<?php
namespace plugin\admin\app\common\service;

use plugin\admin\app\common\logic\adminUserShortcutMenu\{ShortcuMenuExecuteLogic, ShortcuMenuQueryLogic};
use think\facade\Db;

/**
 * 用户快捷菜单
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class AdminUserShortcutMenuService
{

    public function __construct(
        private ShortcuMenuQueryLogic $shortcuMenuQueryLogic,
        private ShortcuMenuExecuteLogic $shortcuMenuExecuteLogic,
    ) {}

    /**
     * 列表
     * @param array $params get参数
     * */
    public function getList(array $params = [])
    {
        return $this->shortcuMenuQueryLogic->getList($params);
    }

    /**
     * 获取我的所有的菜单列表
     * @param int $adminUserId 用户id
     */
    public function getMenuList(int $adminUserId)
    {
        return $this->shortcuMenuQueryLogic->getMenuList($adminUserId);
    }

    /**
     * 更新
     * @param int $adminUserId 用户id
     * @param array $adminMenuIds 提交的菜单id
     */
    public function update(int $adminUserId, array $adminMenuIds)
    {
        $this->shortcuMenuExecuteLogic->update($adminUserId, $adminMenuIds);
    }

    /**
     * 修改排序
     * @param int $adminUserId
     * @param array $params
     */
    public function updateSort(int $adminUserId, array $params)
    {
        $this->shortcuMenuExecuteLogic->updateSort($adminUserId, $params);
    }
}