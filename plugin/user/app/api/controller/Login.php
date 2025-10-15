<?php
namespace plugin\user\app\api\controller;

use support\Request;
use support\Response;
use support\think\Db;
use app\utils\JwtUtils;
use app\utils\WechatMiniUtils;
use plugin\user\app\common\model\UserModel;
use plugin\user\app\common\validate\UserValidate;
use support\Log;

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
    // 不需要加密的方法
    protected $noNeedEncrypt = [];

    /**
     * @log 登录
     * @method get
     * @param Request $request 
     * @param string $code 
     * @return Response
     * */
    public function autoLogin(Request $request, string $code)
    {
        $openid = $request->post('openid');
        if (! $openid) {
            $result = WechatMiniUtils::getOpenid($code);
            if (isset($result['openid']) && $result['openid']) {
                $openid = $result['openid'];
            }
        }
        if ($openid) {
            $userId = UserModel::where('mini_openid', $openid)
                ->where('status', 1)
                ->value('id');
            if ($userId) {
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

        //获取openid，wxlogin的code
        $data['mini_openid'] = $request->post('openid');
        if (! $data['mini_openid']) {
            $result = WechatMiniUtils::getOpenid($data['code']);
            if (! isset($result['openid']) || ! $result['openid']) {
                throw new \Exception('获取用户openid错误');
            }
            $data['mini_openid'] = $result['openid'];
        }

        //Log::info("用户登录注册", $data);

        //已经注册
        $userId = UserModel::where('status', 1)
            ->where('mini_openid', $data['mini_openid'])
            ->value('id');

        // 如果手机号已存在，而openid不存在，则直接把手机号这个用户的openid改为新的openid，这是因为老系统登录有问题，导致同一手机切换微信账号遗留下来的
        $telId = UserModel::where('tel', $data['tel'])->value('id');
        if ($telId && ! $userId) {
            UserModel::where('id', $telId)->update([
                'mini_openid' => $data['mini_openid']
            ]);
            $userId = $telId;
        }

        if (! $userId) {
            Db::startTrans();
            try {
                if (isset($data['img'])) {
                    //如果头像图片地址里面包含url，则干掉
                    if (strpos($data['img'], config('app.url')) !== false) {
                        $data['img'] = str_replace(config('app.url'), '', $data['img']);
                    }
                } else {
                    // 默认头像地址
                    $data['img'] = 'https://jyj-1253289608.cos.ap-guangzhou.myqcloud.com/xiaochengxu_runxue/tb-tx.png';
                }

                // 如果姓名为空，则用手机号
                $data['name'] = $data['name'] ?? substr_replace($data['tel'], '****', 3, 4);

                think_validate(UserValidate::class)->scene('create')->check($data);
                $result = UserModel::create($data);

                //如果有推广id
                if (isset($data['invite_code']) && $data['invite_code']) {
                    $pid   = ltrim($data['invite_code'], 'from_id_');
                    $pUser = UserModel::where('id', $pid)->find();
                }
                if (isset($pUser) && $pUser && isset($pid)) {
                    UserModel::where('id', $result->id)->update([
                        'pid'       => $pid,
                        'pid_layer' => $pUser->pid_layer + 1,
                        'pid_path'  => "{$pUser->pid_path}{$result->id},",
                    ]);
                } else {
                    UserModel::where('id', $result->id)->update([
                        'pid_path' => ",{$result->id},",
                    ]);
                }
                $userId = $result->id;

                Db::commit();
            } catch (\Exception $e) {
                Db::rollback();
                Log::error("用户注册失败：{$e->getMessage()}", $data);
                abort($e->getMessage());
            }
        }

        return success($this->resultUser($userId), '登录成功');
    }

    private function resultUser(int $userId)
    {
        $user          = UserModel::where('id', $userId)->where('status',1)->find();
        if (!$user) {
            abort('用户已禁用');
        }
		$user->img = file_url($user->img);
        $user['token'] = JwtUtils::generateToken('api', $user->toArray());
        return $user;
    }
}
