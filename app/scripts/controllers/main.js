'use strict';

angular.module('winifySiteApp')
  .controller('HomeCtrl', [
    '$rootScope',
    '$scope',
    '$location',
    '$window',
    function($rootScope, $scope, $location, $window) {
      $scope.awesomeThings = [
        'HTML5 Boilerplate',
        'AngularJS',
        'Karma'
      ];
      
      var $ = $window.jQuery;
      
      $rootScope.isHome = true;

      $scope.loadTopMenu = function() {
        $window.Gumby.initialize('toggles');
      };

      $scope.loadIntroBlock = function() {
    /*    var delay = 0,
          $targets = $('#main [data-target]'),
          length = $targets.length,
          $sidebarNav = $('#sidebar-nav li');

        $($window).scroll(function() {
          clearTimeout(delay);
          delay = setTimeout(function() {
            var scrollOffset = $window.scrollTop(),
              i = 0,
              distance = 0,
              $closest;
            if (!scrollOffset) {
              $window.location.hash = '#!/';
              clearTimeout(delay);
              $sidebarNav.removeClass('active');
              return;
            }
            for (i; i < length; i++) {
              var $target = $($targets[i]),
                targetOffset = $target.data('offset');
              if (!distance || targetOffset - scrollOffset < 20 && targetOffset > distance) {
                distance = targetOffset;
                $closest = $target;
              }
            }
            var $activeLink = $('#sidebar-nav .skip[gumby-goto="[data-target=\'' + $closest.attr('data-target') + '\']"]');
            $sidebarNav.removeClass('active');
            $activeLink.parent().addClass('active');
            var href = $activeLink.attr('href');
            //currentNav = href;
            $window.location.hash = '#!/' + href.substr(1, href.length - 1);
          }, 200);
        });

        $('#sidebar-nav .skip').on('gumby.onComplete', function() {
          var href = $(this).attr('href');
          //currentNav = href;
          $window.location.hash = '#!/' + href.substr(1, href.length - 1);
        });*/
      };
      
      $scope.loadQuotesBlock = function() {

      };
    }
  ]);
