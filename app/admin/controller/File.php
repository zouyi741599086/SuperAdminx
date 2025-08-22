<?php
namespace app\admin\controller;

use support\Request;
use support\Response;
use app\utils\AliyunOssUtils;
use app\utils\QcloudCosUtils;
use app\utils\FileUtils;

/**
 * 文件
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class File
{
    // 此控制器是否需要登录
    protected $onLogin = true;
    // 不需要登录的方法
    protected $noNeedLogin = ['download', 'uploadAliyunOssCallback'];

    /**
     * 上传文件
     * @method post
     * @param Request $request 
     * @return Response
     */
    public function upload(Request $request) : Response
    {
        $result = FileUtils::upload($request->post('disk') ?: '');
        return is_array($result) ? result($result, 1, '上传成功', false) : result([], -1, '没有文件被上传', false);
    }

    /**
     * 下载文件
     * @method get
     * @param string $fileName
     * @param string $filePath
     * @return Response
     */
    public function download(string $fileName, string $filePath) : Response
    {
        try {
            if (! file_exists("{$filePath}")) {
                $filePath = public_path() . $filePath;
            }
            return response()->download($filePath, $fileName);
        } catch (\Exception $e) {
            abort($e->getMessage());
        }
    }

    /**
     * 前端直传阿里云oss 获取上传的签名等
     * @method post
     * @param Request $request 
     * @return Response
     */
    public function getSignature(Request $request) : Response
    {
        $data = AliyunOssUtils::getSignature();
        return result($data);
    }

    /**
     * 前端直传腾讯云cos 获取上传的链接
     * @method post
     * @param Request $request 
     * @param string $dir 上传的文件路劲
     * @return Response
     */
    public function getQcloudSignature(Request $request, string $dir) : Response
    {
        $data = QcloudCosUtils::getSignature($dir);
        return result($data);
    }

    /**
     * 前端直传阿里云oss后的回调
     * @method post
     * @param Request $request 
     * @return void
     */
    public function uploadAliyunOssCallback(Request $request) : void
    {
        AliyunOssUtils::uploadAliyunOssCallback();
    }

}
