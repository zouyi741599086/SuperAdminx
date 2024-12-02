<?php
namespace app\utils;

use app\common\model\SmsCodeModel;

/**
 * 发送短信
 * 
 * Sms::send($tel,string|array $content,$templateCode)  发送验证码，根据内容自动识别用哪个平台进行发送
 * Sms::checkTel($tel) 验证手机号格式，并验证是否发送太频繁
 * Sms::checkCode($tel, $type, $code) 验证码是否正确
 * Sms::getCode($length = 4) 随机生成验证码
 * Sms::LkSend($tel, $content) 凌凯平台发送短信
 * Sms::getLkBalance() 凌凯平台获取短信条数
 * Sms::aliyunSend($tel, array $templateParam, string $templateCode) 阿里云|小牛云 发送短信
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 */
class Sms
{
    /**
     * 短信发送
     * @param string $tel 手机号
     * @param string|array $content 发送内容 阿里云|小牛就是数组
     * @param string $templateCode 短信模板id
     * @return void
     */
    public static function send(string $tel, string|array $content, ?string $templateCode = null)
    {
        // 凯凌
        if (is_string($content)) {
            self::LkSend($tel, $content);
        }
        // 阿里云发送
        if (is_array($content)) {
            self::aliyunSend($tel, $content, $templateCode);
        }
    }
    
    /**
     * 验证码手机号格式，同时验证发发送太频繁
     * @param string $tel 
     */
    public static function checkTel(string $tel)
    {
        try {
            validate(
                [
                    'tel' => 'require|mobile',
                ],
                [
                    'tel.require' => '请输入手机号',
                    'tel.mobile'  => '请输入正确的手机号'
                ]
            )->check(['tel' => $tel]);
        } catch (\Exception $e) {
            abort($e->getMessage());
        }

        // 如果此手机号获取得太快了
        $id = SmsCodeModel::where('tel', $tel)
            ->where('create_time', '>=', date('Y-m-d H:i:s', time() - 60))
            ->value('id');
        if ($id) {
            abort('操作太频繁了，请1分钟后再试');
        }
    }

    /**
     * 验证码是否正确，验证成功会删除验证码
     * 调用的时候一定加事务，比如提交表单先验证如果成功了就删除了，结果后续操作导致提交失败，就会导致验证码被删除必须要重新发送验证码
     * @param string $tel 手机号
     * @param int $type 类型
     * @param string $code 验证码
     * 使用地方：前端
     */
    public static function checkCode(string $tel, int $type, string $code)
    {
        // 清理30分钟前验证码
        SmsCodeModel::where('create_time', '<=', date('Y-m-d H:i:s', time() - 30 * 60))->delete();

        $id = SmsCodeModel::where([
            ['tel', '=', $tel],
            ['type', '=', $type],
            ['code', '=', $code],
            ['create_time', '>=', date('Y-m-d H:i:s', time() - 10 * 60)]
        ])->order('id desc')->value('id');
        if ($id) {
            SmsCodeModel::destroy($id);
        } else {
            abort('验证码错误或已失效');
        }
    }

    /**
     * @ 生成验证码
     * @ param int $length 需要生成的长度
     * @ return 字符串
     */
    public static function getCode(int $length = 4)
    {
        $str        = '0123456789';
        $randString = '';
        $len        = strlen($str) - 1;
        for ($i = 0; $i < $length; $i++) {
            $num        = mt_rand(0, $len);
            $randString .= $str[$num];
        }
        return $randString;
    }

    /**
     * 发送短信，凯凌
     * @ param string $tel 手机号
     * @ param string $message 发送的内容
     */
    public static function LkSend(string $tel, string $content)
    {
        $sms_id       = config('superadminx.sms.sms_uid');
        $sms_password = config('superadminx.sms.sms_password');
        if (! $sms_id || ! $sms_password) {
            abort('未设置短信参数');
        }
        try {

            //header("Content-type: text/html; charset=utf-8");
            date_default_timezone_set('PRC');
            $msg     = rawurlencode(mb_convert_encoding($content, "gb2312", "utf-8"));
            $gateway = "https://mb345.com/ws/BatchSend2.aspx?CorpID={$sms_id}&Pwd={$sms_password}&Mobile={$tel}&Content={$msg}&Cell=&SendTime=";
            $result  = self::smsGet($gateway);

            if ($result > 0) {
                return true;
            } else {
                throw new \Exception('验证码发送失败~');
            }
        } catch (\Exception $e) {
            abort($e->getMessage());
        }
    }

    /**
     * 自己的平台，获取短信剩余条数 凯凌
     * */
    public static function getLkBalance()
    {
        $sms_id       = config('superadminx.sms.sms_uid');
        $sms_password = config('superadminx.sms.sms_password');
        if (! $sms_id || ! $sms_password) {
            abort('未设置短信参数');
        }

        $gateway = "https://sdk1.mb345.com:6789/ws/SelSum.aspx?CorpID={$sms_id}&Pwd={$sms_password}";
        return self::smsGet($gateway);
    }

    /**
     * 阿里云发送验证码
     * @param string $tel 接收的手机号码
     * @param array $templateParam 短信模板里面的参数
     * @param string $templateCode 短信的模版ID
     */
    public static function aliyunSend(string $tel, array $templateParam, string $templateCode)
    {
        $accessKeyId     = config('superadminx.sms.accessKeyId');
        $accessKeySecret = config('superadminx.sms.accessKeySecret');
        $signName        = config('superadminx.sms.signName');
        $type            = config('superadminx.sms.type');
        if (! $accessKeyId || ! $accessKeySecret || ! $signName) {
            abort('未设置短信参数');
        }
        try {
            $params = [];
            // *** 需用户填写部分 ***

            // fixme 必填: 短信接收号码
            $params["PhoneNumbers"] = $tel;

            // fixme 必填: 短信签名，应严格按"签名名称"填写，请参考: https://dysms.console.aliyun.com/dysms.htm#/develop/sign
            $params["SignName"] = $signName;

            // fixme 必填: 短信模板Code，应严格按"模板CODE"填写, 请参考: https://dysms.console.aliyun.com/dysms.htm#/develop/template
            $params["TemplateCode"] = $templateCode;

            // fixme 可选: 设置模板参数, 假如模板中存在变量需要替换则为必填项
            $templateParam && $params['TemplateParam'] = $templateParam;

            // fixme 可选: 设置发送短信流水号
            // $params['OutId'] = "12345";

            // fixme 可选: 上行短信扩展码, 扩展码字段控制在7位或以下，无特殊需求用户请忽略此字段
            // $params['SmsUpExtendCode'] = "1234567";

            // *** 需用户填写部分结束, 以下代码若无必要无需更改 ***
            if (! empty($params["TemplateParam"]) && is_array($params["TemplateParam"])) {
                $params["TemplateParam"] = json_encode($params["TemplateParam"], JSON_UNESCAPED_UNICODE);
            }

            // 此处可能会抛出异常，注意catch
            $content = self::aliyunRequest(
                $accessKeyId,
                $accessKeySecret,
                $type == 1 ? "dysmsapi.aliyuncs.com" : "sms11.hzgxr.com:40081",
                array_merge(
                    $params,
                    [
                        "RegionId" => "cn-hangzhou",
                        "Action"   => "SendSms",
                        "Version"  => "2017-05-25",
                    ]
                )
                // fixme 选填: 启用https
                // ,true
            );

            $result = (array) $content;
            if (
                ($type == 1 && $result['Code'] == 'OK') ||
                ($type == 2 && $result['result'] == 0)
            ) {
                return true;
            } else {
                throw new \Exception('验证码发送失败~');
            }
        } catch (\Exception $e) {
            abort($e->getMessage());
        }
    }

    /**
     * 自己的平台发送短信，GET 请求方式
     * @ param string $url 请求的地址
     * @ param string $data 请求的参数，一半都为空
     */
    private static function smsGet(string $url, string $data = null)
    {
        $ch      = curl_init();
        $timeout = 5;
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // 跳过证书检查
        // curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, true); // 从证书中检查SSL加密算法是否存在
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, $timeout);
        $file_contents = curl_exec($ch);
        curl_close($ch);
        return $file_contents;
    }

    /**
     * 阿里云生成签名并发起请求
     *
     * @param $accessKeyId string AccessKeyId (https://ak-console.aliyun.com/)
     * @param $accessKeySecret string AccessKeySecret
     * @param $domain string API接口所在域名
     * @param $params array API具体参数
     * @param $security boolean 使用https
     * @return bool|\stdClass 返回API接口调用结果，当发生错误时返回false
     */
    private static function aliyunRequest(string $accessKeyId, string $accessKeySecret, string $domain, array $params, bool $security = false)
    {
        $apiParams = array_merge(
            [
                "SignatureMethod"  => "HMAC-SHA1",
                "SignatureNonce"   => uniqid(mt_rand(0, 0xffff), true),
                "SignatureVersion" => "1.0",
                "AccessKeyId"      => $accessKeyId,
                "Timestamp"        => gmdate("Y-m-d\TH:i:s\Z"),
                "Format"           => "JSON",
            ],
            $params
        );
        ksort($apiParams);

        $sortedQueryStringTmp = "";
        foreach ($apiParams as $key => $value) {
            $sortedQueryStringTmp .= "&" . self::encode($key) . "=" . self::encode($value);
        }

        $stringToSign = "GET&%2F&" . self::encode(substr($sortedQueryStringTmp, 1));
        $sign         = base64_encode(hash_hmac("sha1", $stringToSign, $accessKeySecret . "&", true));
        $signature    = self::encode($sign);
        $url          = ($security ? 'https' : 'http') . "://{$domain}/?Signature={$signature}{$sortedQueryStringTmp}";

        try {
            $content = self::fetchContent($url);
            return json_decode($content);
        } catch (\Exception $e) {
            return false;
        }
    }

    private static function encode($str)
    {
        $res = urlencode($str);
        $res = preg_replace("/\+/", "%20", $res);
        $res = preg_replace("/\*/", "%2A", $res);
        $res = preg_replace("/%7E/", "~", $res);
        return $res;
    }

    private static function fetchContent($url)
    {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_TIMEOUT, 5);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt(
            $ch,
            CURLOPT_HTTPHEADER,
            [
                "x-sdk-client" => "php/2.0.0"
            ]
        );

        if (substr($url, 0, 5) == 'https') {
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
            curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
        }

        $rtn = curl_exec($ch);
        if ($rtn === false) {
            trigger_error("[CURL_" . curl_errno($ch) . "]: " . curl_error($ch), E_USER_ERROR);
        }
        curl_close($ch);
        return $rtn;
    }
}