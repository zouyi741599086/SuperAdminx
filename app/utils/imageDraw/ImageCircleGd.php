<?php
namespace app\utils\imageDraw;

class ImageCircleGd
{
    public $img;
    public $width;
    public $height;
    public $minSize;

    public function __construct($img = null)
    {
        if (! empty($img)) {
            $this->img     = imagecreatefromstring($img);
            $this->width   = imagesx($this->img);
            $this->height  = imagesy($this->img);
            $this->minSize = min($this->width, $this->height);
        }
    }

    public function make() : string
    {
        $radius = $this->minSize / 2;

        // 从中心裁剪图像为正方形
        $cropped = imagecrop($this->img, [
            "x"      => $this->width / 2 - $radius,
            "y"      => $this->height / 2 - $radius,
            "width"  => $this->minSize,
            "height" => $this->minSize,
        ]);

        if ($cropped !== false) {
            imagedestroy($this->img);
            $this->img = $cropped;
        } else {
            throw new \Exception("Failed to crop the image!", 500);
        }

        // 创建圆形遮罩
        $mask    = imagecreatetruecolor($this->minSize, $this->minSize);
        $black   = imagecolorallocate($mask, 0, 0, 0);
        $magenta = imagecolorallocate($mask, 255, 0, 255);

        imagefill($mask, 0, 0, $magenta);
        imagefilledellipse($mask, $radius, $radius, $this->minSize, $this->minSize, $black);
        imagecolortransparent($mask, $black);

        // 应用遮罩
        imagecopymerge($this->img, $mask, 0, 0, 0, 0, $this->minSize, $this->minSize, 100);
        imagecolortransparent($this->img, $magenta);
        imagedestroy($mask);

        return $this->render();
    }

    public function render() : string
    {
        ob_start();
        imagepng($this->img);
        return ob_get_clean();
    }
}