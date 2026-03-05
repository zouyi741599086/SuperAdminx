<?php
namespace plugin\user\app\common\logic\user;

use chillerlan\QRCode\{QRCode, QROptions};
use app\utils\WechatMiniUtils;

/**
 * 用户推广二维码
 */
class UserShareQrcodeLogic
{

    /**
     * 获取推广二维码
     * @method get
     * @param ?int $userId 用户id
     * @return string 推广二维码
     */
    public function getQrcode(?int $userId = null) : string
    {
        $request  = request();
        $client   = $request->post('client') ?: $request->client;
        $filePath = '';

        // 获取生成二维码的参数
        $data = match ($client) {
            'h5'          => $this->getH5QrcodeData(),
            'app'         => $this->getAppQrcodeData(),
            'weixin-mini' => $this->getMiniQrcodeData(),
            default       => abort('不支持的二维码类型')
        };

        // 检测二维码是否已存在
        $filePath = $this->getFilePath($data);
        if (file_exists(public_path() . $filePath)) {
            return $filePath;
        }

        // 生成二维码
        switch ($client) {
            case 'h5':
            case 'app':
                $qrcodeOptions = $this->getQrcodeOptions();
                $qrcode = new QRCode($qrcodeOptions);
                $qrcode->render($data, public_path() . $filePath);
                break;
            case 'weixin-mini':
                WechatMiniUtils::getWxAcodeunLimit($data[0], http_build_query($data[1]), $filePath);
                break;
        }

        if (! isset($filePath) || ! $filePath) {
            abort('获取二维码失败');
        }

        return $filePath;
    }

    /**
     * h5生成二维码的数据
     * @return string
     */
    private static function getH5QrcodeData()
    {
        $request   = request();
        $url       = $request->post('url'); // 如果是传完整的url，如 https://www.superadminx.com/m/#/pages/index/index?id=12
        $pathQuery = $request->post('pathQuery'); // 或者传后半部分，如 /m/#/pages/index/index?id=12
        $userId    = $request->user->id ?? null;

        if ($pathQuery && ! $url) {
            $url = config('superadminx.url') . $pathQuery;
        }

        // 看参数上面是否有推广用户的id
        if (strpos($url, 'invite_code=from_id_') !== false && $userId) {
            // 是否携带参数
            $isQuery = strpos($url, '?') !== false;
            $url     = $isQuery ? "{$url}&invite_code=from_id_{$userId}" : "{$url}?invite_code=from_id_{$userId}";
        }
        return $url;
    }

    /**
     * app生成二维码的数据
     * @return string
     */
    private static function getAppQrcodeData()
    {
        $request        = request();
        $userId         = $request->user->id ?? null;
        $shareAppConfig = get_config('share_app_config');
        $url            = "{$shareAppConfig->share_url}?invite_code=from_id_{$userId}";
        return $url;
    }

    /**
     * 获取小程序二维码的数据
     * @return array
     */
    private static function getMiniQrcodeData()
    {
        $request              = request();
        $userId               = $request->user->id ?? null;
        $page                 = $request->post('page') ?: 'pages/index/index';
        $scene                = $request->post('scene') ?: [];
        $scene['invite_code'] = "from_id_{$userId}";
        return [$page, $scene];
    }

    /**
     * 获取文件路劲
     * @param string|array $params 参数，用来生成文件名
     * @return string 文件路劲
     */
    private static function getFilePath(string|array $params)
    {
        $params   = is_array($params) ? json_encode($params) : $params;
        $fileName = md5($params);
        return "/tmp_file/{$fileName}.jpg";
    }

    /**
     * 获取二维码生成参数
     */
    private static function getQrcodeOptions()
    {
        return new QROptions([
            'outputType' => QRCode::OUTPUT_IMAGE_PNG,
        ]);
    }
}