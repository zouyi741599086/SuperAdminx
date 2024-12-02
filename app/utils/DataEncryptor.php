<?php
namespace app\utils;

/**
 * 数据加解密相关
 * 
 * DataEncryptor::rsaDecrypt($data) rsa解密
 * DataEncryptor::aesEncrypt($data, $key, $iv) aes加密
 * DataEncryptor::aesDecrypt($data, $key, $iv) aes解密
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class DataEncryptor
{
    /**
     * rsa解密
     * @param string $data 解密的数据
     * @return string
     */
    public static function rsaDecrypt(?string $data) : string
    {
        if (! $data) {
            abort('解密的数据不能为空');
        }
        $private_key = config('superadminx.api_encryptor.rsa_private');
        if (! $private_key) {
            abort('未设置解密私钥');
        }
        try {
            $private_key = openssl_pkey_get_private($private_key);
            if (! $private_key) {
                throw new \Exception('密钥错误~');
            }
            $return_de = openssl_private_decrypt(base64_decode($data), $decrypted, $private_key);
            if (! $return_de) {
                throw new \Exception('RSA解密失败，请检查密钥~');
            }
            return $decrypted;
        } catch (\Exception $e) {
            abort("RSA解密：{$e->getMessage()}");
        }
    }

    /**
     * aes加密
     * @param array|string|object $data 必须加密一个数组因为解码对应的是数组
     * @param string $key 加密key
     * @param string $iv 加密iv
     * @return string
     */
    public static function aesEncrypt($data, string $key, string $iv) : string
    {
        try {
            $data = json_encode($data);
            $data = openssl_encrypt($data, 'AES-256-CBC', $key, OPENSSL_RAW_DATA, $iv);
            return base64_encode($data);
        } catch (\Exception $e) {
            abort("AES加密失败：{$e->getMessage()}");
        }
    }

    /**
     * aes解密
     * @param string $data 必须是数组或对象加密后的密文
     * @param string $key 解密key
     * @param string $v 解密iv
     * @return array
     */
    public static function aesDecrypt(?string $data, string $key, string $iv) : array
    {
        if (! $data) {
            abort('解密的数据不能为空');
        }
        try {
            $data = base64_decode($data);
            $data = openssl_decrypt($data, 'AES-256-CBC', $key, OPENSSL_RAW_DATA, $iv);
            return json_decode($data, true);
        } catch (\Exception $e) {
            abort("AES解密失败：{$e->getMessage()}");
        }
    }
}