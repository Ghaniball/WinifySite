WinifySite
==========

##Dependencies
* [Yeoman](http://yeoman.io/)
	* [node.js](http://nodejs.org/download/)
* [SASS](http://sass-lang.com/)/[COMPASS](http://compass-style.org/)
	* [ruby](https://www.ruby-lang.org/en/installation/)


##Instalation

clone repository
```bash
git clone https://github.com/Ghaniball/WinifySite.git
```

Go into repo folder
```bash
cd WinifySite
```

and run:
```bash
npm install
```
```bash
composer install
```
```bash
bower install
```

Download this [archive](https://drive.google.com/file/d/0B4sZm5QeE5FVNjNpNGVQQnhOVG8/edit?usp=sharing)(ask for access)  
and paste `config` folder inside `<project root>/app_php/WnfSite/`


go to `<project root>/app/bower_components/jqueryui/.bower.json`  
find this line `"ui/jquery-ui.js"`  
change it to `"ui/jquery.ui.efect.js"`


##Usage
after that run:
```bash
grunt serve
```
to launch live preview
and
```bash
grunt
```
to create a distribution folder
