<?php
namespace app\exception;

use Throwable;
use Webman\Http\Response;
use Webman\Http\Request;
use Webman\Exception\ExceptionHandler;
use app\exception\CustomException;
use support\exception\PageNotFoundException;

/**
 * 自定义异常处理，把父类两个方法拷过来用的，只修改了两处地方
 * @author Administrator
 *
 */

class Handler extends ExceptionHandler
{

    public function report(Throwable $exception)
    {
        // 自定义异常类，专门用于终止程序并返回错误信息，不需要记录日志
        if ($exception instanceof CustomException || $exception instanceof PageNotFoundException) {
            return;
        }
        if ($this->shouldntReport($exception)) {
            return;
        }
        $logs = '';
        if ($request = \request()) {
            $logs = $request->getRealIp() . ' ' . $request->method() . ' ' . trim($request->fullUrl(), '/');
        }
        $this->logger->error($logs . PHP_EOL . $exception);
    }

    public function render(Request $request, Throwable $exception) : Response
    {
        $this->debug = config('app.debug');
        $code        = $exception->getCode();
        // 把返回的msg改为了message
        if ($request->expectsJson() || $request->header('content-type') == 'application/json' || $this->debug) {
            $json = ['code' => $code ?: 500, 'message' => $exception->getMessage()];
            $this->debug && $json['traces'] = (string) $exception;
            return new Response(
                200,
                ['Content-Type' => 'application/json'],
                json_encode($json, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES)
            );
        }
        $error = $this->debug ? nl2br((string) $exception) : 'Server internal error';
        return new Response(500, [], $error);
        // return parent::render($request, $exception);
    }
}