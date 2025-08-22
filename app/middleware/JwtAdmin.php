<?php
namespace app\middleware;

use ReflectionClass;
use Webman\MiddlewareInterface;
use Webman\Http\Response;
use Webman\Http\Request;
use app\utils\JwtUtils;
use app\common\logic\AdminLogLogic;
use app\common\model\AdminUserModel;
use app\common\model\AdminMenuModel;

/**
 * admin模块权限验证
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 */
class JwtAdmin implements MiddlewareInterface
{
    public static $controllerActionIsLogin = [];
    public static $controllerActionIsAuth  = [];

    public function process(Request $request, callable $handler) : Response
    {
        // 登录的角色
        $request->loginRole = 'admin';
        if ($this->actionIsLogin()) {
            try {
                $request->adminUser = JwtUtils::getUser('admin_pc');
            } catch (\Exception $e) {
                abort($e->getMessage(), -2);
            }

            // 高并发需要关掉此处控制一下验证时机
            $request->adminUser = AdminUserModel::find($request->adminUser->id);
            if (! $request->adminUser || $request->adminUser->status == 2) {
                abort('非法请求', -2);
            }

            // 验证接口级别的权限
            $authName = $this->actionIsAuth();
            if ($authName !== false && $request->adminUser->id != 1) {
                // 查询用户是否有此接口的权限
                $menuId = AdminMenuModel::where('name', $authName)
                    ->where('id', 'in', function ($query) use ($request)
                    {
                        $query->table('sa_admin_role_menu')->where('admin_role_id', $request->adminUser->admin_role_id)->field('admin_menu_id');
                    })
                    ->value('id');
                if (! $menuId) {
                    abort('非法请求：无此接口的权限~', -1);
                }
            }

            // 写访问日志
            AdminLogLogic::create();
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

    /**
     * 获取此接口访问的方法是否需要进行接口级别的权限验证
     * @return bool|string 返回false代表不需要验证，返回string代表权限验证名称
     */
    private function actionIsAuth() : bool|string
    {
        $request = request();
        $key     = "{$request->controller}[{$request->action}]";

        if (! isset(self::$controllerActionIsAuth[$key])) {
            // 获取控制器》此方法的注释
            $reflection = new \ReflectionMethod($request->controller, $request->action);
            $docComment = $reflection->getDocComment();

            // 移除开头的'/**'和结尾的'*/'，以便更容易地按行分割  
            $docComment = trim($docComment, "/*");
            // 按行分割字符串  
            $docComment = explode("\n", $docComment);

            // 遍历每一行来查找包含'@auth'的行来后去接口权限的标识 
            $auth = false;
            foreach ($docComment as $line) {
                // 使用正则表达式查找'@auth'后跟一个或多个空格，然后是请求类型（直到行尾或遇到非字母字符）  
                if (preg_match('/@auth\s+(\w+)/', $line, $matches)) {
                    $auth = trim($matches[1]); // $matches[1]是捕获组，包含请求类型（如'userGetList'）  
                    break; // 找到后退出循环  
                }
            }
            self::$controllerActionIsAuth[$key] = $auth ?: false;
        }
        return self::$controllerActionIsAuth[$key];
    }
}