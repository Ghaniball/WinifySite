'use strict';

angular.module('winifySiteServices', [])
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
            if (b[i] in s) {
              return b[i];
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
          'head': 'Entwicklung',
          'desc': 'We create powerful and secure online experiences. We build responsive websites and mobile apps.'
        },
        {
          'ico': 'skill-manage',
          'head': 'Management',
          'desc': 'We will take care of your project and will keep you updated at every stage.'
        },
        {
          'ico': 'skill-test',
          'head': 'Testen und QA',
          'desc': 'After our automatic and manual tests you will be able to check the work on our test servers for your review. '
        },
        {
          'ico': 'skill-design',
          'head': 'Design',
          'desc': 'We will help you to discover your unique brand. A a custom solution which creates value for you and your customers.'
        },
        {
          'ico': 'skill-admin',
          'head': 'Unterstützung',
          'desc': 'The work doesn\'t stop once the product was launched. The most important aspect of any project is that the product works well.'
        }
      ];
    }])
  .factory('quotesModel', [function() {
      return [
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
    }]);
