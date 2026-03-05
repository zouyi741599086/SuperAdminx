<?php
use app\utils\DataEncryptorUtils;
use plugin\file\app\utils\QcloudCosUtils;
use plugin\file\app\utils\AliyunOssUtils;

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
        if (is_array($data) || is_object($data)) {
            foreach ($data as $k => $v) {
                $data[$k] = file_url($v);
            }
        }
        if (is_string($data) && strpos($data, 'http') === false) {
            $data = str_replace("/storage", "{$url}/storage", $data);
            $data = str_replace("/tmp_file", "{$url}/tmp_file", $data);
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
 * @return string
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
        $num         = mt_rand(0, $len);
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
    if (
        config('superadminx.api_encryptor.enable') == true &&
        isset($result['data']) &&
        $is_encrypt &&
        request()->dataEncrypt
    ) {
        $result['encrypt_data'] = DataEncryptorUtils::aesEncrypt($result['data'], request()->aes_key, request()->aes_iv);
        unset($result['data']);
    }
    return json($result);
}

/**
 * 后台table动态排序条件
 * @param string $orderBy 默认排序
 * @param array $params 参数
 * @return string
 */
function get_admin_order_by(string $orderBy, array $params = [])
{
    if (isset($params['orderBy']) && $params['orderBy']) {
        $orderBy = "{$params['orderBy']},{$orderBy}";
    }
    return $orderBy;
}

/**
 * 搜索选择数据，动态排序
 */
function get_select_order_by(string $orderBy, array &$params = [])
{
    $orderBy = 'id DESC';
    if (isset($params['id']) && $params['id']) {
        if (is_array($params['id'])) {
            $params['pageSize'] = count($params['id']) > $params['pageSize'] ? count($params['id']) : $params['pageSize'];
            $idString           = implode(',', array_map('intval', $params['id']));
        } else {
            $idString = intval($params['id']);
        }
        $orderBy = "FIELD(id, {$idString}) DESC,{$orderBy}";
    }
    return $orderBy;
}

/**
 * 导出数据
 * @param array $header 表格头
 * @param array $list 表格数据
 * @param string $exportPathType 导出的文件放在哪，public》本地，aliyun》阿里云，qcloud》腾讯云
 * @return string 文件地址
 */
function export(array &$header, array &$list, ?string $exportPathType = null) : string
{
    // 生成的文件名
    $fileName = date('YmdHis') . rand(1, 10000) . '.xlsx';

    // 开始生成表格导出
    $config     = [
        'path' => public_path() . '/tmp_file',
    ];
    $excel      = new \Vtiful\Kernel\Excel($config);
    $fileObject = $excel->fileName($fileName)
        ->header($header)
        ->data($list);
    $fileHandle = $fileObject->getHandle();

    // 第一行样式
    $fileObject->setRow("A1", 22, (new \Vtiful\Kernel\Format($fileHandle))
        ->wrap()
        ->bold()
        ->fontColor(\Vtiful\Kernel\Format::COLOR_WHITE)
        ->align(\Vtiful\Kernel\Format::FORMAT_ALIGN_VERTICAL_CENTER)
        ->background(\Vtiful\Kernel\Format::COLOR_RED)
        ->toResource(),
    );

    // 设置第一行外的高度
    $fileObject->setRow("A2:Y50000", 22, (new \Vtiful\Kernel\Format($fileHandle))
        ->wrap()
        ->align(\Vtiful\Kernel\Format::FORMAT_ALIGN_VERTICAL_CENTER)
        ->toResource(),
    )->setColumn("A1:Y50000", 10);

    $filePath = $fileObject->output();
    $excel->close();

    $filePath = str_replace(public_path(), '', $filePath);
    return export_path($filePath, $exportPathType);
}

/**
 * 生成文件后置处理，看是否需要将文件上传到云
 * @param string $filePath 文件在本地的url
 * @param string $exportPathType 云存储类型，public》本地，aliyun》阿里云，qcloud》腾讯云
 * @return string 文件地址
 */
function export_path($filePath, $exportPathType = null) : string
{
    // 判断生成的文件存在哪
    if (! $exportPathType) {
        $exportPathType = config('superadminx.export_path_type');
    }

    if ($exportPathType == 'qcloud') {
        return QcloudCosUtils::upload($filePath, true);
    }

    if ($exportPathType == 'aliyun') {
        return AliyunOssUtils::upload($filePath, true);
    }
    return $filePath;
}
