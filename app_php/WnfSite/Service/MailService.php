<?php

namespace WnfSite\Service;

use Zend\Mail\Message,
	Zend\Mail\Transport,
	Zend\Mime\Message as MimeMessage,
	Zend\Mime\Part as MimePart,
	Zend\Mail\Transport\SmtpOptions;

class MailService {

	private $config;
	private $content;

	public function send() {
		$mailCfg = $this->config;

		$message = new Message();
		$message//->setFrom($mailCfg->from->mail, $mailCfg->from->name)
				->addTo($mailCfg->to->mail, $mailCfg->to->name)
				->addTo($mailCfg->cc->mail, $mailCfg->cc->name)
				->addTo($mailCfg->bcc->mail, $mailCfg->bcc->name)
				->setSubject($mailCfg->subject);

		// Setup SMTP transport using LOGIN authentication
		//$transport = new Transport\SmtpTransport();

		$transport = new Transport\Sendmail();

		$options = new SmtpOptions(array(
			'host' => $mailCfg->smtp->host,
			'connection_class' => 'login',
			'connection_config' => array(
				'ssl' => $mailCfg->smtp->security,
				'username' => $mailCfg->smtp->username,
				'password' => $mailCfg->smtp->password
			),
			'port' => $mailCfg->smtp->port,
		));

		$html = new MimePart($this->getContent());

		$html->type = "text/html";

		$body = new MimeMessage();
		$body->addPart($html);

		$message->setBody($body);

		//$transport->setOptions($options);
		$transport->send($message);
	}

	public function getConfig() {
		return $this->config;
	}

	public function setConfig($config) {
		$this->config = $config;

		return $this;
	}

	public function getContent() {
		return $this->content;
	}

	public function setContent($formData) {
		$this->content = '<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title>' . $this->config->subject . '</title>
	</head>
	<body>
		<p><b>Name: </b>' . $formData['name'] . '</p>
		<p><b>Email: </b>' . $formData['email'] . '</p>
		<p><b>Message: </b>' . $formData['message'] . '</p>
	</body>
</html>';

		return $this;
	}

}
