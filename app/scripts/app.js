'use strict';

angular
  .module('winifySiteApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'winifySiteCtrls',
    'winifySiteServices',
    'winifySiteDirectives'
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
          controller: 'FooterPagesCtrl'/*,
          reloadOnSearch: false*/
        })
        .when('/impressum', {
          templateUrl: 'views/impressum.html',
          controller: 'FooterPagesCtrl'/*,
          reloadOnSearch: false*/
        })
        .when('/impressum2', {
          templateUrl: 'views/impressum2.html',
          controller: 'FooterPagesCtrl'/*,
          reloadOnSearch: false*/
        })
        .when('/datenschutz', {
          templateUrl: 'views/datenschutz.html',
          controller: 'FooterPagesCtrl'/*,
          reloadOnSearch: false*/
        })
        .otherwise({
          redirectTo: '/home'
        });
    }]);
