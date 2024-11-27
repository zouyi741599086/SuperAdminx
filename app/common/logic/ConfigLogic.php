<?php
namespace app\common\logic;

use think\facade\Db;
use Shopwwi\LaravelCache\Cache;
use app\common\model\ConfigModel;
use app\common\validate\ConfigValidate;
use app\common\model\AdminMenuModel;

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
     */
    public static function getList()
    {
        return ConfigModel::withoutField('content,fields_config,description')
            ->order('sort asc,id desc')
            ->select();
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
            //旧的配置name
            $oldName = ConfigModel::where('id', $params['id'])->value('name');

            //修改本表的数据
            ConfigModel::update($params);

            //要同时修改adminMenu的数据 才能注入权限管理
            $config      = AdminMenuModel::find(50);
            $adminMenuId = AdminMenuModel::where('name', "config_{$oldName}")->value('id');
            AdminMenuModel::update([
                'id'            => $adminMenuId,
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
     * 修改配置数据，这是后台在修改设置
     * @param array $params
     */
    public static function updateContent(array $params)
    {
        Db::startTrans();
        try {
            ConfigModel::update($params);

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
            return ConfigModel::where('name', $name)->find();
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
            //旧的配置name
            $oldName = ConfigModel::where('id', $id)->value('name');

            //修改本表的数据
            ConfigModel::destroy($id);

            //要同步删除adminMenu的数据
            AdminMenuModel::where('name', "config_{$oldName}")->delete();

            Db::commit();
        } catch (\Exception $e) {
            Db::rollback();
            abort($e->getMessage());
        }
    }

    /**
     * 获取配置内容
     * @param string $name
     */
    public static function getConfig(int $name)
    {
        $data = ConfigModel::where('name', $name)->find();
        return $data['content'] ?? [];
    }

    /**
     * 修改排序
     * @param array $params
     */
    public static function updateSort(array $params)
    {
        Db::startTrans();
        try {
            foreach ($params as $k => $v) {
                ConfigModel::update([
                    'id'   => $v['id'],
                    'sort' => $v['sort'],
                ]);

                //要同步删除adminMenu的数据的排序
                $name = ConfigModel::where('id', $v['id'])->value('name');
                AdminMenuModel::where('name', "config_{$name}")->update([
                    'sort' => $v['sort']
                ]);
            }

            Db::commit();
        } catch (\Exception $e) {
            Db::rollback();
            abort($e->getMessage());
        }
    }
}