<?php
namespace plugin\region\app\api\controller;

use support\Request;
use support\Response;
use plugin\region\app\common\service\RegionService;

/**
 * 省市区
 *
 * @author zy <741599086@qq.com>
 * */
class Region
{
    //此控制器是否需要登录
    protected $onLogin = false;
    //不需要登录的方法，受控于上面个参数
    protected $noNeedLogin = [];
    // 不需要加密的方法
    protected $noNeedEncrypt = [];

    public function __construct(
        private RegionService $regionService,
    ) {}

    /**
     * 根据上级获取下级
     * @method get
     * @param Request $request 
     * @param int $id 上级id
     * @return Response
     * */
    public function getList(Request $request, int $id) : Response
    {
        $result = $this->regionService->getList($id);
        return success($result);
    }

    /**
     * 获取所有的省
     * @method get
     * @param Request $request 
     * @return Response
     * */
    public function getProvince(Request $request) : Response
    {
        $result = $this->regionService->getProvince();
        return success($result);
    }

    /**
     * 获取所有的省市，多维的
     * @method get
     * @param Request $request 
     * @return Response
     * */
    public function getProvinceCity(Request $request) : Response
    {
        $result = $this->regionService->getProvinceCity();
        return success($result);
    }

    /**
     * 获取所有省市区，多维的
     * @method get
     * @param Request $request 
     * @return Response
     * */
    public function getListAll(Request $request) : Response
    {
        $result = $this->regionService->getListAll();
        return success($result);
    }

    /**
     * 获取数据
     * @method get
     * @param Request $request 
     * @param int $id 数据id
     * @return Response
     * */
    public function pathInfo(Request $request, int $id) : Response
    {
        $result = $this->regionService->pathInfo($id);
        return success($result);
    }
}
