<?php
namespace plugin\admin\app\api\controller;

use support\Request;
use support\Response;
use plugin\admin\app\common\logic\ConfigLogic;

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
    // 不需要加密的方法
    protected $noNeedEncrypt = [];

    /**
     * 获取配置
     * @method get
     * @param string $name
     * @return Response
     */
    public function getConfig(Request $request, string $name) : Response
    {
        $data = ConfigLogic::getConfig($name, 'array');
        $data = file_url($data);
        return success($data);
    }
}
