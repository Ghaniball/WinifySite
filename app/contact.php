<?php

//Validate form
//Log details
//send email
//return response

chdir(dirname(__DIR__));
// Composer autoloading
$loader = include 'vendor/autoload.php';
$loader->add('WnfSite', 'app_php');


$request = new Zend\Http\PhpEnvironment\Request;
$response = array();
$config = json_decode(json_encode(require 'app_php/WnfSite/config/settings.php'), FALSE);


$writerInfo = new \Zend\Log\Writer\Stream($config->logPath . date('Y-m-d') . '.log');
$logger = new \Zend\Log\Logger();
$logger->addWriter($writerInfo);

//die(var_dump($request));

if ($request->isPost()) {
	$form = new WnfSite\Form\ContactForm();
	$form->setInputFilter(new WnfSite\Form\ContactFilter());

	$form->setData($request->getPost());
	//$form->setData($request->getQuery());
	
	// Validate the form
	if ($form->isValid()) {
		$logger->info($form->getData());
		try {
				$mailService = new WnfSite\Service\MailService;
				$mailService->setConfig($config->mail)
						->setContent($form->getData())
						->send();

			$response['status'] = 'success';
		} catch (Exception $ex) {
			$writerErr = new \Zend\Log\Writer\Stream($config->logPath . 'mail_send_error_' . date('Y-m-d') . '.log');

			$loggerErr = new \Zend\Log\Logger();
			$loggerErr->addWriter($writerErr);
			$loggerErr->err($ex->getMessage());
			$loggerErr->err($ex->getTraceAsString());

			$response['status'] = 'error';
			$response['reason'] = 'Mail not send';
			$response['messages'] = $ex->getMessage();
		}
	} else {
		$logger->err($form->getData());

		$response['status'] = 'error';
		$response['reason'] = 'Form not valid';
		$response['messages'] = $form->getMessages();
	}

	die(json_encode($response));
	//die($request->getQuery('callback') . '(' . json_encode($response) . ')');
}
