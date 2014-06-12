'use strict';

angular.module('winifySiteServices', [])
  .constant('homePageBlocks', [
    {
      name: 'intro',
      text: 'To top'
    },
    {
      name: 'skills',
      text: 'Kompetenz'
    },
    /*{
     name: 'works',
     text: 'Works'
     },*/
    {
      name: 'about',
      text: 'Über uns'
    },
    {
      name: 'work_with',
      text: 'Projekte'
    },
    {
      name: 'contact',
      text: 'Kontakt'
    }
  ])
  .provider('getSearchKey', function() {
    this.blocks = [];

    this.setBlocks = function(blocks) {
      this.blocks = blocks;
    };

    this.$get = ['$location', function($location) {
        var search = $location.search() || {};

        return (function(b, s) {
          var i = 0, l = b.length;
          for (i; i < l; i++) {
            if (b[i].name in s) {
              return b[i].name;
            }
          }
          return false;
        })(this.blocks, search);
      }];
  })
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
  .factory('skillsModel', [function() {
      return [
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
      ];
    }])
  .factory('quotesModel', [function() {
      return [
        {
          'text': 'Die Zusammenarbeit mit Winify hat immer Freude bereitet. Über die Zeit hat sich ein persönlich-professionelles Verhältnis entwickelt, in dem wir uns gut aufgehoben fühlen. Winify ist immer bereit auf Anmerkungen und Kritik einzugehen. Wir diskutieren auf Augenhöhe und holen so sicher das Beste heraus.',
          'author': {
            'name': 'Cashless Nation AG',
            'desc': ''
          }
        },
        {
          'text': 'Gemäß der Devise „Einer für alle – Alle für einen“ hat sich hier ein hervorragendes Team gefunden, das durchgängig schöne Webseiten und gute Software anbietet, die alle  kühnsten Ideen der Kunden aufreihen. Winify bietet qualitative Produkte an, von denen alle nur profitieren können. Mein Fazit: Winify macht einen guten Job, der ihr Geld auf alle Fälle wert ist.',
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
      ];
    }]);
