<?php

namespace WnfSite\Form;

use Zend\Form\Form;

class ContactForm extends Form {

	public function __construct($name = null) {
		// we want to ignore the name passed
		parent::__construct('contact');

		$this->add(array(
			'name' => 'name',
			'type' => 'Zend\Form\Element\Text'
		));
		$this->add(array(
			'name' => 'email',
			'type' => 'Zend\Form\Element\Email'
		));
		$this->add(array(
			'name' => 'message',
			'type' => 'Zend\Form\Element\Textarea'
		));
	}

}
