<?php

//Log details

chdir(dirname(__DIR__));
// Composer autoloading
$loader = include 'vendor/autoload.php';


$request = new Zend\Http\PhpEnvironment\Request;
$response = array();
$config = json_decode(json_encode(require 'app_php/WnfSite/config/settings.php'), FALSE);


$writerInfo = new \Zend\Log\Writer\Stream($config->logPath . date('Y-m-d') . '_github.log');
$logger = new \Zend\Log\Logger();
$logger->addWriter($writerInfo);

if ($request->isPost()) {
	$logger->info($request->getPost());
}
else {
	$logger->err($request);
}
