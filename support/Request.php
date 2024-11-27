<?php
/**
 * This file is part of webman.
 *
 * Licensed under The MIT License
 * For full copyright and license information, please see the MIT-LICENSE.txt
 * Redistributions of files must retain the above copyright notice.
 *
 * @author    walkor<walkor@workerman.net>
 * @copyright walkor<walkor@workerman.net>
 * @link      http://www.workerman.net/
 * @license   http://www.opensource.org/licenses/mit-license.php MIT License
 */

namespace support;

/**
 * Class Request
 * @package support
 */
class Request extends \Webman\Http\Request
{
	/**
	 * 往post里面装数据
	 * @param array $data
	 */
	public function withPost($data = [])
	{
		$this->_data['post'] = array_merge($this->post(), $data);
	}

	/**
	 * 往get里面装数据
	 * @param array $data
	 */
	public function withGet($data = [])
	{
		$this->_data['get'] = array_merge($this->get(), $data);
	}
}