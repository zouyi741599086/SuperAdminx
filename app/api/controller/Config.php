<?php
namespace app\api\controller;

use support\Request;
use support\Response;
use app\common\logic\ConfigLogic;

/**
 * 配置
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class Config
{
    //此控制器是否需要登录
    protected $onLogin = false;
    //不需要登录的方法
    protected $noNeedLogin = [];

    /**
     * 获取配置
     * @method get
     * @param Request $request 
     * @return Response
     */
    public function getConfig($request) : Response
    {
        $data = ConfigLogic::getConfig($request->get('name'));
        $data = file_url($data);
        return success($data);
    }
}
