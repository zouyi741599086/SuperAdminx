<?php
namespace app\middleware;

use Webman\MiddlewareInterface;
use Webman\Http\Response;
use Webman\Http\Request;
use app\utils\DataEncryptor;

/**
 * 请求数据加解密
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 */
class RequestDecrypt implements MiddlewareInterface
{
    public function process(Request $request, callable $handler) : Response
    {
        // 数据解密
        if (
            config('superadminx.api_encryptor.enable') == true &&
            ! in_array($request->path(), config('superadminx.api_encryptor.url'))
        ) {
            try {
                // 解密key iv
                $superAdminxKeySecret = DataEncryptor::rsaDecrypt($request->header('SuperAdminxKeySecret'));
                $superAdminxKeySecret = str_split($superAdminxKeySecret, 32);
                $request->aes_key     = $superAdminxKeySecret[0];
                $request->aes_iv      = $superAdminxKeySecret[1];

                if ($request->get()) {
                    $data = DataEncryptor::aesDecrypt($request->get('encrypt_data'), $request->aes_key, $request->aes_iv);
                    $request->setGet(array_merge($request->get(), $data));
                }
                if ($request->post()) {
                    $data = DataEncryptor::aesDecrypt($request->post('encrypt_data'), $request->aes_key, $request->aes_iv);
                    $request->setPost(array_merge($request->post(), $data));
                }
            } catch (\Exception $e) {
                abort("数据解密失败：{$e->getMessage()}");
            }

        }

        // 请求继续向洋葱芯穿越
        return $handler($request);
    }
}