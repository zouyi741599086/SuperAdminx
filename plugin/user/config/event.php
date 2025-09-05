<?php

return [
    'user.*' => [
        [plugin\user\app\event\UserEvent::class, 'handle']
    ],
];
