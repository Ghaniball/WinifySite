'use strict';

angular.module('winifySiteCtrls', [])
  .controller('CalculatorCtrl', [
    '$rootScope',
    '$scope',
    '$window',
    '$anchorScroll',
    'gmapService',
    function($rootScope, $scope, $window, $anchorScroll, gmapService) {



    }
  ])
  .controller('FooterPagesCtrl', [
    '$rootScope',
    '$scope',
    '$window',
    '$anchorScroll',
    'gmapService',
    function($rootScope, $scope, $window, $anchorScroll, gmapService) {
      var mapLoaded = false;


      $rootScope.isHome = false;
      $anchorScroll();

      $scope.initializeGMap = function() {
        if (mapLoaded) {
          return;
        }
        mapLoaded = true;

        gmapService.init();
      };

    }
  ])
  .controller('HomeCtrl', [
    '$rootScope',
    '$scope',
    '$location',
    '$routeParams',
    '$window',
    '$timeout',
    '$http',
    'searchKey',
    'gmapService',
    'homePageBlocks',
    'skillsModel',
    'quotesModel',
    function($rootScope, $scope, $location, $routeParams, $window, $timeout, $http, searchKey, gmapService, homePageBlocks, skillsModel, quotesModel)
    {
      var $ = $window.jQuery,
        $w = $($window),
        delay = 0,
        mapLoaded = false;

      $window.document.title = 'Home :: Winify';

      $rootScope.isHome = true;
      $scope.offsetTop = false;
      $scope.path = $location.path();
      $scope.block = searchKey.get() || 'intro';
      $scope.homePageBlocks = homePageBlocks;

      $scope.skipTo = function(block) {
        //window.console.log('skipto: ' + block);
        $('html,body').animate({
          'scrollTop': $('.' + block + '-block').offset().top
        }, 900, 'easeInOutExpo');
      };

      $scope.loadSkillsBlock = function() {
        $scope.skipTo($scope.block);

        $w.on('scroll', function() {
          clearTimeout(delay);

          delay = setTimeout(function() {
            $scope.$apply(function() {
              $scope.offsetTop = $w.scrollTop();
            });
          }, 200);
        });
      };

      $scope.$watch('block', function(val) {
        //window.console.log('block: ' + val);
        $location.search(val);
      });

      $scope.$on('$locationChangeSuccess', function() {
        //window.console.log(arguments);
      });

      $scope.quotes = quotesModel;

      $scope.skills = skillsModel;

      $scope.initializeGMap = function() {
        if (mapLoaded) {
          return;
        }
        mapLoaded = true;

        gmapService.init();
      };

      $scope.initIntroSlider = function() {
        var revapi = $('.intro-block .fullscreenbanner').revolution(
          {
            delay: 10000,
            startwidth: 1170,
            startheight: 500,
            hideThumbs: 10,
            onHoverStop: 'off',
            fullWidth: 'off',
            fullScreen: 'on',
            fullScreenOffsetContainer: '',
            keyboardNavigation: 'off',
            navigationArrows: 'none'
          });

        revapi.bind('revolution.slide.onloaded', function() {
          $(this).addClass('loaded');

          if ($scope.block !== 'intro') {
            revapi.revpause();
          }
        });

        $scope.$watch('block', function(val) {
          if (val === 'intro') {
            revapi.revresume();
          } else {
            revapi.revpause();
          }
        });
      };
      /*
       $scope.initWorksSlider = function() {
       var revapi = $('.works-block .fullscreenbanner').revolution(
       {
       delay: 10000,
       startwidth: 1170,
       startheight: 500,
       hideThumbs: 10,
       onHoverStop: 'off',
       fullWidth: 'off',
       fullScreen: 'on',
       fullScreenOffsetContainer: '',
       keyboardNavigation: 'off'
       });
       
       
       revapi.bind('revolution.slide.onloaded', function() {
       revapi.revpause()
       .bind('revolution.slide.onchange', function() {
       revapi.revpause();
       });
       });
       };
       */
      $scope.initQuotesSlider = function() {
        if ($scope.block !== 'works' && $scope.block !== 'about') {
          $scope.$broadcast('pause.quotes.slide');
        }

        $scope.$watch('block', function(val) {
          if (val === 'works' || val === 'about') {
            $scope.$broadcast('play.quotes.slide');
          } else {
            $scope.$broadcast('pause.quotes.slide');
          }
        });
      };

      $scope.contactData = {};
      $scope.contact = {
        submited: false,
        sent: false,
        errorMessages: [],
        stripErrors: true
      };

      $scope.contactScope = false;
      $scope.initFormScope = function(formScope) {
        $scope.contactScope = formScope;
      };

      $scope.submitContact = function(isValid) {
        $scope.contact.submited = true;
        $scope.contact.errorMessages = [];

//        window.console.log(isValid);
//        window.console.log($scope.contactScope);

        if (isValid) {
          $http({
            url: '/contact.php',
            data: $.param($scope.contactData),
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
          })
            .success(function(data, status, headers, config) {
              if (data.status === 'success') {
                $scope.contact.sent = true;
              } else if (data.status === 'error') {
                $scope.contact.submited = false;

                for (var field in data.messages) {
                  for (var reason in data.messages[field]) {
                    switch (reason) {
                      case 'isEmpty' :
                        $scope.contact.errorMessages.push('Field "' + field + '" is required');
                        break;

                      case 'stringLengthTooShort' :
                        $scope.contact.errorMessages.push('Field "' + field + '" is to short');
                        break;

                      case 'stringLengthTooLong' :
                        $scope.contact.errorMessages.push('Field "' + field + '" is to long');
                        break;

                      case 'emailAddressInvalid' :
                      case 'emailAddressInvalidFormat':
                      case 'emailAddressInvalidHostname':
                      case 'emailAddressInvalidMxRecord':
                      case 'emailAddressInvalidSegment':
                      case 'emailAddressDotAtom':
                      case 'emailAddressQuotedString':
                      case 'emailAddressInvalidLocalPart':
                      case 'emailAddressLengthExceeded' :
                        $scope.contact.errorMessages.push('Email is not valid');
                    }
                  }
                }

                $scope.contact.stripErrors = false;
                stripErrors();
              }
            })
            .error(function(data, status, headers, config) {
              $scope.contact.submited = false;
              window.console.log('error');
            });
        } else {
          $scope.contact.stripErrors = false;
          $scope.contact.submited = false;
          stripErrors();
        }
      };

      function stripErrors() {
        $timeout(function() {
          $scope.contact.stripErrors = true;
        }, 3000);
      }
    }
  ]);
