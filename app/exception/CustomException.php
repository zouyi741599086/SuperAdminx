<?php
namespace app\exception;

use Exception;

/**
 * 自定义异常类，用于在程序中任何地方手动抛出异常，作用是结束程序并返回值，但不记录日志
 * @author Administrator
 */

class CustomException extends Exception
{
    public $dontReport = [];
    
    public function __construct($message, $code)
    {
        parent::__construct($message, $code);
    }

}