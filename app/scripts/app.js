'use strict';

angular
  .module('winifySiteApp', [
    /*'ngCookies',
     'ngResource',
     'ngSanitize',*/
    'ngRoute',
    'winifySiteHomeCtrl',
    'winifySiteFooterPagesCtrl',
    'winifySiteCalculatorCtrl',
    'winifySiteServices',
    'winifySiteDirectives'
  ])
  .run([
    '$rootScope',
    '$location',
    '$window',
    '$timeout',
    'BSizeService',
    function($rootScope, $location, $window, $timeout, BSizeService) {

      $rootScope.timerInitial = new Date().getTime();

      $rootScope.$on('$routeChangeSuccess', function() {
        //$window.console.log($location.path());
        $window.ga('send', 'pageview', $location.path());
        $window._gaq.push(['_trackPageview', $location.path()]);

        $rootScope.timerInitial = new Date().getTime();
      });
      /*
       $rootScope.$on('$viewContentLoaded', function() {
       console.log('$viewContentLoaded');
       $timeout(AnalyticsService.run, 500);
       });
       */
      $rootScope.sendEvent = function(ev, label) {
        var $this = angular.element(ev.currentTarget);
/*
        try {
          console.log(ev);
          console.log($this.prop('tagName'));
          console.log($this.attr('href').charAt(0));
          console.log($this.attr('target'));
        } catch (err) {
        }
        ev.preventDefault();*/
        if ($this.prop('tagName') === 'A' && $this.attr('href').charAt(0) !== '#' && $this.attr('target') !== '_blank') {
          ev.preventDefault();
          $window.ga('send', {
            'hitType': 'event',
            'eventCategory': 'WebsiteBtns',
            'eventAction': 'WebsiteClicks',
            'eventLabel': label,
            'eventValue': Math.round((new Date().getTime() - $rootScope.timerInitial) / 1000),
            'hitCallback': function() {
              $window.document.location = $this.attr('href');
            }
          });
        } else {
          $window.ga('send', {
            'hitType': 'event',
            'eventCategory': 'WebsiteBtns',
            'eventAction': 'WebsiteClicks',
            'eventLabel': label,
            'eventValue': Math.round((new Date().getTime() - $rootScope.timerInitial) / 1000)
          });
        }

        console.log('send event: ' + label);
      };
      /*
       $rootScope.$on('$locationChangeSuccess', function() {
       $window.console.log(arguments);
       });
       */
      $rootScope.loadTopMenu = function(title) {
        /* console.log('loadtopmenu');
         if (typeof title === 'string') {
         $window.document.title = title + ' :: Winify';
         }*/
        $window.Gumby.initialize('toggles');
        $window.Gumby.initialize('fixed');
      };

      $rootScope.BrowserSize = BSizeService.get(true);


      $rootScope.$on('browser.resize', function($event, arg) {
        //window.console.log(arg);

        $rootScope.BrowserSize = arg;
      });

      $rootScope.$on('$destroy', function() {
        BSizeService.off();
      });
    }
  ])
  .config(['$routeProvider', function($routeProvider) {
      $routeProvider
        .when('/home', {
          templateUrl: 'views/home.html',
          controller: 'HomeCtrl',
          reloadOnSearch: false
        })
        .when('/agb', {
          templateUrl: 'views/agb.html',
          controller: 'FooterPagesCtrl'
        })
        .when('/impressum', {
          templateUrl: 'views/impressum.html',
          controller: 'FooterPagesCtrl'
        })
        .when('/datenschutz', {
          templateUrl: 'views/datenschutz.html',
          controller: 'FooterPagesCtrl'
        })
        .when('/calculator', {
          templateUrl: 'views/calculator.html',
          controller: 'CalculatorCtrl'
        })/**/
//        .when('/calculator/agreement', {
//          templateUrl: 'views/calculator/agreement.html',
//          controller: 'CalculatorCtrl'
//        })
//        .when('/calculator', {
//          redirectTo: '/calculator/agreement'
//        })
        .otherwise({
          redirectTo: '/home'
        });
    }]);
