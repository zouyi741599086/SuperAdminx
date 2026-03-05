<?php
namespace plugin\admin\app\common\logic\config;

use support\Cache;
use plugin\admin\app\common\model\ConfigModel;
use app\utils\ArrayObjectAccessUtils;

/**
 * 参数设置
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class ConfigQueryLogic
{
    /**
     * 获取列表
     * @param array $params
     */
    public function getList(array $params)
    {
        return ConfigModel::withSearch(
            ['type', 'name', 'title'],
            $params,
            true,
        )
            ->withoutField('content,fields_config')
            ->order('sort asc,id desc')
            ->paginate($params['pageSize'] ?? 20);
    }

    /**
     * 获取一条数据
     * @param int $id
     * @param int $name
     * @return array
     */
    public function findData(?int $id, ?string $name) : array
    {
        if ($name) {
            $data = Cache::get("Config_{$name}");
            if (is_null($data)) {
                $data = ConfigModel::where('name', $name)->find()->toArray();
                Cache::set("Config_{$name}", $data, 86400);
            }
            return $data;
        }
        if ($id) {
            return ConfigModel::find($id)->toArray();
        }
    }

    /**
     * 获取配置内容
     * @param string $name
     * @param string $resultType 返回结果类型 object|array
     * @return ArrayObjectAccessUtils|array
     */
    public function getConfig(string $name, string $resultType = 'object') : ArrayObjectAccessUtils|array
    {
        $data = self::findData(null, $name);
        $data = $data['content'] ?? [];
        return $resultType == 'object' ? new ArrayObjectAccessUtils($data) : $data;
    }

}