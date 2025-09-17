<?php

use plugin\file\app\utils\FileUtils;

/**
 * 文件上传，上传的数据会记录到file表进行管理
 * @param string $disk 上传到哪，public》本地，aliyun》阿里云，qcloud》腾讯云
 * @throws \Exception
 * @return array
 */
function upload(string $disk = '') : array
{
    return FileUtils::upload($disk);
}

/**
 * 文件上传到本地，目的是把upload函数拆分，比如导入数据的时候可以用来上传到tmp_file目录则不记录数据到file表
 * @param string $dir 上传的目录，默认/storage
 * @return array
 */
function upload_public(string $dir = '') : array
{
    return FileUtils::uploadPublic($dir);
}