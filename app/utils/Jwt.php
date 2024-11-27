<?php
namespace app\utils;

use think\facade\Db;
use support\Redis;
use app\utils\DataEncryptor;

/**
 * Jwt鉴权
 * 生成token后会装入数据库或redis，只保留最新xx条token
 * 解密token先执行解密，成功后在到数据库中获取token（获取不到直接失败），获取到了后在判断过期时间（过期则删除）
 * 
 * Jwt::generateToken(string $app_name, array $user) 生成token
 * Jwt::getUser(string $app_name) 解密token获取登录用户
 * Jwt::logoutUser(string $app_name, int $key_value) 强制清退某个应用的某个用户
 * Jwt::getHeaderToken() 从header中获取当前登录用户的token
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class Jwt
{
    /**
     * 生成token
     * @param array $user 生成token的数据，数组key不要太多，一般3-5个即可，太多会影响token的长度
     * @param string $app_name 给哪个应用生成token
     * @return string
     */
    public static function generateToken(string $app_name, array $user) : string
    {
        $config = self::getConfig($app_name);
        if (! isset($user[$config['key']]) || ! $user[$config['key']]) {
            abort("Jwt：生成token的数据中缺少必要的key>{$config['key']}");
        }

        $token     = self::tokenEncryption($user, 'E', $config['expires_at']);
        $token_key = self::getTokenKey($app_name, $user[$config['key']]);

        if (config('superadminx.jwt.db') === 'mysql') {
            //存入数据库
            Db::name('Token')->insert([
                'token_key' => $token_key,
                'token'     => $token,
            ]);
            //删除多余的token，只保留xx条
            $ids = Db::name('Token')->where('token_key', $token_key)->order('id desc')->limit($config['num'])->column('id');
            Db::name('Token')
                ->where('token_key', $token_key)
                ->where('id', 'not in', $ids)
                ->delete();
        }
        if (config('superadminx.jwt.db') === 'redis') {
            //存入数据库
            Redis::lpush($token_key, $token);
            //删除多余的token，只保留xx条
            Redis::ltrim($token_key, 0, $config['num'] - 1);
        }
        return $token;
    }

    /**
     * 解密token获取用户
     * @param string $app_name 解密哪个应用生成token
     * @return array 
     */
    public static function getUser(string $app_name) : array
    {
        $config = self::getConfig($app_name);

        //rsa初次解密
        $token = self::getHeaderToken();
        //解密token获取user，user里面会多一个过期时间字段：expires_at
        $user = self::tokenEncryption($token, 'D');
        if (! is_array($user) || ! $user) {
            abort('非法请求', -2);
        }
        $token_key = self::getTokenKey($app_name, $user[$config['key']]);

        if (config('superadminx.jwt.db') === 'mysql') {
            //判断token是否在数据库中
            $id = Db::name('Token')->where([
                ['token_key', '=', $token_key],
                ['token', '=', $token]
            ])->value('id');
            if (! $id) {
                abort('登录已失效', -2);
            }
            //判断是否过期
            if (time() >= $user['expires_at']) {
                //删除
                Db::name('Token')->where('id', $id)->delete();
                abort('登录已失效', -2);
            }
        }
        if (config('superadminx.jwt.db') === 'redis') {
            //判断token是否在redis中
            $listLength    = Redis::lLen($token_key);
            $indexToDelete = -1;
            for ($i = 0; $i < $listLength; $i++) {
                $element = Redis::lIndex($token_key, $i);
                if ($element === $token) {
                    $indexToDelete = $i;
                    break;
                }
            }
            if ($indexToDelete == -1) {
                abort('登录已失效', -2);
            }
            //判断是否过期
            if (time() >= $user['expires_at']) {
                //删除
                Redis::lRem($token_key, 1, $token);
                abort('登录已失效', -2);
            }
        }
        return $user;
    }

    /**
     * 强制清退某个用户
     * @param string $app_name 应用名称
     * @param int $key_value 加密时候的唯一性字段的值，一般是id
     */
    public static function logoutUser(string $app_name, int $key_value)
    {
        $token_key = self::getTokenKey($app_name, $key_value);

        if (config('superadminx.jwt.db') === 'mysql') {
            Db::name('Token')->where('token_key', $token_key)->delete();
        }
        if (config('superadminx.jwt.db') === 'redis') {
            Redis::del($token_key);
        }
    }

    /**
     * 从Header中获取token
     * @return string
     */
    public static function getHeaderToken() : string
    {
        $request = request();
        //判断是否有token
        $token = $request->header(config('superadminx.jwt.header_key'));
        if (! $token) {
            abort('非法请求', -2);
        }

        //rsa初次解密，前端传的token是token与time的通过rsa加密得到的
        $tmp = json_decode(DataEncryptor::rsaDecrypt($token), true);
        if (! isset($tmp['token']) || ! isset($tmp['time']) || ! $tmp['token'] || ! $tmp['time']) {
            abort('非法请求', -2);
        }
        //非上传的时候此次请求时间超过30秒则非法
        if (time() - intval($tmp['time'] / 1000) >= 60 && ! $request->file()) {
            abort('请求超时', -2);
        }
        return $tmp['token'];
    }

    /**
     * 获取存token的key
     * @param string $app_name
     * @param int $id
     * @return string
     */
    private static function getTokenKey(string $app_name, int $id) : string
    {
        $key_prefix = config('superadminx.jwt.key_prefix');
        return "{$key_prefix}_{$app_name}_{$id}";
    }

    /**
     * 获取应用的配置
     * @param string $app_name
     * @return array
     */
    private static function getConfig(string $app_name) : array
    {
        $config    = [];
        $jwtConfig = config('superadminx.jwt.app');
        foreach ($jwtConfig as $v) {
            if ($v['name'] == $app_name) {
                $config = $v;
                break;
            }
        }
        if (! $config) {
            abort('Jwt：不存在的应用名称~');
        }
        return $config;
    }

    /**
     * token加解密函数
     * @param array|string $data 加密解密的数据
     * @param string $operation E加密，D解密
     * @param int $expires_at 过期时间
     * @param string $key 加密key
     * @return string|array
     */
    private static function tokenEncryption($data, $operation = 'E', $expires_at = 3600, $key = 'superadminx.com') : string|array
    {
        if ($operation == 'E') {
            $data['expires_at'] = time() + $expires_at;
			$data['rand']       = rand(1, 10000);
            $data               = json_encode($data);
        } else {
            $data = str_replace('%', '+', $data);
        }
        $key         = md5($key);
        $key_length  = strlen($key);
        $data        = $operation == 'D' ? base64_decode($data) : substr(md5($data . $key), 0, 8) . $data;
        $data_length = strlen($data);
        $rndkey      = $box = [];
        $result = '';
        for ($i = 0; $i <= 255; $i++) {
            $rndkey[$i] = ord($key[$i % $key_length]);
            $box[$i]    = $i;
        }
        for ($j = $i = 0; $i < 256; $i++) {
            $j       = ($j + $box[$i] + $rndkey[$i]) % 256;
            $tmp     = $box[$i];
            $box[$i] = $box[$j];
            $box[$j] = $tmp;
        }
        for ($a = $j = $i = 0; $i < $data_length; $i++) {
            $a       = ($a + 1) % 256;
            $j       = ($j + $box[$a]) % 256;
            $tmp     = $box[$a];
            $box[$a] = $box[$j];
            $box[$j] = $tmp;
            $result .= chr(ord($data[$i]) ^ ($box[($box[$a] + $box[$j]) % 256]));
        }
        if ($operation == 'D') {
            if (substr($result, 0, 8) == substr(md5(substr($result, 8) . $key), 0, 8)) {
                $data = json_decode(substr($result, 8), true);
                return $data;
            } else {
                return [];
            }
        } else {
            return str_replace('+', '%', str_replace('=', '', base64_encode($result)));
        }
    }
}