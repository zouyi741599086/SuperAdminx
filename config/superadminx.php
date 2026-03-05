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
    'version'             => '4.0.0',
    // 导出的文件，存到哪，如果是分布式部署应该就要存阿里云或腾讯云等才行
    'export_path_type'    => 'public', // public》本地，aliyun》阿里云，qcloud》腾讯云，如果分布式部署肯定不是贝蒂
    //网站的url，上传的资源如果是本地的话访问的url也在用
    'url'                 => getenv('DE_BUG') == 'true' ? 'http://127.0.0.1:' . getenv('LISTEN_PORT') : 'https://preview.superadminx.com',
    //api请求中数据是否加解密，需要跟前端的开关对应
    'api_encryptor'       => [
        //开关
        'enable'      => getenv('DE_BUG') == 'true' ? false : true,
        //数据解密私钥，左边不要有空格，百度“rsa密钥在线生成”，需2048位PKCS1格式
        'rsa_private' => <<<EOF
-----BEGIN RSA PRIVATE KEY-----
MIIEoQIBAAKCAQEAtRjX81sJAu8pyN4IQyXo9WE5GYevieBcTiDhGTknKCGMH3sO
rdFkj5RwNFzsH5cy//5Otutj4rarHebv5CUoXfyBlDwCeyO1ampnZPUEJP50XW54
eER5+NH+BFlGxMJJRhuWe9RXRmjdI6iq5trDClr2MrAvFY1e8whjPSka9KXDOdK6
8bH52goy0bWwDBPWS+8p+f3Le9j82L9sdz2AcyoBkwMykgAV80QuE5TTFAwk3ERZ
f0Koj4QJMYrAEz3qc3B7mAVtbWjUWW7/EhnUi2NbsBkUh/n6ftxT86X+g7+nBDSC
KGJ+o2z/e3cEc1GZa6pyNUYEt2dsaYad+0vfNwIDAQABAoH/HGn0Irql2fqsaQJt
SXEpRqwlHrGrWSFar5Ijv1Fi/hOavgBmIoo4Ek8NS9Sd4lcBftOShiC+C1RIhOiM
Zb9uwKWzBGRl/0FwYBdRzFqlISjLbogRXs1fqyqc2xHRiLhIcYzij4tBe5/4Z8qP
Bf73myhVI0mBbwrqBY0gr6KYwsmmaTHrdZCSxz1sG+yiSKJqu27qKBl30lgkMK+Q
iWBrqP0zOjXudyntvk8ZRy960cEixpL81/fVsVZsJKeMd5OFch0ESdbd0q6ysH6+
cRKari4p/1UJfvqSN87JScb1tD3kv+XF+9IIazWcWek7SavSMg0R81mLFKsrUDXA
ShB1AoGBANC4vsLGZB4FcWliDn2m4BKnI99/sKwGRl6KeC11mR4eq3FB91WvVnqE
CYL7e9jNGvD/0bMZIrfbNFOi7g/ZpmB34AxVozkpPQhiEnabCJkPvz/wabCCt9S5
v3SqYDsuWjVJYp1oa1H+ggYfOpSzEvLkmtmMnKr++44R5WZhxmKjAoGBAN4eNwpO
dPQzQ5dpMd0m8bBPtRw6egEoKbE00uZ8LJ+0rBGXuQ7AEEG8UftFBlapTNdBFZ5s
x7Mhr6OfHh78P3J5HOOrZocmHdqXl2GQqvby7EUbD9W2jSN0F4iiGKF2GncYkPNQ
5QLBHcX8ftR1cgGq7gk+8q8ke0V+o/4+SG5dAoGBAJpBX2Jt4wI4/Zdny9PbZ9EB
S8bbBQQt4wXuCmF2fwI+onAi05u06RHE0Y7HM8GH3DhuqFlX40vEKokBajW2onq7
PY+AHxCYxK2UZZbYf2M3ux2THVlBUoFaAgBEBrjWSf8FzGcPC/neQdQqck4BhqiS
gUr027iYl+tomISxEEBHAoGAU+qmcMZjeT9E8hdUN3FXLn1ut1OAdJ9v4PtMErgn
Q89Gkv73c5MskSlM79mMI4Gi/lAgktIWQJ8hdHfRMXOrpNwNBhbjjXvhG4zaLIoz
jUkJ6rHmsZ9eg16A5aYYGCg+p3Aok0SkwP2k+gADCtG0WNzzQZr+pRzrVb4axxtQ
0iECgYAmuKj0FsdqRwwUeETsIm6506E5NDTaCmMjeE24/vST/eKmdlRxqM0Nw15x
dA25B2XhWojMMiZti6c4Ud7YkNkPSG+olBTh+AYshQKFekENQNjySLyyy/l94KMz
4CKDQzc7XuEh7xEMla7RUFfrbfA4Ea/5JCOLqKJxQEn9katZpA==
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
        'AppID'		=> '' ,
        'AppSecret'	=> ''
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
		// 微信支付公钥ID及证书路径，key 填写形如 PUB_KEY_ID_0000000000000024101100397200000006 的公钥id，见 https://pay.weixin.qq.com/doc/v3/merchant/4013053249
        'wechat_public_cert_path' => [
            'PUB_KEY_ID_0111057978072026012800291689001201' => './config/wechat_cert/pub_key.pem',
        ]
    ],
	// 支付宝支付
    'alipay'              => [
        'app_id'                  => '',
        // 应用私钥
        'app_secret_cert'         => "",
        // 应用公钥
        'app_public_cert_path'    => './config/alipay_cert/appCertPublicKey_2021006117656200.crt',
        // 支付宝公钥
        'alipay_public_cert_path' => './config/alipay_cert/alipayCertPublicKey_RSA2.crt',
        // 支付宝根证书
        'alipay_root_cert_path'   => './config/alipay_cert/alipayRootCert.crt',
    ],
    // 快递100的参数
    'kuaidi100'           => [
        'key'      => '',
        'customer' => '',
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
                'name'       => 'admin',
                //生成token的数组里面能代表唯一性的字段
                'key'        => 'id',
                //生成token的字段
                'field'      => ['id', 'name', 'tel'],
                //同一个用户允许登录的终端设备数量
                'num'        => 100,
                //token过期时间，单位秒
                'expires_at' => 3 * 24 * 60 * 60,
            ],
            [
                'name'       => 'weixin-mini',
                'key'        => 'id',
                'field'      => ['id', 'name', 'tel'],
                'num'        => 1,
                'expires_at' => 365 * 24 * 60 * 60,
            ],
            [
                'name'       => 'app',
                'key'        => 'id',
                'field'      => ['id', 'name', 'tel'],
                'num'        => 1,
                'expires_at' => 30 * 24 * 60 * 60,
            ],
            [
                'name'       => 'h5',
                'key'        => 'id',
                'field'      => ['id', 'name', 'tel'],
                'num'        => 1,
                'expires_at' => 7 * 24 * 60 * 60,
            ],
        ]
    ]
];
