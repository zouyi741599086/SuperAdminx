<?php
namespace app\utils;

class ArrayObjectAccess extends \ArrayObject
{
    // 构造函数：递归转换数组
    public function __construct(array $array = [])
    {
        // 递归转换子数组为ArrayObjectAccess对象
        $converted = [];
        foreach ($array as $key => $value) {
            $converted[$key] = $this->convertValue($value);
        }
        parent::__construct($converted, \ArrayObject::ARRAY_AS_PROPS);
    }

    // 递归转换值（数组→对象）
    private function convertValue($value)
    {
        if (is_array($value)) {
            return new static($value);  // 递归转换子数组
        }
        return $value;
    }

    // 设置值时自动转换数组
    public function offsetSet($key, $value): void
    {
        parent::offsetSet($key, $this->convertValue($value));
    }

    // 支持 $obj->name 读取
    public function __get($key)
    {
        return $this[$key] ?? null;
    }

    // 支持 $obj->name = value 写入
    public function __set($key, $value)
    {
        $this[$key] = $value;
    }

    // 支持 isset($obj->name)
    public function __isset($key)
    {
        return isset($this[$key]);
    }

    // 支持 unset($obj->name)
    public function __unset($key)
    {
        unset($this[$key]);
    }
}