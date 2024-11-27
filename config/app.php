<?php
/**
 * This file is part of webman.
 *
 * Licensed under The MIT License
 * For full copyright and license information, please see the MIT-LICENSE.txt
 * Redistributions of files must retain the above copyright notice.
 *
 * @author    walkor<walkor@workerman.net>
 * @copyright walkor<walkor@workerman.net>
 * @link      http://www.workerman.net/
 * @license   http://www.opensource.org/licenses/mit-license.php MIT License
 */

use support\Request;

return [
    'debug'               => getenv('DE_BUG') == 'true' ? true : false,
    'error_reporting'     => E_ALL,
    'default_timezone'    => 'Asia/Shanghai',
    'request_class'       => Request::class,
    'public_path'         => base_path(false) . DIRECTORY_SEPARATOR . 'public',
    'runtime_path'        => base_path(false) . DIRECTORY_SEPARATOR . 'runtime',
    'controller_suffix'   => '',
    'controller_reuse'    => true,

    //数据解密私钥
    'rsa_private'         => "-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEAlWJRE4Gv42WoR5l9o8ulHkw+7TF+YrFAa2lzQ/Yykum4fNvs
rk2CcDdMI4GZ9xXaYFxopdNAQmd5kPQwQwWqPop0TBoF3ENuMv6vRZBYtd6wbrCu
8PrVSQTmnlDQ70iNdDhqqthPGMxxo1giAhbf88iu6Ep+APDqL65lkR8rRAV6xfEJ
K8hN4ZMCQZC9+kGRwSWUvNKh/5pn0dww+LBWs43bWUyhwix7QNYU4lrJrT495xcD
kZTOFF8B5KTpdxlnKOM5g5d0f1Brrpfil6SaxHPGezFttUPmshwzls/E7UJ+3xwc
ABHZt04qZlwJFS4kmzT4Km0M009TmP+jtmG7swIDAQABAoIBAQCNL2LZQNTv4oBt
S1BHoozoWb+PhhuhQ01TN1LNhL6/w02uFF1ZT8BcNqcrV64grPK76Bqvvz0YhZuL
uH50mcIRYeIQmve2+bQJVlRpNsfg/BtcQnjVIPy8Cnm8Xz1ZKgUnNrr5xX7cPT2Z
2A4sU1pOmflVajI0yX1Mm1M7GW5W1jG4w8S/qbC7tSy5p4jfrF4zDwf8vN9Yc9ef
uDZ3tT8VzuVduvgt6GCacQu/mirLTkVY0XBA+lzRjwZ1ioPLokuA8Wii+EQxbWEW
SAM2xEtRyopeUKuxiJ9NUKWMXgJZlZ2yd2EJLP7ntPYTVAOFH5mz2WBOvoEgI4uc
oNFuy3QhAoGBAODIYWD36KIepQc5Erde1RHcZakzV7iPiHuXqbweFUvfFktTVfOF
q3hmijnur6C4f2escYJfRtixaLhpSMqwqMDstgUdv8yqhkZHW6gkcU/YmWJt3tkb
T7XUX24jrfyVWc9h0ukMgPTQ3sMf5S5hZrixiu9pbkCMBUPMTVSKOh8fAoGBAKoh
UGHgl1/S15gkkBGFh7hi3kKtx/e/xlZqPXlvBAa74CXzWNcqkHVTeFFRtkJ5vfU7
CCGD3PyxsE50qQnnGVBN4PO0vxvc+6p9AOelRzjG5WaLe7RAVPds8FsxjQPpC2wn
WPTJ0GCOu5e2k5eHC/O5+Qpj27NnOgKSu6ypy5TtAoGABrj3cJb5dh/Ef7rNPH6x
kJ8uyyil7vcb9dZLVTzxFhvN5uLPJ0FQJ4GpkKH6zqu147vciTGgRMrJfvpnGui9
o0dxCiYhnlVbPq7TpuuwF9s6ex8eExAmCiIX2ItooK02ymT6kc217ZxxjRRfHkv7
bnqg1RgqG/QUFDr/9Q9NPbECgYAyQzleUV4nf0EWv+aYZpzcSsljZbgoZ84PBcA3
uia0XpkwXR6oIvke0JRBYiS4qwMGCnSygiStu0ldRHYUaOQ/p2KIXaQAdV8c1WWJ
CnlqOsjXbOoVLNRtbQ/twUvqFdW8FDvhxiX8AO9HOTeNkuZjEVSUT0A/VoX68KLl
thxhWQKBgQDVcLCwrjBm2xHwiGSKXFfgH6py8QpbJUfVtp9P0DT3YvvCO3My3Y2R
30FkoHxv2RntvE5BkjPM33msFmpmlRkjiUjfNnJyYAipIR67kuSQrmnND0+IuBtD
QC5av/7KVnngk9F7M/d0vUagjzWaetGYT1VXckmPhFISD7JVC+dW0g==
-----END RSA PRIVATE KEY-----",
    //上传文件的配置
    'file_system'         => [
        //本地》public，阿里云》aliyun
        'default' => 'public',
        //阿里云
        'aliyun'  => [
            'AccessKeyID'     => '',
            'AccessKeySecret' => '',
            //阿里云oss Bucket所在地域对应的Endpoint，debug用外网，否则用内网
            'endpoint'        => getenv('DE_BUG') == 'true' ? '//oss-cn-hangzhou.aliyuncs.com' : '//oss-cn-hangzhou-internal.aliyuncs.com',
            //阿里云oss Bucket文件访问地址
            'bucket_url'      => 'https://xxxx.oss-cn-hangzhou.aliyuncs.com',
            //阿里云oss bucket的名称
            'bucket'          => 'xxxxx',
        ],
    ],
    //网站的url，上传的资源访问的url也在用
    'url'                 => getenv('DE_BUG') == 'true' ? 'http://192.168.1.192:8794' : 'https://www.superadminx.com',
    //微信公众号的
    'wechat_gongzhonghao' => [
        'AppID'     => '',
        'AppSecret' => ''
    ],
    //微信小程序的
    'wechat_xiaochengxu'  => [
        'AppID'     => '',
        'AppSecret' => ''
    ],
    //微信支付的
    'wechat_pay'          => [
        //商户号
        'mch_id'               => '',
        //v2商户私钥
        'mch_secret_key_v2'    => '',
        //v3 商户秘钥
        'mch_secret_key'       => '',
        // 必填-商户私钥 字符串或路径
        // 即 API证书 PRIVATE KEY，可在 账户中心->API安全->申请API证书 里获得
        // 文件名形如：apiclient_key.pem
        'mch_secret_cert'      => './config/wechat_cert/apiclient_key.pem',
        // 必填-商户公钥证书路径
        // 即 API证书 CERTIFICATE，可在 账户中心->API安全->申请API证书 里获得
        // 文件名形如：apiclient_cert.pem
        'mch_public_cert_path' => './config/wechat_cert/apiclient_cert.pem',
    ],
    //微信开放平台的
    'wechat_open'         => [

    ],
    //腾讯地图的key
    'tencent_map_key'     => 'OTKBZ-AIRCL-GHOPV-M7I2V-4Q6GH-OCFMS',
    //短信配置
    'sms'                 => [
        //凯凌短信
        'sms_uid'         => "",
        'sms_password'    => "",
        //阿里云或小牛短信
        'type'            => 1, //类型，1》阿里云短信，2》小牛云短信
        'accessKeyId'     => '',
        'accessKeySecret' => '',
        'signName'        => '' //签名
    ],
    //jwt权限验证
    'jwt'                 => [
        //token是在header哪个key上获取
        'header_key' => 'token',
        //token存的地方，mysql || redis，需要设置redis及安装扩展https://www.workerman.net/doc/webman/db/redis.html
        'db'         => 'mysql',
        //存token的时候key的前缀，最好用应用名称
        'key_prefix' => 'haili_lvshihan',
        //多应用配置
        'app'        => [
            [
                //应用名称，需要唯一
                'name'       => 'admin_pc',
                //生成token的数组里面能代表唯一性的字段
                'key'        => 'id',
                //同一个用户允许登录的终端设备数量
                'num'        => 100,
                //token过期时间，单位秒
                'expires_at' => 24 * 60 * 60,
            ],
            [
                'name'       => 'user_pc',
                'key'        => 'id',
                'num'        => 1,
                'expires_at' => 24 * 60 * 60,
            ],
        ]
    ]
];
