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
    'winifySiteServices',
    'winifySiteDirectives'
  ])
  .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
      $locationProvider.html5Mode(true).hashPrefix('!');
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
        }).otherwise({
          redirectTo: '/'
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
        $rootScope.locpath = $location.url();

        //window.console.log($rootScope.locpath);
      });

      $rootScope.$on('$routeChangeSuccess', function() {
        $rootScope.lang = 'de';

        $rootScope.path = $rootScope.base;
        
        $rootScope.l10n = l10n;

        //$window.console.log($location.path());
        $window.ga('send', 'pageview', $location.path());
        //$window.ga('newTracker.send', 'pageview', $location.path());
        //$window._gaq.push(['_trackPageview', $location.path()]);

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
