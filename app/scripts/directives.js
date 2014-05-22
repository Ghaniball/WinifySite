'use strict';

angular.module('winifySiteDirectives', [])
  .directive('scrollToMe', [
    function() {
      return {
        restrict: 'A',
        link: function(scope, element, attrs) {
          scope.$watch(attrs.scrollToMe, function(newVal) {
            window.console.log(attrs.scrollToMe);
          });
        }
      };
    }
  ]);