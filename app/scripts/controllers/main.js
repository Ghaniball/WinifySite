'use strict';

angular.module('winifySiteApp')
  .controller('HomeCtrl', [
    '$rootScope',
    '$scope',
    function($rootScope, $scope) {
      $scope.awesomeThings = [
        'HTML5 Boilerplate',
        'AngularJS',
        'Karma'
      ];
      
      $rootScope.isHome = true;
    }
  ]);
