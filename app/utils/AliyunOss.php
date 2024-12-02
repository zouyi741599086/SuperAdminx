<?php
namespace app\utils;

use OSS\OssClient;
use OSS\Core\OssException;
use app\common\logic\FileLogic;
use app\common\model\FileModel;

/**
 * 阿里云oss操作
 * 安装 composer require aliyuncs/oss-sdk-php oss的sdk
 * 阿里云oss进入到对应的Bucket,左侧的数据安全》版本控制，需要开启，上传后保存文件的版本id，删除需要指定文件的版本id才会永久删除文件
 * 
 * AliyunOss::upload($filePath) 上传文件到阿里云，返回访问连接，会删除本地的文件
 * AliyunOss::download($object, $localfile) 下载文件到本地
 * AliyunOss::delete($object, $version_id) 删除文件
 * AliyunOss::signUrl($object, $timeout = 0) 获取文件访问的连接
 * AliyunOss::getSignature($dir = '') 客户端直接传阿里云的时候获取签名
 * AliyunOss::uploadAliyunOssCallback() 客户端直接传阿里云后的回调
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class AliyunOss
{

    public static $ossClient;

    /**
     * 初始化阿里云
     * @return mixed
     */
    private static function initOssClient()
    {
        if (self::$ossClient) {
            return self::$ossClient;
        }
        return self::$ossClient = new OssClient(
            config('superadminx.file_system.aliyun.AccessKeyID'),
            config('superadminx.file_system.aliyun.AccessKeySecret'),
            config('superadminx.file_system.aliyun.endpoint')
        );
    }

    /**
     * 文件上传到阿里云，会自动删除本地文件，会添加到file表但使用次数不会加1
     * @param string $filePath 本地文件的路劲如 '/sotrage/2024-12-12/xxx.jpg'
     * @param bool $deleteFile 上传后是否删除本地文件
     * @return string 阿里云访问资源的url
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
            $time    = time();
            $rand    = mt_rand(0, 100000);
            $ossPath = "{$date}/{$fileInfo['extension']}/{$time}_{$rand}.{$fileInfo['extension']}";

            // 开始上传oss
            $result = self::initOssClient()->uploadFile(
                config('superadminx.file_system.aliyun.bucket'),
                $ossPath,
                "./public/{$filePath}"
            );
            // 上传后访问的连接
            $url = config('superadminx.file_system.aliyun.bucket_url') . "/{$ossPath}";
            //存入file表数据库
            FileLogic::create(
                'aliyun',
                $url,
                $fileSize,
                $ossPath,
                $result[OssClient::OSS_HEADER_VERSION_ID]
            );
            // 删除本地的文件
            if ($deleteFile) {
                @unlink("./public/{$filePath}");
            }
        } catch (OssException $e) {
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
     * @param string $localfile 本地文件需要保存的路劲，如 ./storage/jpg/213.jpg
     * @return void
     */
    public static function download(string $object, string $localfile) : void
    {
        $version_id = FileModel::where('url', $object)->value('version_id');
        if (! $version_id) {
            abort('文件不存在');
        }
        try {
            $options = [
                OssClient::OSS_FILE_DOWNLOAD => $localfile,
                OssClient::OSS_VERSION_ID    => $version_id
            ];
            self::initOssClient()->getObject(
                config('superadminx.file_system.aliyun.bucket'),
                $object,
                $options
            );
        } catch (OssException $e) {
            abort($e->getMessage());
        }
    }

    /**
     * 删除文件
     * @param string $object 删除文件的路劲名称 如：2024-12-12/jgp/123.jpg
     * @param string $version_id 文件的版本id
     * @return void
     */
    public static function delete(string $object, string $version_id = null) : void
    {
        try {
            $params = [];
            if ($version_id) {
                $params[OssClient::OSS_VERSION_ID] = $version_id;
            }
            // 删除指定versionId的Object。
            self::initOssClient()->deleteObject(
                config('superadminx.file_system.aliyun.bucket'),
                $object,
                $params,
            );
        } catch (OssException $e) {
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
        $version_id = FileModel::where('url', $object)->value('version_id');
        if (! $version_id) {
            abort('文件不存在');
        }
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
            $options = [
                // 填写Object的versionId。
                self::initOssClient()::OSS_VERSION_ID => $version_id
            ];
            // 生成签名URL。
            return self::initOssClient()->signUrl(config('superadminx.file_system.aliyun.bucket'), $object, $timeout, "GET", $options);
        } catch (OssException $e) {
            abort($e->getMessage());
        }
    }

    /**
     * 客户端直传的时候获取签名
     * @param string $dir 阿里云保存的路劲 如 image/jpg/
     * @return array
     */
    public static function getSignature(string $dir = '') : array
    {
        // 用户上传文件时指定的目录
        $date = date('Y-m-d', time());
        $dir  = $dir ?: "{$date}/";

        // 设置回调参数
        $url             = config('superadminx.url');
        $callback_param  = [
            'callbackUrl'      => "{$url}/admin/File/uploadAliyunOssCallback", // 前端直传阿里云后的异步回调地址
            'callbackBody'     => 'filename=${object}&size=${size}&mimeType=${mimeType}&height=${imageInfo.height}&width=${imageInfo.width}',
            'callbackBodyType' => "application/x-www-form-urlencoded"
        ];
        $callback_string = json_encode($callback_param);

        $base64_callback_body = base64_encode($callback_string);
        $now                  = time();
        $expire               = 1 * 60 * 60;  // 设置该policy超时时间是10s. 即这个policy过了这个有效时间，将不能访问。
        $end                  = $now + $expire;
        $expiration           = str_replace('+00:00', '.000Z', gmdate('c', $end));

        // 最大文件大小.用户可以自己设置
        $condition    = [
            0 => 'content-length-range',
            1 => 0,
            2 => 1048576000
        ];
        $conditions[] = $condition;

        // 表示用户上传的数据，必须是以$dir开始，不然上传会失败，这一步不是必须项，只是为了安全起见，防止用户通过policy上传到别人的目录。
// 		$start = array(0 => 'starts-with', 1 => "{$dir}test.pptx", 2 => $dir);
// 		$conditions[] = $start;

        $arr            = [
            'expiration' => $expiration,
            'conditions' => $conditions
        ];
        $policy         = json_encode($arr);
        $base64_policy  = base64_encode($policy);
        $string_to_sign = $base64_policy;
        $signature      = base64_encode(hash_hmac('sha1', $string_to_sign, config('superadminx.file_system.aliyun.AccessKeySecret'), true));

        $response['accessid']  = config('superadminx.file_system.aliyun.AccessKeyID');
        $response['host']      = config('superadminx.file_system.aliyun.bucket_url');
        $response['policy']    = $base64_policy;
        $response['signature'] = $signature;
        $response['expire']    = $end;
        $response['callback']  = $base64_callback_body;
        $response['dir']       = $dir;  // 这个参数是设置用户上传文件时指定的前缀。
        return $response;
    }

    /**
     * 前端直传阿里云oss后的回调
     * 用于把上传的文件写入到数据库
     * @return void
     */
    public static function uploadAliyunOssCallback() : void
    {
        $post = request()->post();
        try {
            // 获取文件的元信息
            $exist = self::initOssClient()->getObjectMeta(config('superadminx.file_system.aliyun.bucket'), $post['filename']);
            // 获取文件的版本id
            $version_id = $exist['x-oss-version-id'];

            FileLogic::create(
                'aliyun',
                config('superadminx.file_system.aliyun.bucket_url') . "/{$post['filename']}",
                $post['size'],
                $post['filename'],
                $version_id
            );
        } catch (OssException $e) {
            abort($e->getMessage());
        }
    }
}