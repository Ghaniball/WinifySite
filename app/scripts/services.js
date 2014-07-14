'use strict';

angular.module('winifySiteServices', [])
  .constant('calcModel', {
    'prop1': 'value1',
    'prop2': 'value2'
  })
  .constant('homePageBlocks', [
    {
      name: 'intro',
      text: 'Home'
    },
    {
      name: 'skills',
      text: 'Leistungen'
    },
    /*{
     name: 'works',
     text: 'Works'
     },*/
    {
      name: 'about',
      text: 'Wir'
    },
    {
      name: 'projekte',
      text: 'Projekte'
    },
    {
      name: 'contact',
      text: 'Kontakt'
    }
  ])
  .factory('AnalyticsEvents', ['$window', '$rootScope',
    function($window, $rootScope) {
      return {
        'send': function(ev, label) {
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
          
          function isUnparsedLink($el) {
            return $el.prop('tagName') === 'A' &&
              ($el.attr('target') === '_self' ||
                ($el.attr('href').indexOf('http') === 0 && $el.attr('target') !== '_blank'));
          }
          
          //window.console.log(isUnparsedLink($this));
          //window.console.log($this);
          if (isUnparsedLink($this)) {
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
          
          //console.log('send event: ' + label);
        }
      };
    }])
  .factory('BSizeService', ['$window', '$timeout', '$rootScope',
    function($window, $timeout, $rootScope) {
      return {
        'get': function(onResize) {
          var $w = angular.element($window),
            size = {
              'width': $w.width(),
              'height': $w.height()
            };

          //window.console.log($rootScope);

          if (onResize) {
            (function resize() {
              $w.on('resize', function() {
                $w.off('resize');
                $rootScope.$broadcast('browser.resize', {
                  'width': $w.width(),
                  'height': $w.height()
                });

                $timeout(resize, 200);
              });
            })();
          }

          return size;
        },
        'stop': function() {
          angular.element($window).off('resize');
        }
      };
    }])
  .factory('searchKey', ['homePageBlocks', '$location',
    function(homePageBlocks, $location) {
      return {
        'get': function() {
          var search = $location.search() || {};

          return (function(b, s) {
            var i = 0, l = b.length;
            for (i; i < l; i++) {
              if (b[i].name in s) {
                return b[i].name;
              }
            }
            return false;
          })(homePageBlocks, search);
        }
      };
    }])
  .factory('$transition', ['$q', '$timeout', '$rootScope', function($q, $timeout, $rootScope) {

      var $transition = function(element, trigger, options) {
        options = options || {};
        var deferred = $q.defer();
        var endEventName = $transition[options.animation ? 'animationEndEventName' : 'transitionEndEventName'];

        var transitionEndHandler = function(event) {
          $rootScope.$apply(function() {
            element.unbind(endEventName, transitionEndHandler);
            deferred.resolve(element);
          });
        };

        if (endEventName) {
          element.bind(endEventName, transitionEndHandler);
        }

        // Wrap in a timeout to allow the browser time to update the DOM before the transition is to occur
        $timeout(function() {
          if (angular.isString(trigger)) {
            element.addClass(trigger);
          } else if (angular.isFunction(trigger)) {
            trigger(element);
          } else if (angular.isObject(trigger)) {
            element.css(trigger);
          }
          //If browser does not support transitions, instantly resolve
          if (!endEventName) {
            deferred.resolve(element);
          }
        });

        // Add our custom cancel function to the promise that is returned
        // We can call this if we are about to run a new transition, which we know will prevent this transition from ending,
        // i.e. it will therefore never raise a transitionEnd event for that transition
        deferred.promise.cancel = function() {
          if (endEventName) {
            element.unbind(endEventName, transitionEndHandler);
          }
          deferred.reject('Transition cancelled');
        };

        return deferred.promise;
      };

      // Work out the name of the transitionEnd event
      var transElement = document.createElement('trans');
      var transitionEndEventNames = {
        'WebkitTransition': 'webkitTransitionEnd',
        'MozTransition': 'transitionend',
        'OTransition': 'oTransitionEnd',
        'transition': 'transitionend'
      };
      var animationEndEventNames = {
        'WebkitTransition': 'webkitAnimationEnd',
        'MozTransition': 'animationend',
        'OTransition': 'oAnimationEnd',
        'transition': 'animationend'
      };
      function findEndEventName(endEventNames) {
        for (var name in endEventNames) {
          if (transElement.style[name] !== undefined) {
            return endEventNames[name];
          }
        }
      }
      $transition.transitionEndEventName = findEndEventName(transitionEndEventNames);
      $transition.animationEndEventName = findEndEventName(animationEndEventNames);
      return $transition;
    }])
  .constant('skillsModel', [
    {
      'ico': 'skill-dev',
      'head': 'Software Entwicklung',
      'desc': 'Wir entwickeln leistungsfähige und sichere Software, Webseiten und Apps.'
    },
    {
      'ico': 'skill-manage',
      'head': 'Projekt Management',
      'desc': 'Wir sind mit dem Projekt Management erst zufrieden, wenn Sie sich gut informiert und sicher fühlen.'
    },
    {
      'ico': 'skill-test',
      'head': 'Qualitätskontrolle',
      'desc': 'Das Winify Testing und QA Programm begleitet Ihr Projekt von einem frühen Stadium bis zur finalen Übergabe an Sie.'
    },
    {
      'ico': 'skill-design',
      'head': 'Design',
      'desc': 'Wir entwickeln gemeinsam mit Ihnen den Service, der genau zu Ihnen passt. Von der Datenbank bis zum Logo Design – alles individuell.'
    },
    {
      'ico': 'skill-admin',
      'head': 'Administration',
      'desc': 'Wir kümmern uns darum, dass Ihr Service immer einwandfrei läuft. 24/7 an 365 Tagen im Jahr.'
    }
  ])
  .constant('quotesModel', [
    {
      'text': 'Die Zusammenarbeit mit Winify hat immer Freude bereitet. Über die Zeit hat sich ein persönlich-professionelles Verhältnis entwickelt, in dem wir uns gut aufgehoben fühlen. Winify ist immer bereit auf Anmerkungen und Kritik einzugehen. Wir diskutieren auf Augenhöhe und holen so sicher das Beste heraus.',
      'author': {
        'name': 'Cashless Nation AG',
        'desc': ''
      }
    },
    {
      'text': 'Winify hat uns bei der Erstellung unseres Services App sehr geholfen. Es war weniger ein Auftraggeber-Auftragnehmer Verhältnis, als eine Partnerschaft auf Augenhöhe. Wir haben uns so lange Ideen und Konzepte hin- und her gespielt bis alle zufrieden waren. Klarer Fall: Daumen hoch!',
      'author': {
        'name': 'WERBEANSTALT Schweiz AG',
        'desc': ''
      }
    },
    {
      'text': 'Wir haben mit einem kleineren Auftrag mit der Winify AG begonnen und waren sehr zufrieden. Nach und nach haben wir die Zusammenarbeit ausgebaut und mittlerweile ist Winify unser wichtigster Software und Produkt Partner.',
      'author': {
        'name': 'MUUME AG',
        'desc': ''
      }
    }
  ])
  .factory('gmapService', ['$window', '$rootScope', function($window, $rootScope) {
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

      var google = $window.google;

      return {
        init: function() {

          function sendEvent(label) {
            $window.ga('send', 'event', 'WebsiteBtns', 'WebsiteClicks', label, (new Date().getTime() - $rootScope.timerInitial) / 1000);
          }

          function addMarker(coords, infoTxt, code) {
            var markerPos = new google.maps.LatLng(coords[0], coords[1]);
            var marker = new google.maps.Marker({position: markerPos, map: map, title: 'Winify', secretCode: code});
            bounds.extend(markerPos);


            var infoWindow = new google.maps.InfoWindow({content: infoTxt});

            google.maps.event.addListener(marker, 'click', function() {
              infoWindow.open(map, marker);

              switch (marker.secretCode) {
                case 'cham':
                  sendEvent('S3MapCH');
                  break;

                case 'berlin':
                  sendEvent('S3MapDEBelin');
                  break;

                case 'munchen':
                  sendEvent('S3MapDEMunich');
                  break;

                case 'krakow':
                  sendEvent('S3MapPL');
                  break;

                case 'chisinau':
                  sendEvent('S3MapMD');
                  break;
              }
            });
          }

          var styledMap = new google.maps.StyledMapType(styles, {name: 'Styled Map'});
          var mapOptions = {center: new google.maps.LatLng(0, 0), scrollwheel: false, zoom: 16, mapTypeControlOptions: {mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']}};
          var map = new google.maps.Map(document.getElementById('map_container'), mapOptions);
          map.mapTypes.set('map_style', styledMap);
          map.setMapTypeId('map_style');

          var bounds = new google.maps.LatLngBounds();

          var infoTexts = {
            'schweiz': '<p class="info-window">Winify AG - Schweiz<br/>Alte Steinhauserstrasse 1<br/>6330 Cham</p>',
            'berlin': '<p class="info-window">Winify AG - Deutschland<br/>Stendaler Strasse 4<br/>10559 Berlin</p>',
            'munchen': '<p class="info-window">Winify AG - Deutschland<br/>Fürstenrieder Straße 99<br/>80686 München</p>',
            'poland': '<p class="info-window">Winify Sp. z o.o. - Polen<br/>ul. Syrokomli 22/6<br/>30-102 Kraków</p>',
            'moldova': '<p class="info-window">Winify SRL. - Moldau<br/>str. A. Puskin 47/1, of 4,<br/>MD-2005 Chișinău</p>'
          };

          // Schweiz
          addMarker([47.1861859, 8.473614], infoTexts.schweiz, 'cham');
          // Deutschland Berlin
          addMarker([52.533502, 13.349253], infoTexts.berlin, 'berlin');
          // Deutschland Munchen
          addMarker([48.131939, 11.503241], infoTexts.munchen, 'munchen');
          // Poland
          addMarker([50.057118, 19.92484], infoTexts.poland, 'krakow');
          // Moldova
          addMarker([47.02948428, 28.84300053], infoTexts.moldova, 'chisinau');

          map.fitBounds(bounds);
        }
      };
    }]);
