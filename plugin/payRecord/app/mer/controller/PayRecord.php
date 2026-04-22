<?php
namespace plugin\payRecord\app\mer\controller;

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
     * 列表
     * @method get
     * @param Request $request 
     * @return Response
     */
    public function getList(Request $request) : Response
    {
        $with = [
            'User'      => function ($query)
            {
                $query->field('id,img,name,tel');
            },
            'ShopOrder' => function ($query)
            {
                $query->field('id,orderno');
            }
        ];
        $list = $this->payRecordService->getList($request->get(), $with);
        return success($list);
    }

    /**
     * 获取一条数据
     * @method get
     * @param Request $request 
     * @param int $id
     * @return Response
     */
    public function findData(Request $request, int $id) : Response
    {
        $data = $this->payRecordService->findData($id);
        return success($data);
    }
}