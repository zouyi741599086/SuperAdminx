<?php
namespace app\utils\imageDraw;

use Imagick;
use Intervention\Image\Interfaces\ImageInterface;
use Intervention\Image\Interfaces\ModifierInterface;

class ImageCircleImagick  implements ModifierInterface
{
    public function __construct(protected mixed $mask, protected $mask_with_alpha_channel = false) {}

    public function apply(ImageInterface $image) : ImageInterface
    {
        // 构建遮罩图像实例
        $mask = $image->driver()->handleInput($this->mask);

        // 调整遮罩尺寸与主图一致
        $mask = $mask->resize($image->width(), $image->height());

        // 启用alpha通道
        $image->core()->native()->setImageMatte(true);

        if ($this->mask_with_alpha_channel) {
            // 使用遮罩的alpha通道
            $image->core()->native()->compositeImage(
                $mask->core()->native(),
                Imagick::COMPOSITE_DSTIN,
                0,
                0,
            );
        } else {
            // 获取原始图像的alpha通道作为灰度图像
            $original_alpha = clone $image->core()->native();
            $original_alpha->separateImageChannel(Imagick::CHANNEL_ALPHA);

            // 使用遮罩的红色通道作为alpha
            $mask_alpha = clone $mask->core()->native();
            $mask_alpha->compositeImage($mask->core()->native(), Imagick::COMPOSITE_DEFAULT, 0, 0);
            $mask_alpha->separateImageChannel(Imagick::CHANNEL_ALL);

            // 合并两个alpha通道
            $original_alpha->compositeImage($mask_alpha, Imagick::COMPOSITE_COPYOPACITY, 0, 0);

            // 使用合并后的alpha通道遮罩图像
            $image->core()->native()->compositeImage(
                $original_alpha,
                Imagick::COMPOSITE_DSTIN,
                0,
                0,
            );
        }

        return $image;
    }
}