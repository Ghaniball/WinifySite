'use strict';

angular.module('winifySiteFooterPagesCtrl', [])
  .controller('FooterPagesCtrl', [
    '$rootScope',
    '$scope',
    '$window',
    '$anchorScroll',
    'gmapService',
    function($rootScope, $scope, $window, $anchorScroll, gmapService) {
      var mapLoaded = false;

      $rootScope.isHome = false;
      $anchorScroll();

      $scope.initializeGMap = function() {
        if (mapLoaded) {
          return;
        }
        mapLoaded = true;

        gmapService.init();
      };
    }
  ]);