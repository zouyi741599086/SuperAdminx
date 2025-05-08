<?php
/**
 * This file is part of SuperAdminx.
 *
 * Licensed under The MIT License
 * For full copyright and license information, please see the MIT-LICENSE.txt
 * Redistributions of files must retain the above copyright notice.
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 */

return [
    'version'             => '2.0.1',
    //上传文件的配置
    'file_system'         => [
        //本地》public，阿里云》aliyun，腾讯云》qcloud
        'default' => 'qcloud',
        //阿里云，需要安装sdk composer require aliyuncs/oss-sdk-php
        'aliyun' => [
			'AccessKeyID' => '',
			'AccessKeySecret' => '',
			//阿里云oss Bucket所在地域对应的Endpoint，debug用外网，否则用内网
			'endpoint' => getenv('DE_BUG') == 'true' ? '//oss-cn-hangzhou.aliyuncs.com' : '//oss-cn-hangzhou-internal.aliyuncs.com',
			//阿里云oss Bucket文件访问地址
			'bucket_url' => 'https://changxiangzhongguo.oss-cn-hangzhou.aliyuncs.com',
			//阿里云oss bucket的名称
			'bucket' => 'changxiangzhongguo',
		],
        //腾讯云，需要安装sdk composer require qcloud/cos-sdk-v5
        'qcloud'  => [
            'SecretId'   => '',
            'SecretKey'  => '',
            'region'     => 'ap-guangzhou',
            //腾讯云cos Bucket文件访问地址也是上传地址，格式“存储桶名称.cos.所属地域.myqcloud.com”
            'bucket_url' => '', 
            //腾讯云cos bucket的名称
            'bucket'     => ''
        ],
    ],
    //网站的url，上传的资源访问的url也在用
    'url'                 => getenv('DE_BUG') == 'true' ? 'http://127.0.0.1:' . getenv('LISTEN_PORT') : 'https://www.superadminx.com',
    //api请求中数据是否加解密，需要跟前端的开关对应
    'api_encryptor'       => [
        //开关
        'enable'      => getenv('DE_BUG') == 'true' ? false : true,
        //不加密的url，上传接口则不加密
        'url'         => ['/admin/File/upload', '/api/File/upload', '/admin/File/download', '/api/File/download'],
        //数据解密私钥，左边不要有空格，百度“rsa密钥在线生成”，需2048位PKCS1格式
        'rsa_private' => <<<EOF
-----BEGIN RSA PRIVATE KEY-----
MIIEpQIBAAKCAQEAqNoRA7DlwWAp5N3Ax5ebvt2ixWPaYOZXU+cprnubb75zoCby
ks9zajuYPeSLUHF/jeg11aMcm/VC2URT/lpN0PbdhvjASPhVw5Sr//TSfZpXWzAc
VvbT/6i+vaQ3tUdXtstL9kG59bUUgAP2geYzFVNSHHLwxDiuX+Cve6nXPY2hD01K
Q5VqSmD5k8Lm3OrxU7FzCCipGT8DfPJrRMU+T+UrESQOKK1Y96Q274z0XI6tM29f
76lBX/uUooodMn8OufBaah/+yb3FCq3bydInvUgn2HeTk8+vv9uVLZKXcyIHQNTG
Ok/fUZFLxx88k1Pnkh37EKA6cb4hzB6FGBMaPwIDAQABAoIBAGE/XsdCbcEG0noW
4X3Sqoet/J402UQvxaH0JARy+l3MUamuZMz7H9zSP+d9pmMJS05+q+rEC6kjA4JA
oSN//QtZ8tJWl+Au7q47BSjgZw6iAqfpOJk5hXXcSSbN2qvUUAdeZPyKdEC4Lvtf
zOyZmVgx6buq01If1wYvUMInWmj/JmEe7/vShway4L12HTYql6NOrwcBwPCkNHzx
U5g0yTDrHzZpjgBjR/iVLhP/vy9YdPJEi3UCCeoU660YFkj3Z+Pr9nKPkDf77vxm
7thkHOwbc6usUE6A5urardcO3Pufcu3TgNFnA8qOmlZ/ordOiFmcmnwhb9CkI6gO
UwXLX2kCgYEA1wqH6Hpdj2RaLyi86Jb9NXqtdDjhE7rQcsZgXIn4AldCLVPBpX8r
42b+fMBbpyplbzE+S/A5gUfdfKRQbh1Anx1/p8Ko1aTVdjJdTFrp+IYiknNjuDWx
Oq0Gz3VLnPsM3PWh42KAfaPqG3J+fwYevFnwyDkpUeVqrIflzdcOVrUCgYEAyQNU
vWrRYamTd6MZ1Xf2ojDU1B3qbZ1kOmSkFNZEhQanWDS8Lx77IB8w7IIZ7aU/HQOn
QzS+EtMWfgpQJrrrKAqdIiOTYjNOLCFvkUoV+g3HWCEESOWrcjFViZUc3dEt9uwd
L1r7YliNXL9eaFTplq2Xz0481NoGZRpR/j58caMCgYEAvFat1/AsN2VmEz2zzmZH
mOo8NrmGcBhDbvLN/N6dx7cS784WoVMzZjSTmUGERHG+a1eOv0XDp7YAh6UGCJs4
OOPGJXE5G/0FNENCMZjCqPcaGnhTk0f7VG+sslCCDBhZGMFNq3BfJytD5AwwPCJp
EwAXAdYGmYK8HiXcIJ9FIK0CgYEAlw7bxaTaSIxI9+Un6tXGEEimB+mbXFilE4TC
Ea6bu2QuqginSrn7ej42Y+W5Wm+OKF2wer7OABOFmZ5icViSk3q2bwtRHMD1hBB0
aTjFny5vmfjl4WpHFv+gCk52bPNfmWoC3K2AsH1fbk2Zwsnc6JD3vqBK8qINoDjR
WUDYAAUCgYEAzMJ/qhy+QzKZA1tV1dYR+wpZYTV9z9a3Fkk/k3TXBu7g6yZfjTVd
cd7aSjZ/fuFc6mIFUQnSAkQvNsLYJcE1rw8F8nJvw/Aas9WuDiqnXPxpfDIQQ0xG
fRsED8dQS0FS+41+8l3q/5XtbXOLfbqivMDTrhB3FLG8B7YDW7th8fM=
-----END RSA PRIVATE KEY-----    
EOF,
    ],
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
        'key_prefix' => 'SuperAdminx',
        //多应用配置
        'app'        => [
            [
                //应用名称，需要唯一
                'name'       => 'admin_pc',
                //生成token的数组里面能代表唯一性的字段
                'key'        => 'id',
                //生成token的字段
                'field'      => ['id', 'name', 'tel'],
                //同一个用户允许登录的终端设备数量
                'num'        => 100,
                //token过期时间，单位秒
                'expires_at' => 24 * 60 * 60,
            ],
            [
                'name'       => 'user_pc',
                'key'        => 'id',
                'field'      => ['id', 'name', 'tel'],
                'num'        => 1,
                'expires_at' => 365 * 24 * 60 * 60,
            ],
        ]
    ]
];
