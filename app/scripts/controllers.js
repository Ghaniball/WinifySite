'use strict';

angular.module('winifySiteCtrls', [])
  .controller('HomeCtrl', [
    '$rootScope',
    '$scope',
    '$location',
    '$routeParams',
    '$window',
    'getSearchKey',
    function($rootScope, $scope, $location, $routeParams, $window, getSearchKey)
    {
      $scope.block = getSearchKey || 'intro';

      $scope.$watch('block', function(val) {
        window.console.log(val);
        $location.search(val);
      });
      
      $scope.$on('$locationChangeSuccess', function() {
        window.console.log(arguments);
      });
      
      $rootScope.isHome = true;

      var $ = $window.jQuery;

      $scope.loadTopMenu = function() {
        $window.Gumby.initialize('toggles');
      };
    }
  ]);
