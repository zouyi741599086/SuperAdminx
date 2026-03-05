<?php
/**
 * Here is your custom functions.
 */

/**
 * 将多行文本转换为数组并移除空行
 * @param string $text 多行文本
 * @param bool $trim 是否修剪每行的首尾空格
 * @return array
 */
function multiLine_to_array($text, $trim = true)
{
    // 分割成数组
    $lines = preg_split('/\r\n|\r|\n/', $text);

    // 过滤空行
    $lines = array_filter($lines, function ($line) use ($trim)
    {
        if ($trim) {
            $line = trim($line);
        }
        return $line !== '';
    });

    // 如果需要修剪，重新应用trim
    if ($trim) {
        $lines = array_map('trim', $lines);
    }

    return array_values($lines); // 重新索引数组
}