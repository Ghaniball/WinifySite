'use strict';

angular.module('winifySiteCtrls', [])
  .controller('HomeCtrl', [
    '$rootScope',
    '$scope',
    '$location',
    '$routeParams',
    '$window',
    '$timeout',
    'getSearchKey',
    'skillsModel',
    'quotesModel',
    function($rootScope, $scope, $location, $routeParams, $window, $timeout, getSearchKey, skillsModel, quotesModel)
    {
      var $ = $window.jQuery,
        $w = $($window),
        delay = 0,
        mapLoaded = false,
        google = $window.google;

      $rootScope.isHome = true;
      $scope.offsetTop = false;
      $scope.path = $location.path();
      $scope.block = getSearchKey || 'intro';

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
        var mapOptions = {center: new google.maps.LatLng(50.057118, 19.92484), scrollwheel: false, zoom: 16, mapTypeControlOptions: {mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']}};
        var map = new google.maps.Map(document.getElementById('map_container'), mapOptions);
        map.mapTypes.set('map_style', styledMap);
        map.setMapTypeId('map_style');

        var markerPos = new google.maps.LatLng(50.057118, 19.92484);
        var marker = new google.maps.Marker({position: markerPos, map: map, title: 'Winify'});

        var contentString = '<p class="info-window">Winify Sp. z o.o. - Poland<br/>ul. Syrokomli 22/6<br/>30-102 Kraków</p>';
        var infowindow = new google.maps.InfoWindow({content: contentString});

        google.maps.event.addListener(marker, 'click', function() {
          infowindow.open(map, marker);
        });
      };

      /*
       $scope.loadIntroBlock = function() {
       var slides = $('.my-carousel .my-slide'),
       slidesNr = slides.length,
       current = 0,
       myCarousel = $('.my-carousel'),
       stopSlide = false,
       indicators = $('<ul class="my-indicators"></ul>');
       
       if (slidesNr < 1) {
       return;
       }
       
       indicators.insertAfter(myCarousel);
       
       
       slides.each(function(idx, slide) {
       $(slide).css({'left': idx * 100 + '%'});
       $('<li><a href="#">' + (idx + 1) + '</a></li>')
       .appendTo(indicators)
       .on('click',next);
       });
       
       indicators.children().eq(current).addClass('active');
       
       function animate() {
       $timeout(function() {
       slides.eq(current).removeClass('current');
       
       myCarousel.animate({
       'left': '-' + (current + 1) * 100 + '%'
       }, 900, 'easeInOutCubic', function() {
       current++;
       
       if (current >= slidesNr) {
       current = 0;
       slides.eq(0).css({'left': '0'});
       myCarousel.eq(0).css({'left': '0'});
       } else if (current === slidesNr - 1) {
       slides.eq(0).css({'left': slidesNr * 100 + '%'});
       }
       
       if (!stopSlide) {
       animate();
       }
       
       //slides.removeClass('current');
       slides.eq(current).addClass('current');
       
       indicators.children().removeClass('active');
       indicators.children().eq(current).addClass('active');
       });
       }, 7000);
       }
       
       $scope.startSlide = function() {
       stopSlide = false;
       animate();
       };
       
       $scope.stopSlide = function() {
       stopSlide = true;
       };
       
       if ($scope.block === 'intro') {
       $scope.startSlide();
       }
       
       
       $scope.$watch('block', function(val) {
       if ($scope.block === 'intro') {
       if (stopSlide === true) {
       $scope.startSlide();
       }
       } else {
       $scope.stopSlide();
       }
       });
       
       };*/
      $scope.loadIntroBlock = function() {
        
        function slideChange(args) {
          $('.my-carousel .my-indicators .item').removeClass('selected');
          $('.my-carousel .my-indicators .item:eq(' + (args.currentSlideNumber - 1) + ')').addClass('selected');
        }

        function slideComplete(args) {
          if (!args.slideChanged) {
            return false;
          }
          //window.console.log(args);
          
          //$(args.prevSlideObject).removeClass('current');
          $(args.currentSlideObject)
            .addClass('current')
            .siblings()
            .removeClass('current');
        }

        function sliderLoaded(args) {          
          slideComplete(args);
          slideChange(args);
        }

        $('.iosSlider').iosSlider({
          desktopClickDrag: false,
          snapToChildren: true,
          infiniteSlider: true,
          navSlideSelector: '.my-carousel .my-indicators .item',
          onSlideComplete: slideComplete,
          onSliderLoaded: sliderLoaded,
          onSlideChange: slideChange,
          autoSlideTimer: 7000,
          autoSlide: false,
          keyboardControls: false
        });
      };
    }
  ]);
