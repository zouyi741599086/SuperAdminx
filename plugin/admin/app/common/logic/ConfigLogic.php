<?php
namespace plugin\admin\app\common\logic;

use think\facade\Db;
use support\Cache;
use plugin\admin\app\common\model\ConfigModel;
use plugin\admin\app\common\validate\ConfigValidate;
use plugin\admin\app\common\model\AdminMenuModel;
use app\utils\ArrayObjectAccessUtils;

/**
 * 参数设置
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class ConfigLogic
{

    /**
     * 获取列表
     * @param array $params
     */
    public static function getList(array $params)
    {
        return ConfigModel::withSearch(['type', 'name', 'title'], $params)
            ->withoutField('content,fields_config')
            ->order('sort asc,id desc')
            ->paginate($params['pageSize'] ?? 20);
    }

    /**
     * 添加
     * @param array $params 
     */
    public static function create(array $params)
    {
        Db::startTrans();
        try {
            validate(ConfigValidate::class)->scene('update_info')->check($params);
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
        } catch (\Exception $e) {
            Db::rollback();
            abort($e->getMessage());
        }
    }

    /**
     * 修改配置数据，这是后台在修改设置的字段等
     * @param array $params
     */
    public static function update(array $params)
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
        } catch (\Exception $e) {
            Db::rollback();
            abort($e->getMessage());
        }
    }

    /**
     * 修改配置数据，这是后台在修改设置
     * @param array $params
     */
    public static function updateContent(array $params)
    {
        Db::startTrans();
        try {
            ConfigModel::update($params);

            $configName = ConfigModel::where('id', $params['id'])->value('name');
            Cache::delete("Config_{$configName}");

            Db::commit();
        } catch (\Exception $e) {
            Db::rollback();
            abort($e->getMessage());
        }
    }

    /**
     * 获取一条数据
     * @param int $id
     * @param int $name
     */
    public static function findData(?int $id, ?string $name)
    {
        if ($name) {
            $data = Cache::get("Config_{$name}");
            if (is_null($data)) {
                $data = ConfigModel::where('name', $name)->find();
                Cache::set("Config_{$name}", $data, 86400);
            }
            return $data;
        }
        if ($id) {
            return ConfigModel::find($id);
        }
    }

    /**
     * 删除配置
     * @param int $id
     */
    public static function delete(int $id)
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
        } catch (\Exception $e) {
            Db::rollback();
            abort($e->getMessage());
        }
    }

    /**
     * 获取配置内容
     * @param string $name
     * @param string $resultType 返回结果类型 object|array
     * @return ArrayObjectAccessUtils|array
     */
    public static function getConfig(string $name, string $resultType = 'object') : ArrayObjectAccessUtils|array
    {
        $data = self::findData(null, $name);
        $data = $data['content'] ?? [];
        return $resultType == 'object' ? new ArrayObjectAccessUtils($data) : $data;
    }

    /**
     * 修改排序
     * @param array $params
     */
    public static function updateSort(array $params)
    {
        Db::startTrans();
        try {
            foreach ($params as $v) {
                ConfigModel::update([
                    'id'   => $v['id'],
                    'sort' => $v['sort'],
                ]);
            }

            Db::commit();
        } catch (\Exception $e) {
            Db::rollback();
            abort($e->getMessage());
        }
    }
}