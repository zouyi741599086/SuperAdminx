<?php
namespace plugin\balance\app\api\controller;

use support\Request;
use support\Response;
use plugin\balance\app\common\service\BalanceWithdrawService;

/**
 * 用户余额提现 控制器
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class BalanceWithdraw
{

    // 此控制器是否需要登录
    protected $onLogin = true;
    // 不需要登录的方法
    protected $noNeedLogin = [];
    // 不需要加密的方法
    protected $noNeedEncrypt = [];

    public function __construct(
        private BalanceWithdrawService $balanceWithdrawService,
    ) {}

    /**
     * 列表
     * @method get
     * @auth balanceWithdrawGetList
     * @param Request $request 
     * @return Response
     */
    public function getList(Request $request) : Response
    {
        $params            = $request->get();
        $params['user_id'] = $request->user->id;
        $list              = $this->balanceWithdrawService->getList($params);
        return success($list);
    }

    /**
     * @log 新增余额提现
     * @method post
     * @param Request $request 
     * @return Response
     */
    public function create(Request $request) : Response
    {
        $params            = $request->post();
        $params['user_id'] = $request->user->id;
        $this->balanceWithdrawService->create($params);
        return success([], '申请成功');
    }

    /**
     * 获取数据
     * @method get
     * @param int $id 
     * @return Response
     */
    public function findData(Request $request, int $id) : Response
    {
        $data = $this->balanceWithdrawService->findData($id, []);
        if (! $data || $data['user_id'] != $request->user->id) {
            return error('参数错误');
        }
        return success($data);
    }

    /**
     * 获取最后一次提现的详情
     * @method get
     * @return Response
     */
    public function getLastInfo(Request $request) : Response
    {
        $data = $this->balanceWithdrawService->getLastInfo($request->user->id);
        return success($data);
    }

}