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
  .config(['getSearchKeyProvider', 'homePageBlocks',
    function(getSearchKeyProvider, homePageBlocks) {
      getSearchKeyProvider.setBlocks(homePageBlocks);
    }])
  .config(['$routeProvider', function($routeProvider) {
      $routeProvider
        .when('/home', {
          templateUrl: 'views/home.html',
          controller: 'HomeCtrl',
          reloadOnSearch: false
        })
        .otherwise({
          redirectTo: '/home'
        });
    }]);
