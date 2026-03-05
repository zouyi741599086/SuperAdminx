<?php
namespace plugin\admin\app\common\logic\adminMenu;

use plugin\admin\app\common\model\AdminMenuModel;
use plugin\admin\app\common\validate\AdminMenuValidate;
use think\facade\Db;

/**
 * 后台链接权限模型
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class MenuUpdateLogic
{
   
    /**
     * 修改权限节点
     * @param array $params
     */
    public function update(array $params)
    {
        // 由于前段form会把字段等于null的干掉，所以这要特别加上
        if (!isset($params['pid_name']) || !$params['pid_name']) {
            $params['pid_name'] = null;
        }
        
        try {
            think_validate(AdminMenuValidate::class)->check($params);

            $this->updateMainMenu($params);
        } catch (\Throwable $e) {
            abort($e->getMessage());
        }
    }

    /**
     * 更新主菜单
     * @param array $params
     */
    protected function updateMainMenu(array $params)
    {
        // 原来旧的name
        $oldName = AdminMenuModel::where('id', $params['id'])->value('name');

        AdminMenuModel::update($params);
        AdminMenuModel::where('pid_name', $oldName)->update([
            'pid_name' => $params['name'],
        ]);

        $this->updateChildrenPidNamePath($oldName, $params['name']);
    }

    /**
     * 更新子菜单的PID名称路径
     * @param string $oldName
     * @param string $newName
     */
    protected function updateChildrenPidNamePath(string $oldName, string $newName)
    {
        AdminMenuModel::where('pid_name_path', 'like', "%,{$oldName},%")
            ->orderRaw("CHAR_LENGTH(pid_name_path) asc")
            ->field('id,name,pid_name,pid_name_path')
            ->select()
            ->each(function ($item) {
                $this->updateSinglePidNamePath($item);
            });
    }

    /**
     * 更新单个菜单的PID名称路径
     * @param AdminMenuModel $item
     */
    protected function updateSinglePidNamePath(AdminMenuModel $item)
    {
        if ($item['pid_name']) {
            $pid_data = AdminMenuModel::where('name', $item['pid_name'])->field('id,pid_name_path')->find();
            $item['pid_name_path'] = "{$pid_data['pid_name_path']}{$item['name']},";
        } else {
            $item['pid_name_path'] = ",{$item['name']},";
        }
        $item->save();
    }

}