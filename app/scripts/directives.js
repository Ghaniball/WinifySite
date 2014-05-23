'use strict';

angular.module('winifySiteDirectives', [])
  .directive('wnfScrollPos', [
    function() {
      return {
        restrict: 'A',
        link: function(scope, element, attrs) {
          var min, max;
          attrs.$observe('wnfScrollPos', function(scrollTop) {
            min = element.offset().top - 140;
            max = element.outerHeight() + min + 140;
            
            if (scrollTop > min && scrollTop < max && scrollTop >= 0) {
              scope.block = element.attr('class').match(/\w+(?=-block)/gi)[0];
            }
          });
        }
      };
    }
  ]);