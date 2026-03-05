<?php
namespace plugin\balance\app\api\controller;

use support\Request;
use support\Response;
use plugin\balance\app\common\service\BalanceService;

/**
 * 用户余额 控制器
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class Balance
{

    // 此控制器是否需要登录
    protected $onLogin = true;
    // 不需要登录的方法
    protected $noNeedLogin = [];
    // 不需要加密的方法
    protected $noNeedEncrypt = [];

    public function __construct(
        private BalanceService $balanceService,
    ) {}

    /**
     * 获取用户余额
     * @method get
     * @param Request $request 
     * @return Response
     */
    public function get(Request $request) : Response
    {
        $data = $this->balanceService->getUserBalance($request->user->id);
        return success(data: $data);
    }

    /**
     * 用户余额转账
     * @method post
     * @param Request $request 
     * @return Response
     */
    public function turn(Request $request) : Response
    {
        $params            = $request->post();
        $params['user_id'] = $request->user->id;
        $this->balanceService->turn($params);
        return success([], '转账成功');
    }

    /**
     * 获取余额类型的配置
     * @method get
     * @param Request $request 
     * @param string $field 余额的类型
     * @return Response
     */
    public function getBalanceConfig(Request $request, string $field)
    {
        $balanceType = config('plugin.balance.superadminx.balance_type');
        foreach ($balanceType as $v) {
            if ($v['field'] == $field) {
                return success($v);
            }
        }
        return error('余额类型错误');
    }
}