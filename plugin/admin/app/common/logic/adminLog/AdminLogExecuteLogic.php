<?php
namespace plugin\admin\app\common\logic\adminLog;

use plugin\admin\app\common\model\AdminLogModel;

/**
 * 操作日志
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class AdminLogExecuteLogic
{
    // 所有类方法的的日志
    public static $controllerActionLog = [];

    /**
     * 添加日志，系统自动调用，或者手动调用
     * @param string $title 日志标题 
     */
    public function create(?string $title = null) : void
    {
        $request = request();
        $title   = $title ?: self::getMethodLog();
        if ($title && $request->adminUser && $request->adminUser->is_super != 2) {
            AdminLogModel::create([
                'name'           => $request->adminUser->name ?? '',
                'tel'            => $request->adminUser->tel ?? '',
                'title'          => $title,
                'ip'             => $request->getRealIp(true),
                'request_url'    => $request->fullUrl(),
                'request_get'    => $request->get(),
                'request_post'   => $request->post(),
                'request_header' => $request->header(),
            ]);
        }
    }

    /**
     * 获取控制器方法的注释，用于写入日志
     * @param $prefix string 获取的注释前缀
     */
    private function getMethodLog(string $prefix = '@log') : string
    {
        $request = request();

        $key = "{$request->controller}\{$request->action}";
        if (isset(self::$controllerActionLog[$key])) {
            return self::$controllerActionLog[$key];
        }
        // 通过反射获取控制器
        $controller = new \ReflectionClass($request->controller);
        $methods    = $controller->getMethods();
        $tmp        = [];
        foreach ($methods as $m) {
            if (strtolower($m->name) == strtolower($request->action)) {
                preg_match_all("/{$prefix}(.*?)[\r\n|\n]/", $m->getDocComment(), $tmp);
                break;
            }
        }
        self::$controllerActionLog[$key] = trim($tmp[1][0] ?? "");
        return self::$controllerActionLog[$key];
    }

}