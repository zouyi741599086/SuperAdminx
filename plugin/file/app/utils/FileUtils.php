<?php
namespace plugin\file\app\utils;

//use Intervention\Image\ImageManagerStatic as Image; // 图片处理类 https://image.intervention.io/v2
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Imagick\Driver;
use support\Log;
use plugin\file\app\common\logic\FileLogic;
use plugin\file\app\utils\AliyunOssUtils;
use plugin\file\app\utils\QcloudCosUtils;

/**
 * 文件操作
 * 
 * FileUtils::upload(string $disk = '') 文件上传，数据会记录到file表
 * FileUtils::uploadPublic() 文件上传到本地，数据不会记录到file表
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 */
class FileUtils
{
    // 允许上传的文件后缀
    public static $fileSuffix = ['png', 'jpg', 'jpeg', 'gif', 'rar', 'zip', 'txt', 'mp3', 'mp4', 'pdf', 'xlsx', 'xls', 'ppt', 'pptx', 'doc', 'docx'];

    // 允许上传的文件类型
    public static $fileMimeType = ['image/png', 'image/jpeg', 'image/gif', 'application/x-rar-compressed', 'application/rar', 'application/zip', 'text/plain', 'audio/mpeg', 'audio/mp3', 'video/mp4', 'video/x-m4v', 'application/pdf', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

    /**
     * 文件上传，上传的数据会记录到file表进行管理
     * @param string $disk 上传到哪，public》本地，aliyun》阿里云，qcloud》腾讯云
     * @throws \Exception
     */
    public static function upload(string $disk = '')
    {
        $disk    = $disk ?: config('plugin.file.superadminx.file_system.default');
        $request = request();
        $width   = intval($request->post('width')) ?: null;
        $height  = intval($request->post('height')) ?: null;
        $files   = self::uploadPublic();

        foreach ($files as $key => $path) {
            $fileSuffix = substr(strrchr($path, '.'), 1);
            $fileSize   = filesize("./public{$path}");

            // 图片裁剪 https://image.intervention.io/v2
            if (($width || $height) && in_array($fileSuffix, ['jpg', 'jpeg', 'png'])) {
                self::imageCrop($path, $width, $height);
            }
            // 如果上传的是图片，则读取图片的Orientation信息，判断是否需要旋转90度使其显示正常，主要是苹果手机
            if (in_array($fileSuffix, ['jpg', 'jpeg'])) {
                self::imageOrientation($path, $fileSuffix);
            }

            // 上传到本地的时候
            if ($disk == 'public' && config('plugin.file.superadminx.clear_file')) {
                // 存入file表
                FileLogic::create($disk, $path, $fileSize);
            }
            // 阿里云的时候
            if ($disk == 'aliyun') {
                $path = AliyunOssUtils::upload($path);
            }
            // 腾讯云的时候
            if ($disk == 'qcloud') {
                $path = QcloudCosUtils::upload($path);
            }
            $files[$key] = $path;
        }
        return $files;
    }

    /**
     * 文件上传到本地，目的是把upload函数拆分，比如导入数据的时候可以用来上传到tmp_file目录则不记录数据到file表
     * @param string $dir 上传的目录，默认/storage
     * @return array
     */
    public static function uploadPublic(string $dir = '') : array
    {
        $result   = [];
        $request  = request();
        $files    = $request->file();
        $datePath = date('Y/m/d');

        try {
            foreach ($files as $key => $file) {
                if (! $file || ! $file->isValid()) {
                    throw new \Exception('找不到上传的文件');
                }
                $mimeType = $file->getUploadMimeType();
                $suffix   = $file->getUploadExtension();
                $size     = $file->getSize();
                if (! in_array($suffix, self::$fileSuffix) || ! in_array($mimeType, self::$fileMimeType)) {
                    throw new \Exception('不允许上传的文件类型');
                }
                if ($size > config('server.max_package_size')) {
                    throw new \Exception('文件太大，超出允许上传的范围');
                }
                $time = time();
                $rand = mt_rand(0, 100000);
                // 上传的目录
                if ($dir) {
                    $path = "{$dir}/{$time}_{$rand}.$suffix";
                } else {
                    $path = "/storage/{$datePath}/{$time}_{$rand}.$suffix";
                }
                $file->move(public_path() . $path);
                $result[$key] = $path;
            }
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            abort($e->getMessage());
        }

        return $result;
    }

    /**
     * 则读取图片的Orientation信息，判断是否需要旋转90度使其显示正常，主要是苹果手机
     * 需要开启php的 exif扩展
     * @param string $path 图片的路劲
     * @param string $fileSuffix 图片的后缀
     * @return void
     */
    public static function imageOrientation(string $path, string $fileSuffix) : void
    {
        try {
            if (in_array($fileSuffix, ['jpg', 'jpeg'])) {
                $exifData = exif_read_data(public_path() . $path);
                if (isset($exifData['Orientation'])) {
                    $manager = new ImageManager(new Driver());
                    $image   = $manager->read("public/{$path}");
                    // 需要逆时针90度
                    if ($exifData['Orientation'] == 6) {
                        $image->rotate(-90)->save("public/{$path}", 100);
                    }
                    // 需要顺时针90度
                    if ($exifData['Orientation'] == 8) {
                        $image->rotate(90)->save("public/{$path}", 100);
                    }
                    // 需要180度
                    if ($exifData['Orientation'] == 3) {
                        $image->rotate(-180)->save("public/{$path}", 100);
                    }
                }
            }
        } catch (\Exception $e) {
            Log::error($e->getMessage(), []);
        }
    }

    /**
     * 图片裁剪成指定宽高
     * @param string $path 图片地址 如 /storage/xx/xx.jpg
     * @param int $width 宽
     * @param int $height 高
     * @return void
     */
    public static function imageCrop(string $path, ?int $width, ?int $height) : void
    {
        try {
            $path    = "public/{$path}";
            $manager = new ImageManager(new Driver()); // gd 或 imagick
            $image   = $manager->read($path);
            // 如果有宽无高
            if ($width && ! $height) {
                $bili   = $width / $image->width();
                $height = intval($bili * $image->height());
            }
            // 如果有高无宽
            if ($height && ! $width) {
                $bili  = $height / $image->height();
                $width = intval($bili * $image->width());
            }
            $image->coverDown($width ?: $image->width(), $height ?: $image->height())->save($path, 100);
        } catch (\Exception $e) {
            Log::error($e->getMessage(), []);
        }
    }
}