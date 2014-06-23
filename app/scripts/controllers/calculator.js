'use strict';

angular.module('winifySiteCalculatorCtrl', [])
  .controller('CalculatorCtrl', [
    '$rootScope',
    '$scope',
    '$window',
    '$anchorScroll',
    'calcModel',
    '$location',
    function($rootScope, $scope, $window, $anchorScroll, calcModel, $location) {
      $scope.query = $location.search();
      
      window.console.log($scope);
      
      $scope.data= calcModel;

      $rootScope.isHome = false;
      $anchorScroll();
/*
      
      $scope.$on('$destroy', function () {
        window.console.log('destroy');
        window.console.log($scope);
      });*/

//      $scope.stepTo = function(step) {
//        //window.console.log('skipto: ' + block);
//        
//      };
//
//      $scope.$watch('step', function(val) {
//        //window.console.log('block: ' + val);
//        $location.search(val);
//      });
    }
  ]);