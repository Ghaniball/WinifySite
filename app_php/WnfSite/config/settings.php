<?php

return array(
	'mail' => array(
		'from' => array(
			'name' => '',
			'mail' => 'sender.seoziele@yahoo.com'
		),
		'to' => array(
			'name' => 'Ivan',
			'mail' => 'ghaniball@mail.ru',
		),
		'subject' => 'Winify site contact message',
		'smtp' => array(
			'host' => 'smtp.mail.yahoo.com',
			'port' => 465,
			'security' => 'ssl',
			'username' => 'sender.seoziele@yahoo.com',
			'password' => 'Mihai2014',
		)
	),
	'logPath' => __DIR__ . '/../../logs/',
);
