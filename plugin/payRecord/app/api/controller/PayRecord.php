<?php
namespace plugin\payRecord\app\api\controller;

use support\Request;
use support\Response;
use plugin\payRecord\app\common\service\PayRecordService;

/**
 * 支付记录 控制器
 *
 * @ author zy <741599086@qq.com>
 * */

class PayRecord
{

    // 此控制器是否需要登录
    protected $onLogin = true;
    // 不需要登录的方法，受控于上面个参数
    protected $noNeedLogin = [];
    // 不需要加密的方法
    protected $noNeedEncrypt = [];

    public function __construct(
        private PayRecordService $payRecordService,
    ) {}

    /**
     * 获取订单支付记录
     * @method get
     * @param Request $request 
     * @return Response
     */
    public function getOrderPayList(Request $request) : Response
    {
        $params         = $request->get();
        $params['type'] = 1;
        $list           = $this->payRecordService->getList($params);
        return success($list);
    }
}