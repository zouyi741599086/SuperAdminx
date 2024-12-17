<?php
namespace app\common\logic;

use support\Cache;
use app\common\model\RegionModel;

/**
 * 省市区
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class RegionLogic
{
    /**
     * 根据上级获取下级
     * @param int $id
     **/
    public static function getList(int $id)
    {
        return RegionModel::order('id asc')
            ->field('id,title,pid')
            ->where('pid', $id)
            ->select()
            ->toArray();
    }

    /**
     * 获取所有的省
     **/
    public static function getProvince()
    {
        $list = Cache::get('provinceList');
        if (is_null($list)) {
            $list = RegionModel::order('id asc')
                ->field('id,title,pid')
                ->where('level', 1)
                ->select()
                ->toArray();
            Cache::set('provinceList', $list);
        }
        return $list;
    }

    /**
     * 获取所有的省市，多维的
     **/
    public static function getProvinceCity()
    {
        $list = Cache::get('provinceCityList');
        if (is_null($list)) {
            $list = RegionModel::order('id asc')
                ->field('id,title,pid')
                ->where('level', '<', 3)
                ->select()
                ->toArray();
            $list = self::arrayToTree($list);
            Cache::set('provinceCityList', $list);
        }
        return $list;
    }

    /**
     * 获取所有省市区，多维的
     **/
    public static function getListAll()
    {
        $list = Cache::get('provinceCityAreaList');
        if (is_null($list)) {
            $list = RegionModel::order('id asc')
                ->field('id,title,pid')
                ->select()
                ->toArray();
            $list = self::arrayToTree($list);
            Cache::set('provinceCityAreaList', $list);
        }
        return $list;
    }

    /**
     * 传入区id，返回省市区数据
     * @param int $id
     */
    public static function pathInfo(int $id) : array
    {
        $pid_path = RegionModel::where('id', $id)->value('pid_path');
        return RegionModel::where('id', 'in', $pid_path)
            ->field('id,pid,level,title')
            ->order('level asc')
            ->select();
    }

    /**
     * @ 无限极分类排序组合
     * @ param array $data 要排序组合的数据
     * @ param int $pid 顶级id
     * @ return 返回组合好的多维数组
     */
    private static function arrayToTree($data, $pid = 0, $key = 'children')
    {
        $arr = [];
        foreach ($data as $v) {
            if ($v['pid'] == $pid) {
                $v[$key] = self::arrayToTree($data, $v['id'], $key);
                $arr[]   = $v;
            }
        }
        return $arr;
    }
}