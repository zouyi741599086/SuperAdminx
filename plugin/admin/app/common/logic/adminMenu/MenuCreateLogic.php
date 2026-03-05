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
class MenuCreateLogic
{
    /**
     * 添加权限节点
     * @param array $params 
     */
    public function create(array $params)
    {
        Db::startTrans();
        try {
            think_validate(AdminMenuValidate::class)->check($params);
            $result = AdminMenuModel::create($params);

            $this->updatePidNamePath($result, $params);
            $this->generateAuthNodes($params);
            Db::commit();
        } catch (\Throwable $e) {
            Db::rollback();
            abort($e->getMessage());
        }
    }

    /**
     * 更新PID名称路径
     * @param AdminMenuModel $menu
     * @param array $params
     */
    protected function updatePidNamePath(AdminMenuModel $menu, array $params)
    {
        if (isset($params['pid_name']) && $params['pid_name']) {
            $pid_name_path = AdminMenuModel::where('name', $params['pid_name'])->value('pid_name_path');
            $pid_name_path = "{$pid_name_path}{$menu->name},";
        } else {
            $pid_name_path = ",{$menu->name},";
        }
        
        $menu->pid_name_path = $pid_name_path;
        $menu->save();
    }

    /**
     * 生成下级权限节点
     * @param array $params
     */
    protected function generateAuthNodes(array $params)
    {
        if (!isset($params['auto_auth']) || !$params['auto_auth']) {
            return;
        }

        $authConfigs = $this->getAuthConfigs($params);
        
        foreach ($authConfigs as $authType => $config) {
            if (in_array($authType, $params['auto_auth'])) {
                $this->createAuthNode($params, $config);
            }
        }
    }

    /**
     * 获取权限配置
     * @param array $params
     * @return array
     */
    protected function getAuthConfigs(array $params): array
    {
        $authConfigs = [
            'GetList' => [
                'title' => '只浏览数据',
                'name_suffix' => 'GetList',
                'sort' => 0,
                'type' => 6,
            ],
            'Create' => [
                'title' => '添加',
                'name_suffix' => 'Create',
                'sort' => 1,
                'type' => 6,
                'special_config' => function() use ($params) {
                    return $this->getCreateUpdateConfig($params, 'create');
                }
            ],
            'Update' => [
                'title' => '修改',
                'name_suffix' => 'Update',
                'sort' => 2,
                'type' => 6,
                'special_config' => function() use ($params) {
                    return $this->getCreateUpdateConfig($params, 'update');
                }
            ],
            'Info' => [
                'title' => '查看详情',
                'name_suffix' => 'Info',
                'sort' => 3,
                'type' => 6,
                'special_config' => function() use ($params) {
                    return $this->getInfoConfig($params);
                }
            ],
            'Delete' => [
                'title' => '删除',
                'name_suffix' => 'Delete',
                'sort' => 4,
                'type' => 6,
            ],
            'UpdateSort' => [
                'title' => '修改排序',
                'name_suffix' => 'UpdateSort',
                'sort' => 5,
                'type' => 6,
            ],
            'UpdateStatus' => [
                'title' => '修改状态',
                'name_suffix' => 'UpdateStatus',
                'sort' => 6,
                'type' => 6,
            ],
            'ExportData' => [
                'title' => '导出数据',
                'name_suffix' => 'ExportData',
                'sort' => 7,
                'type' => 6,
            ],
            'ImportData' => [
                'title' => '导入数据',
                'name_suffix' => 'ImportData',
                'sort' => 8,
                'type' => 6,
            ],
        ];

        return $authConfigs;
    }

    /**
     * 获取创建/更新配置
     * @param array $params
     * @param string $type
     * @return array
     */
    protected function getCreateUpdateConfig(array $params, string $type): array
    {
        $config = [];
        
        if (isset($params['auto_auth_create_update_type']) && $params['auto_auth_create_update_type'] == 2) {
            $config = [
                'type' => 5,
                'path' => "{$params['path']}/{$type}",
                'component_path' => "{$params['path']}/{$type}",
                'is_params' => $type === 'create' ? 1 : 2,
            ];
        }
        
        return $config;
    }

    /**
     * 获取详情配置
     * @param array $params
     * @return array
     */
    protected function getInfoConfig(array $params): array
    {
        $config = [];
        
        if (isset($params['auto_auth_info_type']) && $params['auto_auth_info_type'] == 2) {
            $config = [
                'type' => 5,
                'path' => "{$params['path']}/info",
                'component_path' => "{$params['path']}/info",
                'is_params' => 2,
            ];
        }
        
        return $config;
    }

    /**
     * 创建权限节点
     * @param array $params
     * @param array $config
     */
    protected function createAuthNode(array $params, array $config)
    {
        $nodeData = [
            'title' => $config['title'],
            'name' => "{$params['name']}{$config['name_suffix']}",
            'sort' => $config['sort'],
            'type' => $config['type'],
            'pid_name' => $params['name'],
        ];

        // 处理特殊配置
        if (isset($config['special_config']) && is_callable($config['special_config'])) {
            $specialConfig = $config['special_config']();
            if (!empty($specialConfig)) {
                $nodeData = array_merge($nodeData, $specialConfig);
            }
        }

        // 使用递归调用创建节点（原代码逻辑）
        $this->create($nodeData);
    }

}