<?php
namespace plugin\admin\app\common\logic\config;

use think\facade\Db;
use support\Cache;
use plugin\admin\app\common\model\ConfigModel;
use plugin\admin\app\common\validate\ConfigValidate;
use plugin\admin\app\common\model\AdminMenuModel;

/**
 * 参数设置
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class ConfigExecuteLogic
{

    /**
     * 添加
     * @param array $params 
     */
    public function create(array $params)
    {
        Db::startTrans();
        try {
            think_validate(ConfigValidate::class)->scene('update_info')->check($params);
            ConfigModel::create($params);

            //要同时往adminMenu表添加数据 才能注入权限管理
            $config = AdminMenuModel::find(50);
            AdminMenuModel::create([
                'title'         => $params['title'],
                'type'          => 7,
                'icon'          => $config->icon,
                'path'          => "/config/{$params['name']}",
                'name'          => "config_{$params['name']}",
                'pid_name'      => $config->name,
                'pid_name_path' => ",{$config->name},config_{$params['name']},",
                'sort'          => $params['sort'] ?? 0,
                'desc'          => $params['description'] ?? null,
            ]);

            Db::commit();
        } catch (\Throwable $e) {
            Db::rollback();
            abort($e->getMessage());
        }
    }

    /**
     * 修改配置数据，这是后台在修改设置的字段等
     * @param array $params
     */
    public function update(array $params)
    {
        Db::startTrans();
        try {
            // 旧的配置name
            $oldName = ConfigModel::where('id', $params['id'])->value('name');

            // 修改本表的数据
            ConfigModel::update($params);

            // 要同时修改adminMenu的数据 才能注入权限管理
            $config      = AdminMenuModel::find(50);
            $adminMenuId = AdminMenuModel::where('name', "config_{$oldName}")->value('id');
            AdminMenuModel::update([
                'id'    => $adminMenuId,
                'title' => $params['title'],
                'type'  => 7,
                'icon'  => $config->icon,
                'path'  => "/config/{$params['name']}",
                'name'  => "config_{$params['name']}",
                // 'pid_name'      => $config->name,
                // 'pid_name_path' => ",{$config->name},config_{$params['name']},",
                // 'sort'          => $params['sort'] ?? 0,
                'desc'  => $params['description'] ?? null,
            ]);

            // 重新更新菜单权限表我下面所有数据的pid_path相关字段
            AdminMenuModel::where('pid_name_path', 'like', "%,config_{$oldName},%")
                ->orderRaw("CHAR_LENGTH(pid_name_path) asc")
                ->field('id,name,pid_name,pid_name_path')
                ->select()
                ->each(function ($item)
                {
                    if ($item['pid_name']) {
                        $pid_data              = AdminMenuModel::where('name', $item['pid_name'])->field('id,pid_name_path')->find();
                        $item['pid_name_path'] = "{$pid_data['pid_name_path']}{$item['name']},";
                    } else {
                        $item['pid_name_path'] = ",{$item['name']},";
                    }
                    $item->save();
                });

            Cache::delete("Config_{$oldName}");

            Db::commit();
        } catch (\Throwable $e) {
            Db::rollback();
            abort($e->getMessage());
        }
    }

    /**
     * 修改配置数据，这是后台在修改设置
     * @param array $params
     */
    public function updateContent(array $params)
    {
        Db::startTrans();
        try {
            ConfigModel::update($params);

            $configName = ConfigModel::where('id', $params['id'])->value('name');
            Cache::delete("Config_{$configName}");

            Db::commit();
        } catch (\Throwable $e) {
            Db::rollback();
            abort($e->getMessage());
        }
    }

    /**
     * 删除配置
     * @param int $id
     */
    public function delete(int $id)
    {
        Db::startTrans();
        try {
            // 配置name
            $configName = ConfigModel::where('id', $id)->value('name');
            Cache::delete("Config_{$configName}");

            // 要同步删除adminMenu的数据
            AdminMenuModel::where('name', "config_{$configName}")->delete();

            // 删除本表的数据
            ConfigModel::destroy($id);

            Db::commit();
        } catch (\Throwable $e) {
            Db::rollback();
            abort($e->getMessage());
        }
    }

    /**
     * 修改排序
     * @param array $params
     */
    public function updateSort(array $params)
    {
        Db::startTrans();
        try {
            $updateData = [];
            foreach ($params as $v) {
                $updateData[] = [
                    'id'   => $v['id'],
                    'sort' => $v['sort'],
                ];
            }
            (new ConfigModel())->saveAll($updateData);

            Db::commit();
        } catch (\Throwable $e) {
            Db::rollback();
            abort($e->getMessage());
        }
    }
}