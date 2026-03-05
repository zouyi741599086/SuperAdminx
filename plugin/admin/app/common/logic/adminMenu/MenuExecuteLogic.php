<?php
namespace plugin\admin\app\common\logic\adminMenu;

use plugin\admin\app\common\model\AdminMenuModel;
use think\facade\Db;

/**
 * 后台链接权限模型
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class MenuExecuteLogic
{
    
    /**
     * 删除权限节点
     * @param array $ids
     */
    public function delete(array $ids)
    {
        AdminMenuModel::where('id', 'in', $ids)
            ->where('id', '<>', 50) // 不能删除50》参数设置，configLogic的增删除改里面要用此id同步到adminMenu表
            ->where('name', "not like", "config_%") // 不能删除参数设置下的 设置
            ->delete();
    }
}