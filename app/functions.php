<?php
use app\utils\DataEncryptor;
use app\utils\QcloudCos;
use app\utils\AliyunOss;

/**
 * 生成单号
 * @param string $prefix 订单号前缀
 * @return string
 */
function get_order_no(string $prefix = 'E') : string
{
    return $prefix . date('YmdHis', time()) . get_str(4);
}

/**
 * 把数据里面的资源path路径补全，就是加上url
 * @param string|array $data 要处理的数据
 * @return string|array
 */
function file_url($data)
{
    $url = config('superadminx.url');
    if ($data && $url) {
        if (is_array($data)) {
            foreach ($data as $k => $v) {
                $data[$k] = file_url($v);
            }
        }
        if (is_string($data)) {
            $data = strpos($data, 'http') === false ? str_replace("/storage", "{$url}/storage", $data) : $data;
        }
    }
    return $data;
}

/**
 * 把数据里面的资源path路劲删除url，跟上面个函数功能相反
 * @param string|array $data 要处理的数据
 * @return string|array
 */
function file_url_dec($data)
{
    $url = config('superadminx.url');
    if ($url && $data) {
        if (is_array($data)) {
            foreach ($data as $k => $v) {
                $data[$k] = file_url_dec($v);
            }
        }
        if (is_string($data)) {
            $data = strpos($data, $url) !== false ? str_replace($url, '', $data) : $data;
        }
    }
    return $data;
}

/**
 * 生成随机数字
 * @param int $length 需要生成的长度
 * @param int $type 0：使用数字生成，1：使用数字加字母组成
 * @return 字符串
 */
function get_str(int $length, int $type = 0) : string
{
    $str = '01234567899876543210';
    if ($type) {
        $str = 'QWERTYUIOPASDFGHJKLZXCVBNM0123456789mnbvcxzlkjhgfdsapoiuytrewq';
    }
    $randString = '';
    $len        = strlen($str) - 1;
    for ($i = 0; $i < $length; $i++) {
        $num        = mt_rand(0, $len);
        $randString .= $str[$num];
    }
    return $randString;
}

/**
 * 保留两位小数
 * @param float $value
 * @param int $digit 保留小数位数
 * @return float 
 */
function d2(float $value, int $digit = 2) : float
{
    return floatval(sprintf("%.{$digit}f", $value));
}

/**
 * 程序任何地方可调用，作用是结束程序并返回错误信息
 * @param string $message
 * @param int $code
 * @throws \Exception
 */
function abort(string $message = '服务器内部错误', int $code = -1)
{
    throw new \app\exception\CustomException($message, $code);
}

/**
 * 成功返回
 */
function success($data = [], string $message = '操作成功', int $code = 1, bool $is_encrypt = true)
{
    return result($data, $code, $message, $is_encrypt);
}

/**
 * 失败返回
 */
function error(string $message = '操作失败', int $code = -1, $data = [], bool $is_encrypt = false)
{
    return result($data, $code, $message, $is_encrypt);
}

/**
 * 返回封装后的API数据到客户端
 * @access protected
 * @param  array $data 要返回的数据
 * @param  int $code 返回的code
 * @param  string $mssage 提示信息
 * @param  boolean $is_encrypt 返回数据是否加密
 */
function result($data = [], int $code = 1, string $mssage = '操作成功', bool $is_encrypt = true)
{
    $result = [
        'code'    => $code,
        'message' => $mssage,
        'time'    => time(),
        'data'    => $data,
    ];
    // 判断是否需要加密
    if (config('superadminx.api_encryptor.enable') == true && isset($result['data']) && $is_encrypt) {
        $result['encrypt_data'] = DataEncryptor::aesEncrypt($result['data'], request()->aes_key, request()->aes_iv);
        unset($result['data']);
    }
    return json($result);
}

/**
 * 导出数据
 * @param array $header 表格头
 * @param array $list 表格数据
 * @param string $exportPathType 导出的文件放在哪，public》本地，aliyun》阿里云，qcloud》腾讯云
 * @return array|string
 */
function export(array &$header, array &$list, ?string $exportPathType = null) : string
{
    // 生成的文件名
    $fileName = date('YmdHis') . rand(1, 10000) . '.xlsx';

    // 开始生成表格导出
    $config   = [
        'path' => public_path() . '/tmp_file',
    ];
    $excel    = new \Vtiful\Kernel\Excel($config);
    $filePath = $excel->fileName($fileName)
        ->header($header)
        ->data($list)
        ->output();
    $excel->close();

    $filePath = str_replace(public_path(), '', $filePath);
    return export_path($filePath, $exportPathType);
}

/**
 * 生成文件后置处理，看是否需要将文件上传到云
 * @param string $filePath 文件在本地的url
 * @param string $exportPathType 云存储类型，public》本地，aliyun》阿里云，qcloud》腾讯云
 * @return void
 */
function export_path($filePath, $exportPathType = null)
{
    // 判断生成的文件存在哪
    if (! $exportPathType) {
        $exportPathType = config('superadminx.export_path_type');
    }
    if ($exportPathType == 'public') {
        return $filePath;
    }

    if ($exportPathType == 'qcloud') {
        return QcloudCos::upload($filePath, true);
    }

    if ($exportPathType == 'aliyun') {
        return AliyunOss::upload($filePath, true);
    }
}