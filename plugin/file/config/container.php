<?php
$builder = new \DI\ContainerBuilder();
$builder->addDefinitions(config('plugin.file.dependence', []));
$builder->useAutowiring(true);
$builder->useAttributes(true);
return $builder->build();