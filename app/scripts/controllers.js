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
        }, 300, 'swing');
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
        //window.console.log(arguments);
      });

      $scope.loadTopMenu = function() {
        $window.Gumby.initialize('toggles');
      };
      
      $scope.quotes = [
        {
          'text': '"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam tincidunt lorem tellus, ac tincidunt libero malesuada non. Vivamus sollicitudin pharetra tellus, in faucibus eros blandit ac. Sed sapien ante, pulvinar in bibendum non, molestie vitae diam. Integer quis purus eget sem feugiat fermentum."',
          'author': {
            'name': 'John Doe',
            'desc': 'Creative Director'
          }
        },
        {
          'text': '"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam tincidunt lorem tellus, ac tincidunt libero malesuada non. Vivamus sollicitudin pharetra tellus, in faucibus eros blandit ac. Sed sapien ante, pulvinar in bibendum non, molestie vitae diam. Integer quis purus eget sem feugiat fermentum."',
          'author': {
            'name': 'John Doe2',
            'desc': 'Creative Director'
          }
        },
        {
          'text': '"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam tincidunt lorem tellus, ac tincidunt libero malesuada non. Vivamus sollicitudin pharetra tellus, in faucibus eros blandit ac. Sed sapien ante, pulvinar in bibendum non, molestie vitae diam. Integer quis purus eget sem feugiat fermentum."',
          'author': {
            'name': 'John Doe3',
            'desc': 'Creative Director'
          }
        }
      ];
    }
  ]);
