<?php
namespace app\api\controller;

use support\Request;
use support\Response;
use support\think\Db;
use app\utils\JwtUtils;
use app\utils\WechatMiniUtils;
use app\common\model\UserModel;
use app\common\validate\UserValidate;



/**
 * 小程序登录相关
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class Login
{
    // 此控制器是否需要登录
    protected $onLogin = false;
    // 不需要登录的方法
    protected $noNeedLogin = [];

    /**
     * @log 登录
     * @method get
     * @param Request $request 
     * @param string $code 
     * @return Response
     * */
    public function autoLogin(Request $request, string $code)
    {
        $result = WechatMiniUtils::getOpenid($code);
        if (isset($result['openid']) && $result['openid']) {
            if ($userId = UserModel::where('mini_openid', $result['openid'])->value('id')) {
                return success($this->resultUser($userId));
            }
        }
        return error("用户未注册");
    }

    /**
     * 小程序授权获取用户手机号
     * @method get
     * @param Request $request 
     * @param string $code 
     * @return Response
     * */
    public function getPhoneNumber(Request $request, string $code)
    {
        $data = WechatMiniUtils::getPhoneNumber($code);
        return success($data);
    }

    /**
     * 用户注册提交
     * @method post
     * @param Request $request 
     * @param string $code 
     * @return Response
     * */
    public function register(Request $request)
    {
        $data = $request->post();

        Db::startTrans();
        try {
            validate(UserValidate::class)->check($data);

            //获取openid，wxlogin的code
            $result = WechatMiniUtils::getOpenid($data['code']);
            if (! isset($result['openid']) || ! $result['openid']) {
                throw new \Exception('获取用户openid错误');
            }
            $data['mini_openid'] = $result['openid'];

            //已经注册直接返回
            $userId = UserModel::where('mini_openid', $data['mini_openid'])->value('id');
            if (! $userId) {
                //如果头像图片地址里面包含url，则干掉
                if (isset($data['img']) && strpos($data['img'], config('app.url')) !== false) {
                    $data['img'] = str_replace(config('app.url'), '', $data['img']);
                }

                //如果有推广id
                if (isset($data['invite_code'])) {
                    $pid = ltrim($data['invite_code'], 'from_id_');
                    if ($pid && $pUser = UserModel::where('id', $pid)->value('id')) {
                        $data['pid']       = $pid;
                        $data['pid_layer'] = $pUser['pid_layer'] + 1;
                    }
                }

                $result = UserModel::create($data);
                if (isset($data['pid']) && isset($pUser)) {
                    UserModel::where('id', $result->id)->update([
                        'pid_path' => "{$pUser['pid_path']}{$result->id},"
                    ]);
                }
                $userId = $result->id;
            }
            Db::commit();
        } catch (\Exception $e) {
            Db::rollback();
            abort($e->getMessage());
        }
        return success($this->resultUser($userId));
    }

    private function resultUser(int $userId)
    {
        $user          = UserModel::where('id', $userId)->find();
        $user['token'] = JwtUtils::generateToken('user', $user);
        return $user;
    }
}
