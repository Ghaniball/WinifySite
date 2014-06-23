'use strict';

angular
  .module('winifySiteApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'winifySiteHomeCtrl',
    'winifySiteFooterPagesCtrl',
    'winifySiteCalculatorCtrl',
    'winifySiteServices',
    'winifySiteDirectives'
  ])
  .run([
    '$rootScope',
    '$location',
    '$window',
    function($rootScope, $location, $window) {
      $rootScope.$on('$routeChangeSuccess', function() {
//        $window.console.log($location.path());
        $window.ga('send', 'pageview', $location.path());
        $window._gaq.push(['_trackPageview', $location.path()]);
      });

      $rootScope.loadTopMenu = function(title) {
        if (typeof title === 'string') {
          $window.document.title = title + ' :: Winify';
        }
        $window.Gumby.initialize('toggles');
        $window.Gumby.initialize('fixed');
      };
    }
  ])
  .config(['$routeProvider', function($routeProvider) {
      $routeProvider
        .when('/home', {
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
        })
        .when('/calculator', {
          templateUrl: 'views/calculator.html',
          controller: 'CalculatorCtrl'/*,
          reloadOnSearch: false*/
        })
//        .when('/calculator/agreement', {
//          templateUrl: 'views/calculator/agreement.html',
//          controller: 'CalculatorCtrl'
//        })
//        .when('/calculator', {
//          redirectTo: '/calculator/agreement'
//        })
        .otherwise({
          redirectTo: '/home'
        });
    }]);
