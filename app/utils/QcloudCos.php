<?php
namespace app\utils;

use Qcloud\Cos\Client;
use app\common\logic\FileLogic;
use app\common\model\FileModel;

/**
 * 腾讯云cos操作
 * 需要安装sdk composer require qcloud/cos-sdk-v5
 * 腾讯云cos进入到对应的Bucket,左侧的数据安全》版本控制，需要开启，上传后保存文件的版本id，删除需要指定文件的版本id才会永久删除文件
 * 
 * QcloudCos::upload($filePath) 上传文件到腾讯云，返回访问连接，会删除本地的文件
 * QcloudCos::download($object, $localfile) 下载文件到本地
 * QcloudCos::delete($object) 删除文件
 * QcloudCos::signUrl($object, $timeout = 0) 获取文件访问的连接
 * QcloudCos::getSignature($dir = '') 客户端直接传腾讯云的时候获取签名
 * QcloudCos::uploadQcloudOssCallback() 客户端直接传腾讯云后的回调
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class QcloudCos
{

    public static $cosClient;

    /**
     * 初始化腾讯云
     * @return mixed
     */
    private static function initOssClient()
    {
        if (self::$cosClient) {
            return self::$cosClient;
        }
        return self::$cosClient = new Client([
            'region'      => config('superadminx.file_system.qcloud.region'),
            'scheme'      => 'https', //协议头部，默认为 http
            'credentials' => [
                'secretId'  => config('superadminx.file_system.qcloud.SecretId'),
                'secretKey' => config('superadminx.file_system.qcloud.SecretKey')
            ]
        ]);
    }

    /**
     * 文件上传到腾讯云，会添加到file表但使用次数不会加1
     * @param string $filePath 本地文件的路劲如 '/sotrage/2024-12-12/xxx.jpg'
     * @param bool $deleteFile 上传后是否删除本地文件
     * @return string 腾讯云访问资源的url
     */
    public static function upload(string $filePath, bool $deleteFile = true) : string
    {   
        try {
            $filePath = rtrim($filePath, '/');
            // 读取文件的后缀
            $fileInfo = pathinfo($filePath);
            // 读取文件的大小
            $fileSize = filesize(public_path() . "/{$filePath}");

            // 保存的目录
            $date    = date('Y-m-d');
            $time    = date('YmdHis');
            $rand    = mt_rand(0, 100000);
            $ossPath = "{$date}/{$fileInfo['extension']}/{$time}_{$rand}.{$fileInfo['extension']}";

            $result = (self::initOssClient())->Upload(
                config('superadminx.file_system.qcloud.bucket'),
                $ossPath,
                fopen(public_path() . $filePath, 'rb')
            );

            // 上传后访问的连接
            $url = config('superadminx.file_system.qcloud.bucket_url') . "/{$ossPath}";
            //存入file表数据库
            FileLogic::create(
                'qcloud',
                $url,
                $fileSize,
                $ossPath,
                $result['VersionId'] ?? null
            );

            // 删除本地的文件
            if ($deleteFile) {
                @unlink("./public/{$filePath}");
            }
        } catch (\Exception $e) {
            abort($e->getMessage());
        }
        // oss权限公共读
        return $url;
        // 如果oss权限不是公共读就需要这样返回
        // return $this->signUrl($object);
    }

    /**
     * 下载文件到本地
     * @param string $object oss中文件的路劲 如：2024-12-12/jgp/123.jpg
     * @param string $localfile 本地文件需要保存的路劲，如 ./storage/jpg/123.jpg
     * @return void
     */
    public static function download(string $object, string $localfile) : void
    {
        try {
            self::initOssClient()->download(
                config('superadminx.file_system.qcloud.bucket'),
                $object,
                public_path() . ltrim($localfile, '.'),
                [
                    // 'Progress'          => function ($totalSize, $downloadedSize)
                    // {
                    //     printf("downloaded [%d/%d]\n", $downloadedSize, $totalSize);
                    // }, //指定进度条
                    'PartSize'          => 10 * 1024 * 1024, //分块大小
                    'Concurrency'       => 5, //并发数
                    'ResumableDownload' => true, //是否开启断点续传，默认为false
                    'ResumableTaskFile' => 'tmp.cosresumabletask' //断点文件信息路径，默认为<localpath>.cosresumabletask
                ]
            );
        } catch (\Exception $e) {
            abort($e->getMessage());
        }
    }

    /**
     * 删除文件
     * @param string $object 删除文件的路劲名称 如：2024-12-12/jgp/123.jpg
     * @return void
     */
    public static function delete(string $object) : void
    {
        $version_id = FileModel::where('url', $object)->value('version_id');
        try {
            $params = [
                'Bucket' => config('superadminx.file_system.qcloud.bucket'),
                'Key'    => $object,
            ];
            if ($version_id) {
                $params['VersionId'] = $version_id;
            }

            self::initOssClient()->deleteObject($params);

        } catch (\Exception $e) {
            abort($e->getMessage());
        }
    }

    /**
     * 获取文件的url，当oss 不是公共读的时候
     * @param string $object oss中文件的路劲
     * @param int $timeout url有效期，默认图片30分钟，视频3小时
     * @return string 文件的访问链接
     */
    public static function signUrl(string $object, int $timeout = 0) : string
    {

        try {
            // 设置文件访问的url过期时间
            if (! $timeout) {
                $tmp    = explode('.', $object);
                $suffix = end($tmp);
                if (in_array($suffix, ['jpg', 'png', 'jpeg', 'gif'])) {
                    $timeout = 30 * 60;
                } else {
                    $timeout = 3 * 60 * 60;
                }
            }
            // 生成签名URL。
            return self::initOssClient()->getObjectUrl(config('superadminx.file_system.qcloud.bucket'), $object, $timeout);
        } catch (\Exception $e) {
            abort($e->getMessage());
        }
    }

    /**
     * 客户端直传的时候获取签名
     * @param string $dir 上传的文件路劲 如 image/jpg/123.jpg
     * @return array
     */
    public static function getSignature(string $dir)
    {
        $secretId  = config('superadminx.file_system.qcloud.SecretId');
        $secretKey = config('superadminx.file_system.qcloud.SecretKey');
        $bucket    = config('superadminx.file_system.qcloud.bucket');
        $region    = config('superadminx.file_system.qcloud.region');
        $bucket_url  = config('superadminx.file_system.qcloud.bucket_url');

        $cosHost        = $bucket_url;
        $cosKey         = $dir;
        $now            = time();
        $exp            = $now + 9000;
        $expiration     = gmdate('Y-m-d\TH:i:s\Z', $exp);
        $qKeyTime       = "$now;$exp";
        $qSignAlgorithm = 'sha1';

        $policy = json_encode([
            'expiration' => $expiration,
            'conditions' => [
                ['q-sign-algorithm' => $qSignAlgorithm],
                ['q-ak' => $secretId],
                ['q-sign-time' => $qKeyTime],
                ['bucket' => $bucket],
                ['key' => $cosKey],
            ],
        ]);

        $signKey      = hash_hmac('sha1', $qKeyTime, $secretKey);
        $stringToSign = sha1($policy);
        $qSignature   = hash_hmac('sha1', $stringToSign, $signKey);

        return [
            'cosHost'        => $cosHost,
            'cosKey'         => $cosKey,
            'policy'         => base64_encode($policy),
            'qSignAlgorithm' => $qSignAlgorithm,
            'qAk'            => $secretId,
            'qKeyTime'       => $qKeyTime,
            'qSignature'     => $qSignature,
        ];
    }

    /**
     * 前端直传腾讯云后的回调
     * 用于把上传的文件写入到数据库
     * @return void
     */
    public static function uploadQcloudOssCallback() : void
    {
        $post = request()->post();
        try {
            // 获取文件的元信息
            $exist = self::initOssClient()->getObjectMeta(config('superadminx.file_system.qcloud.bucket'), $post['filename']);
            // 获取文件的版本id
            $version_id = $exist['x-oss-version-id'] ?? null;

            FileLogic::create(
                'qcloud',
                config('superadminx.file_system.qcloud.bucket_url') . "/{$post['filename']}",
                $post['size'],
                $post['filename'],
                $version_id
            );
        } catch (\Exception $e) {
            abort($e->getMessage());
        }
    }
}