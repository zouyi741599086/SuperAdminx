<?php
namespace app\utils\imageDraw;

use Intervention\Image\ImageManager;
use Intervention\Image\Typography\FontFactory;
use app\utils\imageDraw\ImageCircleGd;
use app\utils\imageDraw\ImageCircleImagick;
use Intervention\Image\Geometry\Factories\RectangleFactory;

/**
 * 海报绘制工具类（Intervention Image v3）
 * 
 * 支持链式调用，灵活生成各种海报
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 */
class ImageDrawUtils
{
    protected $manager;
    protected $canvas;
    protected $config  = [];

    /**
     * 构造函数
     * 
     * @param int $width 画布宽度
     * @param int $height 画布高度
     * @param array $config 配置选项
     */
    public function __construct(int $width, int $height, array $config = [])
    {
        // 创建 ImageManager (默认使用 GD)
        $this->manager = ImageManager::gd();

        // 默认配置
        $defaultConfig = [
            'background'  => '#ffffff',
            'quality'     => 100, // 图片质量
            'format'      => 'jpg',
            'font_path'   => realpath(__DIR__ . '/simhei.ttf'),
            'font_size'   => 14,
            'line_height' => 2,
            'driver'      => config('app.debug') == true ? 'gd' : 'imagick', // 开发环境用gd，正式环境用imagick
        ];

        $this->config = array_merge($defaultConfig, $config);

        // 根据配置选择驱动
        if ($this->config['driver'] === 'imagick') {
            $this->manager = ImageManager::imagick();
        }

        // 创建画布
        $this->initCanvas($width, $height);
    }

    /**
     * 初始化画布
     */
    public function initCanvas(int $width, int $height)
    {
        // 创建画布
        $this->canvas = $this->manager->create($width, $height);

        // 填充背景色
        $bg = $this->config['background'];
        if ($bg !== 'transparent' && $bg !== null) {
            $this->canvas->fill($bg);
        }

        return $this;
    }

    /**
     * 添加图片元素
     * @param string $path 图片路径，网络图片、本地图片（/storage/xxx.png）、base64图片
     * @param int $x 放置位置X坐标
     * @param int $y 放置位置Y坐标
     * @param int $width 图片宽度
     * @param int $height 图片高度
     * @param array $options 其他参数
     * @return $this
     */
    public function addImage(string $path, int $x = 0, int $y = 0, ?int $width = null, ?int $height = null, array $options = [])
    {
        $defaultOptions = [
            'x'      => $x,
            'y'      => $y,
            'width'  => $width,
            'height' => $height,
            'circle' => false, // 是否裁剪成圆形
        ];
        $options        = array_merge($defaultOptions, $options);

        // 判断图片来源类型
        $image = null;

        // 处理base64图片
        if (strpos($path, 'data:image') === 0) {
            $image = $this->manager->read($path);
        }
        // 处理网络图片
        elseif (filter_var($path, FILTER_VALIDATE_URL)) {
            $tempFile = $this->downloadImageToTemp($path);
            $image    = $this->manager->read($tempFile);
            unlink($tempFile);
        }
        // 尝试直接读取
        else {
            $image = $this->manager->read(public_path() . $path);
        }

        // 调整尺寸
        if ($width !== null || $height !== null) {
            $image->cover($width, $height);
        }

        // 如果需要裁剪成圆形
        if ($options['circle']) {
            //if ($this->config['driver'] == 'gd') {
                $circle = new ImageCircleGd($image->encodeByMediaType(type: "image/png")->toString());
                $image  = $circle->make();
            // } else if ($this->config['driver'] == 'imagick') {
            //     var_dump(__DIR__ . '/mask.png');
            //     $image = $image->modify(new ImageCircleImagick( __DIR__ . '/mask.png', true));
            // }
        }

        // 放置到画布上
        $this->canvas->place(
            $image,
            'top-left',
            $x,
            $y,
        );

        return $this;
    }

    /**
     * 绘制文本
     * @param string $text 文本内容
     * @param int $x 放置位置X坐标
     * @param int $y 放置位置Y坐标
     * @param array $options 绘制选项
     * @return $this
     */
    public function addText(string $text, int $x = 0, int $y = 0, array $options = [])
    {
        $defaultOptions = [
            'font_size'              => $this->config['font_size'],
            'color'                  => '#000000',
            'font_path'              => $this->config['font_path'],
            'align'                  => 'left',
            'valign'                 => 'top',
            'line_height'            => $this->config['line_height'],
            'max_width'              => null, // 最大宽度
            'max_lines'              => null, // 最大行数
            'angle'                  => 0, // 旋转角度
            'strikethrough'          => false, // 删除线
            'strikethrough_color'    => null, // 删除线颜色，默认与文本颜色相同
            'strikethrough_width'    => 1, // 删除线宽度
            'strikethrough_position' => 'middle', // 删除线位置：top, middle, bottom
        ];

        $options = array_merge($defaultOptions, $options);

        // 处理多行文本
        if ($options['max_width']) {
            $maxWidth = $options['max_width'];
            $fontSize = $options['font_size'];

            // 使用新的API处理文本换行
            $text = $this->wrapTextV3($text, $options['font_path'], $fontSize, $maxWidth, $options['max_lines']);
        }

        // 绘制文本 - 使用新的API
        $this->canvas->text($text, $x, $y, function (FontFactory $font) use ($options)
        {
            // 设置字体大小
            $font->size($options['font_size']);

            // 设置颜色
            $font->color($options['color']);

            // 设置字体文件
            if ($options['font_path'] && file_exists($options['font_path'])) {
                try {
                    $font->filename($options['font_path']);
                } catch (\Exception $e) {
                    // 如果filename方法不存在，尝试使用file方法
                    if (method_exists($font, 'file')) {
                        $font->file($options['font_path']);
                    }
                }
            }

            // 设置对齐方式
            if (isset($options['align'])) {
                switch ($options['align']) {
                    case 'left':
                        $font->align('left');
                        break;
                    case 'center':
                        $font->align('center');
                        break;
                    case 'right':
                        $font->align('right');
                        break;
                }
            }

            if (isset($options['valign'])) {
                // 垂直对齐处理
                switch ($options['valign']) {
                    case 'top':
                        $font->valign('top');
                        break;
                    case 'middle':
                        $font->valign('middle');
                        break;
                    case 'bottom':
                        $font->valign('bottom');
                        break;
                }
            }

            // 设置行高
            if ($options['line_height']) {
                $font->lineHeight($options['line_height']);
            }

            // 设置旋转角度
            if ($options['angle'] != 0) {
                $font->angle($options['angle']);
            }

            return $font;
        });

        // 绘制删除线（如果需要）
        if ($options['strikethrough']) {
            $this->drawStrikethrough($text, $x, $y, $options);
        }

        return $this;
    }

    /**
     * 绘制一个长方形
     * @param int $x 放置位置X坐标
     * @param int $y 放置位置Y坐标
     * @param int $width 宽度
     * @param int $height 高度
     * @param array $options 绘制选项
     * @return $this
     */
    public function addRectangle(int $x, int $y, int $width, int $height, array $options = [])
    {
        $defaultOptions = [
            'x'            => $x,
            'y'            => $y,
            'width'        => $width,
            'height'       => $height,
            'background'   => null, // 背景色
            'border-color' => null, // 边框颜色
            'border-width' => null, // 边框宽度
        ];
        $options        = array_merge($defaultOptions, $options);

        $this->canvas->drawRectangle($x, $y, function (RectangleFactory $rectangle) use ($options)
        {
            $rectangle->size($options['width'], $options['height']);
            if ($options['background']) {
                $rectangle->background($options['background']);
            }
            if ($options['border-color'] && $options['border-width']) {
                $rectangle->border($options['border-color'], $options['border-width']);
            }
        });
        return $this;
    }

    /**
     * 绘制删除线
     * @param string $text 文本内容
     * @param int $x 放置位置X坐标
     * @param int $y 放置位置Y坐标
     * @param array $options 绘制选项
     */
    protected function drawStrikethrough(string $text, int $x, int $y, array $options)
    {
        // 计算文本的尺寸和位置
        $fontSize = $options['font_size'];

        // 测量文本宽度和高度
        $textWidth = intval($this->measureTextWidth($text, $fontSize) * 1.25);

        // 计算文本高度（估算）
        $textHeight = $fontSize * 0.8; // 字体高度的估算值

        // 根据对齐方式调整起点位置
        $startX = $x;
        switch ($options['align']) {
            case 'center':
                $startX = $x - ($textWidth / 2);
                break;
            case 'right':
                $startX = $x - $textWidth;
                break;
        }

        // 根据垂直对齐方式调整Y位置
        $textY = $y;
        switch ($options['valign']) {
            case 'top':
                // 对于top对齐，y坐标是文本的顶部，需要向下调整以找到基线
                $textY = $y + ($textHeight * 0.8);
                break;
            case 'middle':
                $textY = $y + ($textHeight / 2);
                break;
            case 'bottom':
                $textY = $y;
                break;
        }

        // 根据删除线位置计算Y坐标
        $strikethroughY = $textY;
        switch ($options['strikethrough_position']) {
            case 'top':
                $strikethroughY = $textY - ($textHeight * 0.7);
                break;
            case 'middle':
                // 中间位置，这是最常见的删除线位置
                $strikethroughY = $textY - ($textHeight * 0.35);
                break;
            case 'bottom':
                $strikethroughY = $textY - ($textHeight * 0.1);
                break;
        }

        // 如果文本有旋转角度，需要考虑旋转
        if ($options['angle'] != 0) {
            // 对于旋转的文本，删除线的计算会更复杂
            // 这里我们简化处理：不绘制旋转文本的删除线，或者需要更复杂的几何计算
            error_log('警告：旋转文本的删除线功能暂未实现');
            return;
        }

        // 设置删除线颜色（默认使用文本颜色）
        $strikethroughColor = $options['strikethrough_color'] ?: $options['color'];
        $strikethroughWidth = max(1, intval($options['strikethrough_width']));

        // 创建一个小矩形作为删除线
        $lineHeight = $strikethroughWidth;

        // 创建删除线图像
        $strikethroughImage = $this->manager->create($textWidth, $lineHeight);
        $strikethroughImage->fill($strikethroughColor);

        // 放置到画布上
        $this->canvas->place(
            $strikethroughImage,
            'top-left',
            intval($startX),
            intval($strikethroughY - ($lineHeight / 2)),
        );
    }

    /**
     * 文本换行处理 - 改进版本，精确测量文本宽度
     * @param string $text 输入的文本
     * @param string $fontPath 字体文件的路径
     * @param int $fontSize 字体大小
     * @param int $maxWidth 最大宽度
     * @param int|null $maxLines 最大行数
     * @return string 处理后的文本
     */
    protected function wrapTextV3(string $text, string $fontPath, int $fontSize, int $maxWidth, ?int $maxLines = null)
    {
        if (! $fontPath || ! file_exists($fontPath)) {
            return $text; // 没有字体文件，无法精确换行
        }

        // 使用GD库精确测量文本宽度
        $lines       = explode("\n", $text);
        $resultLines = [];

        foreach ($lines as $line) {
            if (empty($line)) {
                $resultLines[] = '';
                continue;
            }

            // 使用真实字体测量进行换行
            $currentLine = '';
            $characters  = mb_str_split($line, 1, 'UTF-8');

            foreach ($characters as $char) {
                $testLine = $currentLine . $char;

                // 测量文本宽度
                $testWidth = $this->measureTextWidth($testLine, $fontSize);

                if ($testWidth > $maxWidth && $currentLine !== '') {
                    // 当前行已达到最大宽度，开始新行
                    $resultLines[] = $currentLine;

                    // 检查最大行数
                    if ($maxLines !== null && count($resultLines) >= $maxLines) {
                        // 添加省略号到当前行
                        $lastLineIndex               = count($resultLines) - 1;
                        $resultLines[$lastLineIndex] = $this->addEllipsisV3(
                            $resultLines[$lastLineIndex],
                            $fontSize,
                            $maxWidth,
                        );
                        break 2;
                    }

                    $currentLine = $char;
                } else {
                    $currentLine = $testLine;
                }
            }

            // 处理剩余文本
            if ($currentLine !== '') {
                $resultLines[] = $currentLine;
            }

            // 检查最大行数
            if ($maxLines !== null && count($resultLines) >= $maxLines) {
                // 如果已经达到最大行数，处理最后一行
                if (count($resultLines) > $maxLines) {
                    $resultLines                = array_slice($resultLines, 0, $maxLines);
                    $lastLine                   = $resultLines[$maxLines - 1];
                    $resultLines[$maxLines - 1] = $this->addEllipsisV3($lastLine, $fontSize, $maxWidth);
                }
                break;
            }
        }

        return implode("\n", $resultLines);
    }

    /**
     * 添加省略号 - 改进版本，精确测量文本宽度
     * @param string $text 输入的文本
     * @param int $fontSize 字体大小
     * @param int $maxWidth 最大宽度
     * @return string 处理后的文本
     */
    protected function addEllipsisV3(string $text, int $fontSize, int $maxWidth)
    {
        $ellipsis = '...';

        if (mb_strlen($text) <= 3) {
            // 文本太短，直接返回省略号
            return $ellipsis;
        }

        // 从后往前逐个移除字符，直到文本+省略号的宽度不超过最大宽度
        $result = $text;
        while (mb_strlen($result) > 1) {
            // 测量当前文本+省略号的宽度
            $testText  = $result . $ellipsis;
            $testWidth = $this->measureTextWidth($testText, $fontSize);

            if ($testWidth <= $maxWidth) {
                break;
            }

            // 移除最后一个字符
            $result = mb_substr($result, 0, -1);
        }

        return $result . $ellipsis;
    }

    /**
     * 使用GD库精确测量文本宽度
     * @param string $text 输入的文本
     * @param int $fontSize 字体大小
     * @return int 文本宽度
     */
    public function measureTextWidth(string $text, int $fontSize)
    {
        static $fontCache = [];
        $fontPath = $this->config['font_path'];
        $cacheKey = $fontPath . '|' . $fontSize;

        if (! isset($fontCache[$cacheKey])) {
            // 检查字体文件是否存在且可读
            if (! file_exists($fontPath) || ! is_readable($fontPath)) {
                return mb_strlen($text) * $fontSize * 0.8; // 估算宽度
            }

            // 尝试使用GD库测量
            if (function_exists('imagettfbbox')) {
                $fontCache[$cacheKey] = function ($text) use ($fontPath, $fontSize)
                {
                    $bbox = @imagettfbbox($fontSize * 0.68, 0, $fontPath, $text);
                    if ($bbox === false) {
                        // GD测量失败，返回估算值
                        return mb_strlen($text) * $fontSize * 0.8;
                    }
                    return abs($bbox[2] - $bbox[0]);
                };
            } else {
                // GD库不支持TTF，返回估算值
                $fontCache[$cacheKey] = function ($text) use ($fontSize)
                {
                    return mb_strlen($text) * $fontSize * 0.8;
                };
            }
        }

        return $fontCache[$cacheKey]($text);
    }


    /**
     * 保存到文件
     *  @param string $path 文件路径
     *  @param int $quality 质量
     *  @return $this
     */
    public function save(string $path, ?int $quality = null)
    {
        $quality = $quality ?: $this->config['quality'];
        $format  = pathinfo($path, PATHINFO_EXTENSION) ?: $this->config['format'];

        $this->canvas->save($path, $quality, $format);

        return $this;
    }

    /**
     * 输出为base64
     * @param string $format 格式
     * @param int $quality 质量
     * @return string
     */
    public function toBase64($format = null, $quality = null)
    {
        $format  = $format ?: $this->config['format'];
        $quality = $quality ?: $this->config['quality'];

        // 根据格式编码
        switch (strtolower($format)) {
            case 'jpg':
                $encoded = $this->canvas->toJpeg($quality);
                break;
            case 'jpeg':
                $encoded = $this->canvas->toJpeg($quality);
                break;
            case 'png':
                $encoded = $this->canvas->toPng($quality);
                break;
            case 'webp':
                $encoded = $this->canvas->toWebp($quality);
                break;
            case 'gif':
                $encoded = $this->canvas->toGif($quality);
                break;
            default:
                $encoded = $this->canvas->toJpeg($quality);
        }

        return $encoded->toDataUri();
    }

    /**
     * 下载网络图片到临时文件
     * @param string $url 图片URL
     * @return string
     */
    protected function downloadImageToTemp($url)
    {
        $tempFile = tempnam(sys_get_temp_dir(), 'img_');

        $ch = curl_init($url);
        $fp = fopen($tempFile, 'wb');

        curl_setopt_array($ch, [
            CURLOPT_FILE           => $fp,
            CURLOPT_HEADER         => 0,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_TIMEOUT        => 30,
            CURLOPT_USERAGENT      => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        ]);

        curl_exec($ch);

        if (curl_errno($ch)) {
            curl_close($ch);
            fclose($fp);
            unlink($tempFile);
            throw new \Exception('下载图片失败: ' . curl_error($ch));
        }

        curl_close($ch);
        fclose($fp);

        return $tempFile;
    }
}