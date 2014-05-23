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
      var $ = $window.jQuery,
        $w = $($window),
        delay = 0;

      $rootScope.isHome = true;
      $scope.offsetTop = false;
      $scope.path = $location.path();
      $scope.block = getSearchKey || 'intro';

      $scope.skipTo = function(block) {
        //window.console.log('skipto: ' + block);
        $('html,body').animate({
          'scrollTop': $('.' + block + '-block').offset().top
        }, 200, 'swing');
      };

      $scope.loadSkillsBlock = function() {
        $scope.skipTo($scope.block);

        $w.on('scroll', function() {
          clearTimeout(delay);

          delay = setTimeout(function() {
            $scope.$apply(function() {
              $scope.offsetTop = $w.scrollTop();
            });
          }, 200);
        });
      };

      $scope.$watch('block', function(val) {
        //window.console.log('block: ' + val);
        $location.search(val);
      });

      $scope.$on('$locationChangeSuccess', function() {
        window.console.log(arguments);
      });

      $scope.loadTopMenu = function() {
        $window.Gumby.initialize('toggles');
      };
    }
  ]);
