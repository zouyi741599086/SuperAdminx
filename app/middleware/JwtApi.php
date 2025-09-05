<?php
namespace app\middleware;

use ReflectionClass;
use Webman\MiddlewareInterface;
use Webman\Http\Response;
use Webman\Http\Request;
use app\utils\JwtUtils;
use plugin\user\app\common\logic\UserLogic;
use plugin\user\app\common\model\UserModel;
use support\Log;

/**
 * api模型权限验证
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 */
class JwtApi implements MiddlewareInterface
{
    public static $controllerActionIsLogin = [];

    public function process(Request $request, callable $handler) : Response
    {
        // 登录的角色
        $request->loginRole = 'user';
        try {
            // 不管是否需要登录都进行权限验证，因为有的接口可登录可不登录
            $request->user = JwtUtils::getUser('api');
        } catch (\Exception $e) {
            // 必须要登录同时验证失败了，才抛出错误
            if ($this->actionIsLogin()) {
                abort($e->getMessage(), -2);
            }

            // 强制登录某个用户，需注释掉上面三行
            //$request->user = UserModel::find(2449);
        }

        // 模拟登录某个用户
        // if (isset($request->user->id) && in_array($request->user->id, [2449,2190])) {
        //     $request->user = UserModel::find(3320);
        // }

        // 高并发需要关掉此处控制一下验证时机
        if ($this->actionIsLogin()) {
            $request->user = UserLogic::findData($request->user->id);
            if (! $request->user || $request->user->status == 2) {
                abort('非法请求', -2);
            }
        }
        return $handler($request);
    }

    /**
     * 通过反射来获取当前访问此方法是否需要登录，获取到后在存到静态变量中下次再次请求就不用反射了
     * @return bool 是否需要登录
     */
    private function actionIsLogin() : bool
    {
        $request = request();
        $key     = "{$request->controller}[{$request->action}]";

        if (! isset(self::$controllerActionIsLogin[$key])) {
            // 通过反射获取控制器
            $controller = new ReflectionClass($request->controller);
            // 控制器是否需要登录
            $onLogin = $controller->getDefaultProperties()['onLogin'] ?? false;
            // 控制器中不需要验证登录的方法
            $noNeedLogin = $controller->getDefaultProperties()['noNeedLogin'] ?? [];

            self::$controllerActionIsLogin[$key] = ($onLogin && ! in_array($request->action, $noNeedLogin)) ? true : false;
        }
        return self::$controllerActionIsLogin[$key];
    }
}