<?php
namespace app\middleware;

use Webman\MiddlewareInterface;
use Webman\Http\Response;
use Webman\Http\Request;
use app\utils\DataEncryptorUtils;

/**
 * 请求数据加解密
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 */
class RequestDecrypt implements MiddlewareInterface
{
    public static $controllerActionIsEncrypt = [];

    public function process(Request $request, callable $handler) : Response
    {
        // 数据解密
        if (
            config('superadminx.api_encryptor.enable') == true &&
            ! $this->actionIsEncrypt()
        ) {
            try {
                // 解密key iv
                $superAdminxKeySecret = DataEncryptorUtils::rsaDecrypt($request->header('SuperAdminxKeySecret'));
                $superAdminxKeySecret = str_split($superAdminxKeySecret, 32);
                $request->aes_key     = $superAdminxKeySecret[0];
                $request->aes_iv      = $superAdminxKeySecret[1];

                if ($request->get()) {
                    $data = DataEncryptorUtils::aesDecrypt($request->get('encrypt_data'), $request->aes_key, $request->aes_iv);
                    $request->setGet(array_merge($request->get(), $data));
                }
                if ($request->post()) {
                    $data = DataEncryptorUtils::aesDecrypt($request->post('encrypt_data'), $request->aes_key, $request->aes_iv);
                    $request->setPost(array_merge($request->post(), $data));
                }
            } catch (\Exception $e) {
                abort("数据解密失败：{$e->getMessage()}");
            }

        }

        // 请求继续向洋葱芯穿越
        return $handler($request);
    }

    /**
     * 通过反射来获取当前访问此方法是否需要解密，获取到后在存到静态变量中下次再次请求就不用反射了
     * @return bool 是否需要解密
     */
    private function actionIsEncrypt() : bool
    {
        $request = request();
        $key     = "{$request->controller}[{$request->action}]";

        if (! isset(self::$controllerActionIsEncrypt[$key])) {
            // 通过反射获取控制器
            $controller = new \ReflectionClass($request->controller);
            // 控制器中不需要加密的方法
            $noNeedEncrypt                         = $controller->getDefaultProperties()['noNeedEncrypt'] ?? [];
            self::$controllerActionIsEncrypt[$key] = ($noNeedEncrypt && in_array($request->action, $noNeedEncrypt));
        }
        return self::$controllerActionIsEncrypt[$key];
    }
}