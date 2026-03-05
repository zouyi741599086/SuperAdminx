<?php

use support\Request;

return [
    'debug' => getenv('DE_BUG') == 'true' ? true : false,
    'controller_suffix' => '',
    'controller_reuse' => true,
    'version' => '3.0.0'
];
