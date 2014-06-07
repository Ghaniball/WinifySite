'use strict';

angular.module('winifySiteCtrls', [])
  .controller('HomeCtrl', [
    '$rootScope',
    '$scope',
    '$location',
    '$routeParams',
    '$window',
    '$timeout',
    '$http',
    'getSearchKey',
    'homePageBlocks',
    'skillsModel',
    'quotesModel',
    function($rootScope, $scope, $location, $routeParams, $window, $timeout, $http, getSearchKey, homePageBlocks, skillsModel, quotesModel)
    {
      var $ = $window.jQuery,
        $w = $($window),
        delay = 0,
        mapLoaded = false,
        google = $window.google;


      window.console.log(homePageBlocks);
      
      $rootScope.isHome = true;
      $scope.offsetTop = false;
      $scope.path = $location.path();
      $scope.block = getSearchKey || 'intro';
      $scope.homePageBlocks = homePageBlocks;

      $scope.skipTo = function(block) {
        //window.console.log('skipto: ' + block);
        $('html,body').animate({
          'scrollTop': $('.' + block + '-block').offset().top
        }, 900, 'easeInOutExpo');
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

      $scope.quotes = quotesModel;

      $scope.skills = skillsModel;

      $scope.initializeGMap = function() {
        if (mapLoaded) {
          return;
        }

        mapLoaded = true;


        var styles = [
          {'featureType': 'water', 'stylers': [{'visibility': 'on'}, {'color': '#e0f0fa'}]},
          {'featureType': 'landscape', 'stylers': [{'visibility': 'on'}, {'color': '#fff6e5'}]},
          {'featureType': 'road', 'stylers': [{'visibility': 'on'}, {'color': '#ffffff'}]},
          {'featureType': 'road', 'elementType': 'labels.text.fill', 'stylers': [{'visibility': 'on'}, {'color': '#3e444f'}]},
          {'featureType': 'road', 'elementType': 'geometry.stroke', 'stylers': [{'color': '#d3d5d6'}]},
          {'featureType': 'poi.park', 'stylers': [{'color': '#ebf3e1'}]},
          {'featureType': 'poi.medical', 'elementType': 'geometry', 'stylers': [{'visibility': 'on'}, {'color': '#ecf0eb'}]},
          {'featureType': 'water', 'elementType': 'labels.text.fill', 'stylers': [{'visibility': 'on'}, {'color': '#000000'}]}
        ];

        var styledMap = new google.maps.StyledMapType(styles, {name: 'Styled Map'});
        var mapOptions = {center: new google.maps.LatLng(0,0), scrollwheel: false, zoom: 16, mapTypeControlOptions: {mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']}};
        var map = new google.maps.Map(document.getElementById('map_container'), mapOptions);
        map.mapTypes.set('map_style', styledMap);
        map.setMapTypeId('map_style');
        
        var bounds = new google.maps.LatLngBounds();
        
        var markerPosPol = new google.maps.LatLng(50.057118, 19.92484);
        var markerPol = new google.maps.Marker({position: markerPosPol, map: map, title: 'Winify'});
        bounds.extend(markerPosPol);
        
        var markerPosMold = new google.maps.LatLng(47.02948428, 28.84300053);
        var markerMold = new google.maps.Marker({position: markerPosMold, map: map, title: 'Winify'});
        bounds.extend(markerPosMold);
        
        var markerPosSchw = new google.maps.LatLng(47.1861859, 8.473614);
        var markerSchw = new google.maps.Marker({position: markerPosSchw, map: map, title: 'Winify'});
        bounds.extend(markerPosSchw);
        
        map.fitBounds(bounds);

        var contentStringPol = '<p class="info-window">Winify Sp. z o.o. - Poland<br/>ul. Syrokomli 22/6<br/>30-102 Kraków</p>';
        var infowindowPol = new google.maps.InfoWindow({content: contentStringPol});

        google.maps.event.addListener(markerPol, 'click', function() {
          infowindowPol.open(map, markerPol);
        });

        var contentStringMold = '<p class="info-window">Winify SRL. - Moldova<br/>str. A. Puskin 47/1, of 4,<br/>MD-2005 Chișinău</p>';
        var infowindowMold = new google.maps.InfoWindow({content: contentStringMold});

        google.maps.event.addListener(markerMold, 'click', function() {
          infowindowMold.open(map, markerMold);
        });

        var contentStringSchw = '<p class="info-window">Winify AG - Switzerland<br/>Alte Steinhauserstrasse 1<br/>6330 Cham</p>';
        var infowindowSchw = new google.maps.InfoWindow({content: contentStringSchw});

        google.maps.event.addListener(markerSchw, 'click', function() {
          infowindowSchw.open(map, markerSchw);
        });
      };

      $scope.initIntroSlider = function() {
        var revapi = $('.intro-block .fullscreenbanner').revolution(
          {
            delay: 10000,
            startwidth: 1170,
            startheight: 500,
            hideThumbs: 10,
            onHoverStop: 'off',
            fullWidth: 'off',
            fullScreen: 'on',
            fullScreenOffsetContainer: '',
            keyboardNavigation: 'off',
            navigationArrows: 'none'
          });

        revapi.bind('revolution.slide.onloaded', function() {
          $(this).addClass('loaded');

          if ($scope.block !== 'intro') {
            revapi.revpause();
          }
        });

        $scope.$watch('block', function(val) {
          if (val === 'intro') {
            revapi.revresume();
          } else {
            revapi.revpause();
          }
        });
      };
/*
      $scope.initWorksSlider = function() {
        var revapi = $('.works-block .fullscreenbanner').revolution(
          {
            delay: 10000,
            startwidth: 1170,
            startheight: 500,
            hideThumbs: 10,
            onHoverStop: 'off',
            fullWidth: 'off',
            fullScreen: 'on',
            fullScreenOffsetContainer: '',
            keyboardNavigation: 'off'
          });


        revapi.bind('revolution.slide.onloaded', function() {
          revapi.revpause()
            .bind('revolution.slide.onchange', function() {
              revapi.revpause();
            });
        });
      };
*/
      $scope.initQuotesSlider = function() {
        if ($scope.block !== 'works' && $scope.block !== 'about') {
          $scope.$broadcast('pause.quotes.slide');
        }

        $scope.$watch('block', function(val) {
          if (val === 'works' || val === 'about') {
            $scope.$broadcast('play.quotes.slide');
          } else {
            $scope.$broadcast('pause.quotes.slide');
          }
        });
      };

      $scope.contactData = {};
      $scope.contact = {
        submited: false,
        sent: false
      };

      $scope.submitContact = function(isValid) {
        $scope.contact.submited = true;

        window.console.log(isValid);
        window.console.log($scope.contactData);

        if (isValid) {
          $scope.contactData.callback = 'JSON_CALLBACK';
          $http.jsonp('http://192.168.3.134:8524/contact.php', {params: $scope.contactData})
            .success(function(data, status, headers, config) {
              if (data.status === 'success') {
                $scope.contact.sent = true;
                
              } else {
                
              }
              
              window.console.log('success');
              window.console.log(data);
            })
            .error(function(data, status, headers, config) {
              window.console.log('error');
            });
        } else {
          $timeout(function() {
            $scope.contact.submited = false;
          }, 3000);
        }
      };
    }
  ]);
