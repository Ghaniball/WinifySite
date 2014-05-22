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
  .config(function(getSearchKeyProvider){
    getSearchKeyProvider.setBlocks(['intro', 'skills', 'works', 'about', 'contact']);
  })
  .config(function ($routeProvider) {
    $routeProvider
     /* .when('/home', {
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl'
      })*/
      .when('/home', {
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl',
        reloadOnSearch: false
      })
      .otherwise({
        redirectTo: '/home'
      });
  });
