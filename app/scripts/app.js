'use strict';

angular
  .module('winifySiteApp', [
    /*'ngCookies',
     'ngResource',*/
    'ngTouch',
    'ngSanitize',
    'ngRoute',
    'winifySiteHomeCtrl',
    'winifySiteFooterPagesCtrl',
    'winifySiteCalculatorCtrl',
    'winifySiteServices',
    'winifySiteDirectives'
  ])
  .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
      $locationProvider.html5Mode(true).hashPrefix('!');
      /*      if (Modernizr.history) {
       $locationProvider.html5Mode(true);
       } else {
       $locationProvider.hashPrefix('!');
       }
       */
      $routeProvider
        .when('/:lang/', {
          templateUrl: 'views/home.html',
          controller: 'HomeCtrl',
          reloadOnSearch: false
        })
        .when('/:lang/agb', {
          templateUrl: 'views/agb.html',
          controller: 'FooterPagesCtrl'
        })
        .when('/:lang/impressum', {
          templateUrl: 'views/impressum.html',
          controller: 'FooterPagesCtrl'
        })
        .when('/:lang/datenschutz', {
          templateUrl: 'views/datenschutz.html',
          controller: 'FooterPagesCtrl'
        })/*
         .when('/calculator', {
         templateUrl: 'views/calculator.html',
         controller: 'CalculatorCtrl'
         })*/
//        .when('/calculator/agreement', {
//          templateUrl: 'views/calculator/agreement.html',
//          controller: 'CalculatorCtrl'
//        })
//        .when('/calculator', {
//          redirectTo: '/calculator/agreement'
//        })
        .otherwise({
          redirectTo: '/de/'
        });
    }
  ])
  .run([
    '$rootScope',
    '$routeParams',
    '$location',
    '$window',
    '$timeout',
    'BSizeService',
    'AnalyticsEvents',
    'l10n',
    function($rootScope, $routeParams, $location, $window, $timeout, BSizeService, AnalyticsEvents, l10n) {
      $rootScope.timerInitial = new Date().getTime();

      $rootScope.base = $location.$$html5 ? '/' : '/#!/';

      $rootScope.$on('$locationChangeSuccess', function() {
        $rootScope.locpath = $location.url().replace('/de', '').replace('/en', '');

        window.console.log($rootScope.locpath);
      });

      $rootScope.$on('$routeChangeSuccess', function() {
        var l = $routeParams.lang;
        $rootScope.lang = l === 'en' ? 'en' : 'de';

        $rootScope.path = $rootScope.base + $rootScope.lang + '/';
        
        $rootScope.l10n = l10n;

        //$window.console.log($location.path());
        $window.ga('send', 'pageview', $location.path());
        $window.ga('newTracker.send', 'pageview', $location.path());
        $window._gaq.push(['_trackPageview', $location.path()]);

        $rootScope.timerInitial = new Date().getTime();
      });

      $rootScope.sendEvent = AnalyticsEvents.send;

      $rootScope.loadTopMenu = function(title) {
        $window.Gumby.initialize('toggles');
        $window.Gumby.initialize('fixed');
      };

      $rootScope.BrowserSize = BSizeService.get(true);

      $rootScope.$on('browser.resize', function($event, arg) {
        $rootScope.BrowserSize = arg;
      });

      $rootScope.$on('$destroy', function() {
        BSizeService.off();
      });
    }
  ]);
