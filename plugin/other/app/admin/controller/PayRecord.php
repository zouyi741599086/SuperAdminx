<?php
namespace plugin\other\app\admin\controller;

use support\Request;
use support\Response;
use plugin\other\app\common\service\PayRecordService;

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
     * 列表
     * @method get
     * @param Request $request 
     * @return Response
     */
    public function getList(Request $request) : Response
    {
        $list = $this->payRecordService->getList($request->get());
        return success($list);
    }

    /**
     * @log 导出支付记录数据
     * @method get
     * @param Request $request 
     * @return Response
     */
    public function exportData(Request $request) : Response
    {
        $data = $this->payRecordService->exportData($request->get());
        return success($data);
    }

}