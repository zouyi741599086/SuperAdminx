<?php
namespace plugin\user\app\api\controller;

use support\Request;
use support\Response;
use app\utils\WechatMpUtils;

/**
 * 微信服务号
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class WechatMp
{
    // 此控制器是否需要登录
    protected $onLogin = false;
    // 不需要登录的方法
    protected $noNeedLogin = [];
    // 不需要加密的方法
    protected $noNeedEncrypt = [];

    /**
     * 微信公众号js注入配置
     * @method get
     * @param Request $request 
     * @param string $url 当前网页的URL（不包含#及其后面部分），如 https://example.com/m/
     * @return Response
     * */
    public function getJsSdkConfig(Request $request, string $url)
    {
        $result = WechatMpUtils::getJsSdkConfig(
            $url,
            ['onMenuShareAppMessage', 'onMenuShareTimeline', 'updateAppMessageShareData', 'updateTimelineShareData', 'downloadImage', 'openLocation', 'getLocation', 'scanQRCode'],
        );
        return success($result);
    }

    /**
     * 获取openid，第一步：获取网页授权url
     * @method get
     * @param Request $request 
     * @param string $url 当前网页完整的URL
     * @return Response
     */
    public function getOauthRedirectUrl(Request $request, string $url)
    {
        $result = WechatMpUtils::getOauthRedirectUrl($url);
        return success($result);
    }

    /**
     * 获取openid，第二步：获取openid
     * @method get
     * @param Request $request 
     * @param string $code 上面第一步返回的code
     * @return Response
     */
    public function getUserByCode(Request $request, string $code)
    {
        $result = WechatMpUtils::getUserByCode($code);
        return success($result);
    }

}
