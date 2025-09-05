<?php
namespace plugin\region\app\admin\controller;

use support\Request;
use support\Response;
use plugin\region\app\common\logic\RegionLogic;

/**
 * 省市区
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class Region
{
    // 此控制器是否需要登录
    protected $onLogin = false;
    // 不需要登录的方法
    protected $noNeedLogin = [];
    // 不需要加密的方法
    protected $noNeedEncrypt = [];

    /**
     * 根据上级id，获取下级
     * @method get
     * @param Request $request 
     * @return Response
     **/
    public function getList(Request $request) : Response
    {
        $list = RegionLogic::getList(request()->get('id'));
        return success($list);
    }

    /**
     * 获取所有的省
     * @method get
     * @param Request $request 
     * @return Response
     **/
    public function getProvince(Request $request) : Response
    {
        $list = RegionLogic::getProvince();
        return success($list);
    }

    /**
     * 获取所有的省市
     * @method get
     * @param Request $request 
     * @return Response
     **/
    public function getProvinceCity(Request $request) : Response
    {
        $list = RegionLogic::getProvinceCity();
        return success($list);
    }

    /**
     * 获取所有省市区，多维的
     * @method get
     * @param Request $request 
     * @return Response
     **/
    public function getListAll(Request $request) : Response
    {
        $list = RegionLogic::getListAll();
        return success($list);
    }
}
