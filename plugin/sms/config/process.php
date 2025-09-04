<?php
$result = [
];

return getenv('CRONTAB') == 'true' ? $result : [];