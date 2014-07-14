'use strict';

angular
  .module('winifySiteApp', [
    /*'ngCookies',
     'ngResource',
     'ngSanitize',*/
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
        .when('/', {
          templateUrl: 'views/home.html',
          controller: 'HomeCtrl',
          reloadOnSearch: false
        })
        .when('/agb', {
          templateUrl: 'views/agb.html',
          controller: 'FooterPagesCtrl'
        })
        .when('/impressum', {
          templateUrl: 'views/impressum.html',
          controller: 'FooterPagesCtrl'
        })
        .when('/datenschutz', {
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
          redirectTo: '/'
        });
    }
  ])
  .run([
    '$rootScope',
    '$location',
    '$window',
    '$timeout',
    'BSizeService',
    'AnalyticsEvents',
    'homePageBlocks',
    function($rootScope, $location, $window, $timeout, BSizeService, AnalyticsEvents, homePageBlocks) {
      $rootScope.homePageBlocks = homePageBlocks;
      
      $rootScope.timerInitial = new Date().getTime();

      $rootScope.path = $location.$$html5 ? '/' : '/#!/';

      $rootScope.$on('$routeChangeSuccess', function() {
        //$window.console.log($location.path());
        $window.ga('send', 'pageview', $location.path());
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
