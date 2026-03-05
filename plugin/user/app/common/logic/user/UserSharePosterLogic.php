<?php
namespace plugin\user\app\common\logic\user;

use plugin\user\app\common\logic\user\UserShareQrcodeLogic;
use plugin\user\app\common\model\UserModel;
use app\utils\imageDraw\ImageDrawUtils;

/**
 * 用户推广海报
 */
class UserSharePosterLogic
{

    /**
     * 获取推广海报
     * @method get
     * @param int $userId 用户id
     * @param string $appName app名称
     * @return array 推广海报
     */
    public function getPoster(int $userId, string $appName) : array
    {
        $sharePoster = get_config('share_poster');
        $user        = UserModel::field('id,name,tel,img')->find($userId);
        $result      = [];

        foreach ($sharePoster->img as $img) {
            $result[] = $this->getUserSharePoster($img, $userId, $appName, $user);
        }
        return $result;
    }

    /**
     * 获取推广海报
     * @param string $img 图片
     * @param int $userId 用户id
     * @param string $appName 应用名称
     * @param object $user 用户信息
     * @return string
     */
    private function getUserSharePoster(string $img, int $userId, string $appName, object $user) : string
    {
        // 检测二维码是否已存在
        $filePath = $this->getFilePath(['img' => $img, 'user_id' => $userId]);
        if (file_exists(public_path() . $filePath)) {
            return $filePath;
        }

        // 绘制二维码
        $qrcode = (new UserShareQrcodeLogic())->getQrcode($userId);

        // 创建海报实例
        $image = new ImageDrawUtils(670, height: 954);

        // 绘制商品图片（占据画布顶部700×700区域）
        $image->addImage($img, 0, 0, 670, 750)
            // 头像
            ->addImage($user->img, 30, 802, 100, 100, [
                'circle' => true,
            ])
            // 昵称
            ->addText($user->name, 155, 822, [
                'font_size' => 40,
                'color'     => '#000000',
                'max_width' => 300,
                'max_lines' => 1,
            ])
            ->addText("邀请你一起加入{$appName}", 155, 872, [
                'font_size' => 26,
                'color'     => '#666666',
                'max_width' => 300,
                'max_lines' => 1,
            ])
            // 绘制二维码
            ->addImage($qrcode, 480, 760, 180, 180);

        // 生成图片
        $image->save(public_path() . $filePath);

        return $filePath;
    }

    /**
     * 获取文件路劲
     * @param string|array $params 参数，用来生成文件名
     * @return string 文件路劲
     */
    private function getFilePath(string|array $params)
    {
        $params   = is_array($params) ? json_encode($params) : $params;
        $fileName = md5($params);
        return "/tmp_file/{$fileName}.jpg";
    }
}