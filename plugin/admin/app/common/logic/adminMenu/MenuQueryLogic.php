<?php
namespace plugin\admin\app\common\logic\adminMenu;

use plugin\admin\app\common\model\AdminMenuModel;
use think\facade\Db;

/**
 * 后台链接权限
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class MenuQueryLogic
{

    /**
     * 获取所有后台权限节点
     * @param array $params 参数
     */
    public function getList(array $params)
    {
        return AdminMenuModel::withSearch(
            ['hidden'],
            $params,
            true,
        )
            ->field('*')
            ->order('sort asc,id desc')
            ->select();
    }

    /**
     * 获取一条数据
     * @param int $id
     */
    public function findData(int $id)
    {
        return AdminMenuModel::find($id);
    }
}