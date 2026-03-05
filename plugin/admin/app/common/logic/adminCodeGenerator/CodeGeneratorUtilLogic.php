<?php
namespace plugin\admin\app\common\logic\adminCodeGenerator;

use plugin\admin\app\common\model\AdminMenuModel;
use think\facade\Db;

/**
 * 代码生成器
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
class CodeGeneratorUtilLogic
{

    /**
     * 字符串转驼峰会自动去掉表前缀
     * @param string $string 要转的字符串 如 sa_admin_user 转换成AdminUser
     * @param bool $letter 首字母是否小写 如sa_admin_user 转换成 adminUser
     * @return string
     */
    public static function toCamelCase(string $string, bool $letter = false) : string
    {
        // 去除表前缀
        $dbPrefix = getenv('DB_PREFIX');
        if (strpos($string, $dbPrefix) === 0) {
            $string = substr($string, strlen($dbPrefix)); // 从索引3开始截取，因为'sa_'长度为3  
        }
        // 使用空格替换字符串中的下划线  
        $string = str_replace('_', ' ', $string);
        // 使用ucwords函数将字符串中的每个单词首字母转换为大写  
        $string = ucwords($string);
        // 将空格替换为空，实现驼峰命名  
        $string = str_replace(' ', '', $string);
        return $letter ? lcfirst($string) : $string;
    }

    /**
     * 通过反射获取类所有自己的方法，非继承的方法
     * @param string $className 如 app\admin\controller\AdminUser
     * @return array
     */
    public static function getOwnMethods(string $className) : array
    {
        $reflectedClass = new \ReflectionClass($className);
        $ownMethods     = [];

        // 获取当前类的所有方法  
        $methods = $reflectedClass->getMethods(\ReflectionMethod::IS_PUBLIC | \ReflectionMethod::IS_PROTECTED | \ReflectionMethod::IS_PRIVATE);

        // 获取父类的所有方法（如果有）
        $parentMethods = [];
        $parentClass   = $reflectedClass->getParentClass();
        if ($parentClass) {
            $parentMethods     = $parentClass->getMethods(\ReflectionMethod::IS_PUBLIC | \ReflectionMethod::IS_PROTECTED | \ReflectionMethod::IS_PRIVATE);
            $parentMethodNames = array_map(function ($method)
            {
                return $method->getName();
            }, $parentMethods);
            $parentMethodNames = array_flip($parentMethodNames);
        }

        // 过滤方法
        foreach ($methods as $method) {
            $methodName = $method->getName();

            // 过滤魔术方法（以__开头的）
            if (strpos($methodName, '__') === 0) {
                continue;
            }

            // 过滤继承的方法
            if ($parentClass && isset($parentMethodNames[$methodName])) {
                continue;
            }

            $ownMethods[] = $method;
        }

        return $ownMethods;
    }

    /**
     * 从方法的注释中提取内容
     * @param string $docComment 方法的注释
     * @param string $type 提取的内容，如title method等
     * @return mixed
     */
    public static function getMethodsDocComment(string $docComment, string $type)
    {
        // 移除开头的'/**'和结尾的'*/'，以便更容易地按行分割  
        $docComment = trim($docComment, "/*");
        // 按行分割字符串  
        $docComment = explode("\n", $docComment);

        //获取注释的标题
        if ($type == 'title') {
            // 假设第二行总是包含我们想要的中文内容  
            if (! empty($docComment[1])) {
                $title = str_replace('@log', '', $docComment[1]);
                $title = ltrim(trim($title), '*');
                return trim($title);
            }
        }

        //获取请求的类型
        if ($type == 'method') {
            // 遍历每一行来查找包含'@method'的行  
            $method = null;
            foreach ($docComment as $line) {
                // 使用正则表达式查找'@method'后跟一个或多个空格，然后是请求类型（直到行尾或遇到非字母字符）  
                if (preg_match('/@method\s+(\w+)/', $line, $matches)) {
                    $method = $matches[1]; // $matches[1]是捕获组，包含请求类型（如'post'）  
                    break; // 找到后退出循环  
                }
            }
            return $method;
        }
    }
}