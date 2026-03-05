<?php
namespace plugin\region\app\common\service;

use support\Cache;
use plugin\region\app\common\logic\RegionQueryLogic;

/**
 * 省市区
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class RegionService
{
    public function __construct(
        private RegionQueryLogic $regionQueryLogic,
    ) {}
    /**
     * 根据上级获取下级
     * @param int $id
     **/
    public function getList(int $id)
    {
        return $this->regionQueryLogic->getList($id);
    }

    /**
     * 获取所有的省
     **/
    public function getProvince()
    {
        return $this->regionQueryLogic->getProvince();
    }

    /**
     * 获取所有的省市，多维的
     **/
    public function getProvinceCity()
    {
        return $this->regionQueryLogic->getProvinceCity();
    }

    /**
     * 获取所有省市区，多维的
     **/
    public function getListAll()
    {
        return $this->regionQueryLogic->getListAll();
    }

    /**
     * 传入区id，返回省市区3条数据
     * @param int $id
     */
    public function pathInfo(int $id)
    {
        return $this->regionQueryLogic->pathInfo($id);
    }
}