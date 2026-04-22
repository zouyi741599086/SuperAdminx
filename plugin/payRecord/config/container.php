<?php
$builder = new \DI\ContainerBuilder();
$builder->addDefinitions(config('plugin.payRecord.dependence', []));
$builder->useAutowiring(true);
$builder->useAttributes(true);
return $builder->build();