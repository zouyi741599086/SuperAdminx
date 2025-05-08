<?php
namespace app\common\logic;

use app\common\model\FileModel;
use app\utils\AliyunOss;
use app\utils\QcloudCos;

/**
 * 附件操作
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class FileLogic
{
    /**
     * 添加文件
     * @param string $disk 存在哪，标识 public | aliyun
     * @param string $url 文件的访问路劲
     * @param int $fileSize 文件的大小
     * @param string $object 文件在oss存的路劲
     * @param string $versioin_id 阿里云oss中文件的版本id
     */
    public static function create(string $disk, string $url, int $fileSize = 0, ?string $object = null, ?string $version_id = null)
    {
        return FileModel::create([
            'disk'       => $disk,
            'object'     => $object,
            'url'        => $url,
            'size'       => $fileSize,
            'suffix'     => self::getFileSuffix($url),
            'count'      => 0,
            'version_id' => $version_id ?: '',
        ]);
    }

    /**
     * 获取文件的后缀
     * @param string $file_url 文件地址
     * @return string
     */
    private static function getFileSuffix(string $file_url)
    {
        // 使用parse_url()获取路径部分  
        $pathInfo = parse_url($file_url, PHP_URL_PATH);

        // 使用basename()获取文件名（包括扩展名），并去除查询字符串（如果有）  
        $filenameWithExtension = basename($pathInfo);
        $filenameParts         = explode('?', $filenameWithExtension);
        $filename              = $filenameParts[0];

        // 使用pathinfo()获取扩展名  
        return pathinfo($filename, PATHINFO_EXTENSION);
    }

    /**
     * 文件使用次数+1
     * @param array $where 更新条件
     */
    public static function incCount(array $where)
    {
        if ($where) {
            FileModel::where($where)->inc('count')->update();
        }
    }

    /**
     * 文件使用次数-1
     * @param array $where 更新条件
     */
    public static function decCount(array $where)
    {
        if ($where) {
            FileModel::where($where)->dec('count')->update();
        }
    }

    /**
     * 删除文件
     * @param array $where 要删除的文件
     */
    public static function delete(array $where)
    {
        if (! $where) {
            return false;
        }
        $files = FileModel::where($where)->select();
        foreach ($files as $v) {
            // 说明文件是本地
            if ($v['disk'] == 'public') {
                @unlink("./public{$v['url']}");
            }
            // 说明是阿里云oss
            if ($v['disk'] == 'aliyun') {
                AliyunOss::delete($v['object']);
            }
			// 说明是腾讯云cos
            if ($v['disk'] == 'qcloud') {
                QcloudCos::delete($v['object']);
            }
        }
        FileModel::where($where)->delete();
    }
}