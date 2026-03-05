<?php
namespace plugin\user\app\api\controller;

use support\Request;
use support\Response;
use plugin\user\app\common\model\UserModel;
use Webman\RateLimiter\Limiter;
use plugin\user\app\common\service\UserService;
use DI\Attribute\Inject;
use support\Cache;

/**
 * 用户
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class User
{
    // 此控制器是否需要登录
    protected $onLogin = true;
    // 不需要登录的方法
    protected $noNeedLogin = ['getShareQrcode'];
    // 不需要加密的方法
    protected $noNeedEncrypt = [];

    public function __construct(
        private UserService $userService,
    ) {}

    /**
     * 获取自己的资料
     * @method get
     * @param Request $request 
     * @return Response
     */
    public function getUserInfo(Request $request) : Response
    {
        $data      = $this->userService->findData($request->user->id);
        $data->img = file_url($data->img);
        return success($data);
    }

    /**
     * 修改自己的资料
     * @method post
     * @param Request $request 
     * @return Response
     */
    public function updateInfo(Request $request) : Response
    {
        $this->userService->updateInfo($request->post(), $request->user->id);
        return success([], '修改成功');
    }

    /**
     * 获取推广统计
     * @method get
     * @param Request $request 
     * @return Response
     */
    public function getChildrenTotal(Request $request) : Response
    {
        $result = $this->userService->getChildrenTotal($request->user->id);
        return success($result);
    }

    /**
     * 获取推广统计 月走势图
     * @method get
     * @param Request $request 
     * @return Response
     */
    public function getChildrenTotalMonth(Request $request) : Response
    {
        $result = $this->userService->getChildrenTotalMonth($request->user->id, $request->get());
        return success($result);
    }

    /**
     * 获取推广统计 日走势图
     * @method get
     * @param Request $request 
     * @return Response
     */
    public function getChildrenTotalDate(Request $request) : Response
    {
        $result = $this->userService->getChildrenTotalDate($request->user->id, $request->get());
        return success($result);
    }

    /**
     * 获取推广列表，就是或下级列表
     * @method get
     * @param Request $request 
     * @return Response
     */
    public function getChildrenList(Request $request) : Response
    {
        $result = $this->userService->getChildrenList($request->user->id, $request->get());
        return success($result);
    }

    /**
     * 搜索某个用户，不能搜索自己
     * @method get
     * @param Request $request 
     * @param string $tel 手机号
     * @return Response
     */
    public function searchUser(Request $request, string $tel) : Response
    {
        $result      = $this->userService->searchUser($request->user->id, $tel);
        $result->img = file_url($result->img);
        return success($result);
    }

    /**
     * 更改手机号获取验证码
     * @method get
     * @param Request $request 
     * @return Response
     */
    public function getUpdateTelCode(Request $request) : Response
    {
        $this->userService->getUpdateTelCode($request->get('tel'));
        return success([], "发送成功");
    }

    /**
     * 获取推广二维码
     * @method post
     * @param Request $request 
     * @return Response
     */
    public function getShareQrcode(Request $request) : Response
    {
        $result = $this->userService->getShareQrcode($request->user->id);
        $result = file_url($result);
        return success($result);
    }

    /**
     * 获取推广海报
     * @method post
     * @param Request $request 
     * @param string $appName app名称
     * @return Response
     */
    public function getSharePoster(Request $request, string $appName) : Response
    {
        $result = $this->userService->getSharePoster($request->user->id, $appName);
        $result = file_url($result);
        return success($result);
    }
}
