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
	// 是否清理未使用的file，参考：https://superadminx.com/webman/upload.html#%E5%88%A0%E9%99%A4%E6%B2%A1%E4%BD%BF%E7%94%A8%E7%9A%84%E6%96%87%E4%BB%B6
    'clear_file'          => false,
    //上传文件的配置
    'file_system'         => [
        //本地》public，阿里云》aliyun，腾讯云》qcloud
        'default' => 'public',
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
];
