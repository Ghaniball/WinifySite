'use strict';

angular.module('winifySiteServices', [])
  .factory('AnalyticsEvents', ['$window', '$rootScope',
    function ($window, $rootScope) {
      return {
        'send': function (ev, label) {
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
              'hitCallback': function () {
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
    function ($window, $timeout, $rootScope) {
      return {
        'get': function (onResize) {
          var $w = angular.element($window),
            size = {
              'width': $w.width(),
              'height': $w.height()
            };

          //window.console.log($rootScope);

          if (onResize) {
            (function resize() {
              $w.on('resize', function () {
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
        'stop': function () {
          angular.element($window).off('resize');
        }
      };
    }])
  .factory('searchKey', ['l10n', '$location',
    function (l10n, $location) {
      return {
        'get': function () {
          var search = $location.search() || {};

          return (function (b, s) {
            var i = 0, l = b.length;
            for (i; i < l; i++) {
              if (b[i].name in s) {
                return b[i].name;
              }
            }
            return false;
          })(l10n.homePageBlocks, search);
        }
      };
    }])
  .factory('$transition', ['$q', '$timeout', '$rootScope',
    function ($q, $timeout, $rootScope) {

      var $transition = function (element, trigger, options) {
        options = options || {};
        var deferred = $q.defer();
        var endEventName = $transition[options.animation ? 'animationEndEventName' : 'transitionEndEventName'];

        var transitionEndHandler = function (event) {
          $rootScope.$apply(function () {
            element.unbind(endEventName, transitionEndHandler);
            deferred.resolve(element);
          });
        };

        if (endEventName) {
          element.bind(endEventName, transitionEndHandler);
        }

        // Wrap in a timeout to allow the browser time to update the DOM before the transition is to occur
        $timeout(function () {
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
        deferred.promise.cancel = function () {
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
  .factory('gmapService', ['$window', '$rootScope', function ($window, $rootScope) {
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
        init: function () {

          function sendEvent(label) {
            $window.ga('send', 'event', 'WebsiteBtns', 'WebsiteClicks', label, (new Date().getTime() - $rootScope.timerInitial) / 1000);
          }

          function addMarker(coords, infoTxt, code) {
            var markerPos = new google.maps.LatLng(coords[0], coords[1]);
            var marker = new google.maps.Marker({position: markerPos, map: map, title: 'Winify', secretCode: code});
            bounds.extend(markerPos);


            var infoWindow = new google.maps.InfoWindow({content: infoTxt});

            google.maps.event.addListener(marker, 'click', function () {
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
            'schweiz': '<p class="info-window">Winify AG - ' + $rootScope.l10n.countries[0][$rootScope.lang] + '<br/>Alte Steinhauserstrasse 1<br/>6330 Cham</p>',
            'berlin': '<p class="info-window">Winify AG - ' + $rootScope.l10n.countries[1][$rootScope.lang] + '<br/>Stendaler Strasse 4<br/>10559 Berlin</p>',
            'munchen': '<p class="info-window">Winify AG - ' + $rootScope.l10n.countries[1][$rootScope.lang] + '<br/>Fürstenrieder Straße 99<br/>80686 München</p>',
            'poland': '<p class="info-window">Winify Sp. z o.o. - ' + $rootScope.l10n.countries[2][$rootScope.lang] + '<br/>ul. Syrokomli 22/6<br/>30-102 Kraków</p>',
            'moldova': '<p class="info-window">Winify SRL. - ' + $rootScope.l10n.countries[3][$rootScope.lang] + '<br/>str. A. Puskin 47/1, of 4,<br/>MD-2005 Chișinău</p>'
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
    }])
  .constant('l10n', {
    'siteTitle': {
      'en': 'Winify Software Development',
      'de': 'Winify Software Entwicklung'
    },
    'intro': {
      'slide1': {
        'layer3': {
          'btn': {
            'en': 'Project calculator <br/><span>Calculate the costs of your project (website or app) in a few steps</span>',
            'de': 'Projektrechner <br/><span>Hier in wenigen Schritten die Kosten Ihres Projektes (Webseite oder App) berechnen.</span>'
          }
        }
      },
      'slide2': {
        'layer1': {
          'h2': {
            'en': 'We develop and realize<br/>your <span>ideas.</span>',
            'de': 'Wir entwickeln und realisieren<br/>Ihre <span>Ideen.</span>'
          }
        },
        'layer2': {
          'btn': {
            'en': 'About us',
            'de': 'Über uns'
          }
        }
      },
      'slide3': {
        'layer1': {
          'h2': {
            'en': '<span>Wake up!</span><br/>Let\'s try something new together!',
            'de': '<span>Aufwachen!</span><br/>Lassen Sie uns gemeinsam etwas neues ausprobieren!'
          }
        },
        'layer2': {
          'btn': {
            'en': 'Contact',
            'de': 'Kontakt'
          }
        }
      }
    },
    'skills': {
      'column1': {
        'title': {
          'en': 'We are <span>Winify</span>',
          'de': 'Wir sind <span>Winify</span>'
        },
        'content': {
          'en': 'A staff of 85 employees – offices in Germany, Switzerland, Poland, Moldova, and Australia',
          'de': '85 Mitarbeiter, Büros in Deutschland, Schweiz, Polen, Moldawien, Australien'
        }
      },
      'column2': {
        'title': {
          'en': 'We are <span>experts</span>',
          'de': 'Wir sind <span>Spezialisten</span>'
        },
        'content': {
          'en': 'Mobile apps & websites, payment systems, <span class="nobr">E- & M-Commerce</span>, social platforms',
          'de': 'Mobile Apps & Webseiten, Bezahllösungen, <span class="nobr">E- & M-Commerce</span>, soziale Plattformen'
        }
      },
      'column3': {
        'title': {
          'en': 'We develop <span>software</span>',
          'de': 'Wir entwickeln <span>Software</span>'
        },
        'content': {
          'en': 'All relevant programming languages, product & project management, quality assurance, administration & service',
          'de': 'Alle relevanten Programmiersprachen, Produkt & Projekt Management, Qualitätskontrolle, Administration & Service'
        }
      },
      'title': {
        'en': 'We are <span>Winify.</span><br/>We make good software.<br/>We make attractive websites.<br/>We will listen to you and consult you.',
        'de': 'Wir sind <span>Winify.</span><br/>Wir machen gute Software.<br/>Wir machen schöne Webseiten.<br/>Wir hören Ihnen zu und beraten Sie.'
      },
      'content': {
        'en': 'We are experts in all leading programming languages and software solutions. We will tailor them to suit your specific requirements. And add a good deal of creativity. Because only ideas which stand out from the crowd will be extraordinarily successful. Our solutions delight. They are highly appealing and can be operated intuitively.',
        'de': 'Wir beherrschen alle führenden Programmiersprachen und Software-Lösungen und passen sie exakt auf Ihre Ansprüche an. Und packen eine gehörige Portion Kreativität drauf. Denn nur Ideen, die sich von der Masse abheben, werden überdurchschnittlich erfolgreich sein. Unsere Lösungen begeistern, lassen sich intuitiv bedienen und erzeugen eine hohe Anziehungskraft.'
      },
      'content2': {
        'en': 'Software is not an end in itself. Software is a digital tool to an end. The reason you want new software or a new website is that you want to achieve an objective. And of course you want be successful by doing so. That is exactly how we see it: We are driven by the wish to produce solutions which will help our customers to succeed.',
        'de': 'Software ist kein Selbstzweck. Software ist ein digitales Werkzeug, das einen Zweck zu erfüllen hat. Sie wollen Software programmieren oder eine Webseite erstellen lassen, weil Sie damit ein Ziel verfolgen. Und natürlich wollen Sie damit Erfolg haben. Genauso sehen wir das auch: Uns treibt der Wunsch, Produkte zu erstellen, die unsere Kunden weiterbringen.'
      },
      'list': [
        {
          'ico': 'skill-dev',
          'head': {
            'en': 'Software Development',
            'de': 'Software Development'
          },
          'desc': {
            'en': 'We develop efficient and safe software, websites, and apps.',
            'de': 'Wir entwickeln leistungsfähige und sichere Software, Webseiten und Apps.'
          }
        },
        {
          'ico': 'skill-manage',
          'head': {
            'en': 'Project Management',
            'de': 'Projekt Management'
          },
          'desc': {
            'en': 'We are not satisfied with our project management until you feel well-informed and certain.',
            'de': 'Wir sind mit dem Projekt Management erst zufrieden, wenn Sie sich gut informiert und sicher fühlen.'
          }
        },
        {
          'ico': 'skill-test',
          'head': {
            'en': 'Quality Assurance',
            'de': 'Qualitätskontrolle'
          },
          'desc': {
            'en': 'The Winify testing und QA programme will accompany your project from the very beginning to the final handover.',
            'de': 'Das Winify Testing und QA Programm begleitet Ihr Projekt von einem frühen Stadium bis zur finalen Übergabe an Sie.'
          }
        },
        {
          'ico': 'skill-design',
          'head': {
            'en': 'Design',
            'de': 'Design'
          },
          'desc': {
            'en': 'Together we will develop an individual service which will meet all your needs and wishes – from database management to the design of the logo.',
            'de': 'Wir entwickeln gemeinsam mit Ihnen den Service, der genau zu Ihnen passt. Von der Datenbank bis zum Logo Design – alles individuell.'
          }
        },
        {
          'ico': 'skill-admin',
          'head': {
            'en': 'Administration',
            'de': 'Administration'
          },
          'desc': {
            'en': 'We will ensure that your service works perfectly. 24/7 on every day of the year.',
            'de': 'Wir kümmern uns darum, dass Ihr Service immer einwandfrei läuft. 24/7 und an jedem Tag des Jahres.'
          }
        }
      ]
    },
    'flow': {
      'title': {
        'en': 'From the first <span>idea</span> and <span>concept</span><br/>to the final launch',
        'de': 'Von der ersten <span>Idee</span> über das <span>Konzept</span><br/>bis zum <span>Launch</span>'
      },
      'list': [
        {
          'ico': 'flow-plan',
          'head': {
            'en': 'Plan',
            'de': 'Plan'
          },
          'desc': {
            'en': 'Setting goals<br/>Determining milestones<br/>Setting the launch date',
            'de': 'Ziele setzen<br/>Milestones vereinbaren<br/>Launch-Termin festlegen'
          }
        },
        {
          'ico': 'flow-design',
          'head': {
            'en': 'Design',
            'de': 'Design'
          },
          'desc': {
            'en': 'UI Design<br/>User experience<br/>Usability<br/>Drafts & prototypes',
            'de': 'UI Design<br/>User Experience<br/>Usability<br/>Entwurf & Prototyp'
          }
        },
        {
          'ico': 'flow-dev',
          'head': {
            'en': 'Development',
            'de': 'Entwickeln'
          },
          'desc': {
            'en': 'Web & app development<br/>Content management<br/>Database management<br/>E-commerce solutions<br/>Responsive web design<br/>Quality assurance',
            'de': 'Web & App Development<br/>Content Management<br/>Datenbanken<br/>E-Commerce Lösungen<br/>Responsive Web Design<br/>Quality Assurance'
          }
        },
        {
          'ico': 'flow-deploy',
          'head': {
            'en': 'Launch',
            'de': 'Launch'
          },
          'desc': {
            'en': 'Going live<br/>SEO/SEM<br/>Administration<br/>Maintenance and QA',
            'de': 'Live schalten<br/>SEO/SEM<br/>Administration<br/>Wartung und QA'
          }
        }
      ]
    },
    'about': {
      'title': {
        'en': 'Your customers like your website.<br/>Your earnings are good.<br/><span>Winify</span> has done a good job.',
        'de': 'Ihre Kunden nutzen Ihre Webseite gerne.<br/>Ihre Umsätze sind gut.<br/><span>Winify</span> hat einen guten Job gemacht.'
      },
      'content': {
        'en': 'Doing a good job means that we will invest all our experience, all our know-how, and all our creativity. We want to achieve the best for our customers: state-of-the-art websites and software solutions, user-friendly designs & high usability levels, automatically converting online shops, and much more. Too many buzzwords? Please scroll down a bit to find our contact box. Let us get in touch, we are always glad to specify.',
        'de': 'Gute Produkte zu machen heißt für uns, unsere ganze Erfahrung, all unser Know How und Kreativität in die Waagschale zu werfen. Wir wollen das beste für unsere Kunden erreichen: State-of-the-Art Webseiten und Software Produkte, kundenfreundliches Design & Usability, konvertierende Shops und vieles mehr. Zu viele Buzzwords? Scrollen Sie bitte etwas herunter. Dort ist unser Kontaktfeld. Lassen Sie uns sprechen, wir werden gerne konkret.'
      }
    },
    'quotes': [
      {
        'text': {
          'en': 'Working with Winify has always been a pleasure. Over time we have developed a personal as well as professional relationship. We feel very much at ease. Winify is always willing to respond to comments and criticisms. We discuss as equals. This way, we are sure to get the best results.',
          'de': 'Die Zusammenarbeit mit Winify hat immer Freude bereitet. Über die Zeit hat sich ein persönlich-professionelles Verhältnis entwickelt, in dem wir uns gut aufgehoben fühlen. Winify ist immer bereit auf Anmerkungen und Kritik einzugehen. Wir diskutieren auf Augenhöhe und holen so sicher das Beste heraus.'
        },
        'author': {
          'name': 'Cashless Nation AG',
          'desc': ''
        }
      },
      {
        'text': {
          'en': 'We started with a rather small job for Winify AG and were very satisfied. As a result, we have been gradually intensifying our cooperation. Today, Winify is our most important software and product partner.',
          'de': 'Wir haben mit einem kleineren Auftrag mit der Winify AG begonnen und waren sehr zufrieden. Nach und nach haben wir die Zusammenarbeit ausgebaut und mittlerweile ist Winify unser wichtigster Software und Produkt Partner.'
        },
        'author': {
          'name': 'MUUME AG',
          'desc': ''
        }
      },
      {
        'text': {
          'en': 'For three years now we have been cooperating with Winify in different projects. Their competence in the field of payment and everything that has to do with it is remarkable',
          'de': 'Wir arbeiten mit Winify nun schon seit drei Jahren in verschiedenen Projekten zusammen. Die Kompetenz vor allem im Bereich "Payment" und was damit zu tun hat, ist beachtenswert.'
        },
        'author': {
          'name': 'Dr. Felix Hötzinger, CEO, Demekon Entertainment AG',
          'desc': ''
        }
      },
      {
        'text': {
          'en': 'Several of our portfolio companies are or have been Winify customers – some for shorter periods, some for more than a year. For us, Winify is a very valuable and important partner.',
          'de': 'Bei mehreren Portfoliounternehmen ist Winify - zum Teil für kürzere Phasen, zum Teil seit über 12 Monaten - im Einsatz. Für uns ist Winify als Partner sehr wertvoll und äußerst wichtig.'
        },
        'author': {
          'name': 'Volker Rofalski, Mountain Partners Group',
          'desc': ''
        }
      }
    ],
    'projekte': {
      'title': {
        'en': 'Our <span>projects</span>',
        'de': 'Unsere <span>Projekte</span>'
      },
      'content': {
        'en': 'We are proud to have realized many interesting projects <b>with more than 100 renowned and innovative companies</b>.<br />Just a few examples:',
        'de': 'Wir sind stolz darauf, viele interessante Projekte mit <b>über 100 bekannten und<br/>innovativen Unternehmen</b> umgesetzt zu haben. Hier einige Beispiele:'
      }
    },
    'contact': {
      'title': {
        'en': 'We would like to find out more<br/>about <span>Your Project.</span>',
        'de': 'Wir würden gerne mehr über<br/><span>Ihr Projekt</span> erfahren.'
      },
      'form': {
        'error': {
          'en': 'Please fill out all fields!',
          'de': 'Bitte füllen Sie alle Felder aus!'
        },
        'success': {
          'en': 'Thank you, We have received your message!',
          'de': 'Vielen Dank, wir haben Ihre Nachricht erhalten!'
        },
        'placeholder': {
          'message': {
            'en': 'Your note',
            'de': 'Ihre Nachricht'
          }
        },
        'submit': {
          'en': 'Send',
          'de': 'Abschicken'
        }
      }
    },
    'countries': [
      {
        'en': 'Switzerland',
        'de': 'Schweiz'
      },
      {
        'en': 'Germany',
        'de': 'Deutschland'
      },
      {
        'en': 'Poland',
        'de': 'Polen'
      },
      {
        'en': 'Moldova',
        'de': 'Moldau'
      },
      {
        'en': 'Australia',
        'de': 'Australia'
      }
    ],
    'footer': {
      'copyright': {
        'en': '© 2014 Winify. All rights reserved.',
        'de': '© 2014 Winify. Alle Rechte vorbehalten.'
      },
      'menu': {
        'calculator': {
          'en': 'Project calculator',
          'de': 'Projektrechner'
        },
        'agb': {
          'en': 'Exclusion of liability',
          'de': 'Haftungsausschluss'
        },
        'impressum': {
          'en': 'Imprint',
          'de': 'Impressum'
        },
        'datenschutz': {
          'en': 'Privacy policy',
          'de': 'Datenschutzbestimmungen'
        }
      }
    },
    'homePageBlocks': [
      {
        name: 'intro',
        text: {
          'en': 'Home',
          'de': 'Home'
        }
      },
      {
        name: 'skills',
        text: {
          'en': 'Services',
          'de': 'Leistungen'
        }
      },
      {
        name: 'about',
        text: {
          'en': 'Us',
          'de': 'Wir'
        }
      },
      {
        name: 'projekte',
        text: {
          'en': 'Projects',
          'de': 'Projekte'
        }
      },
      {
        name: 'contact',
        text: {
          'en': 'Contact',
          'de': 'Kontakt'
        }
      }
    ],
    'agb': {
      'title': {
        'en': 'Exclusion of liability',
        'de': 'Haftungsausschluss'
      },
      'content': {
        'en': 'Winify AG and its subsidiaries do not guarantee that the information provided on this website is complete, accurate, and always current. This also applies to all links to which this website makes direct or indirect reference. Winify AG and its subsidiaries are not responsible for the content of any site reached by link from this website. Winify AG and its subsidiaries retain the right to modify or supplement information without prior notice.<br/>In making this information available, Winify AG and its subsidiaries do not establish the basis for any offer about information, consulting or similar contractual relationships. All liability for the use of the content of the website or for the accuracy of the content or for the availability of the website is excluded.<br/>Winify AG and its subsidiaries do therefore not assume any liability whatsoever for actual, direct or indirect losses or for losses incurred due to the unavailability of use, data losses or lost profits in connection with the use of documents or information accessible via this web site.',
        'de': 'Die Winify AG und deren Tochterunternehmen übernehmen keine Garantie dafür, dass die auf dieser Website bereitgestellten Informationen vollständig, richtig und in jedem Falle aktuell sind. Dies gilt auch für alle Verbindungen (“Links”), die von dieser Website direkt oder indirekt verweisen. Die Winify AG und deren Tochterunternehmen sind für den Inhalt einer Seite, die mit einem Link erreicht wird, nicht verantwortlich. Die Winify AG und deren Tochterunternehmen behalten sich das Recht vor, ohne vorherige Ankündigung Änderungen oder Ergänzungen der bereitgestellten Informationen vorzunehmen.<br/>Die Winify AG und deren Tochterunternehmen begründen durch die Bereitstellung dieser Informationen kein Vertragsangebot über Auskünfte, Beratung oder ähnliche Vertragsbeziehungen. Jegliche Haftung für die Nutzung der Inhalte der Website oder die Richtigkeit der Inhalte oder die Erreichbarkeit der Website wird ausgeschlossen.<br/>Die Winify AG und deren Tochterunternehmen haften daher nicht für konkrete, mittelbare und unmittelbare Schäden oder Schäden, die durch fehlende Nutzungsmöglichkeiten, Datenverluste oder entgangene Gewinne entstehen können, die im Zusammenhang mit der Nutzung von Dokumenten oder Informationen entstehen, die auf dieser Website zugänglich sind.'
      }
    },
    'datenschutz': {
      'title': {
        'en': 'Privacy policy',
        'de': 'Datenschutzbestimmungen'
      },
      'title2': {
        'en': 'Winify and your data',
        'de': 'Ihre Daten bei uns'
      },
      'content': {
        'en': 'Winify AG and its subsidiaries undertake to protect your personal data. This data protection declaration describes in full detail which information we gather from you and how we proceed with the data.<br/>In the following, we will therefore explain how we collect and store the data and how we ensure the protection of the personal information that you enter on this website:',
        'de': 'Die Winify AG und deren Tochterunternehmen verpflichten sich, Ihre persönlichen Daten zu schützen. Diese Datenschutzerklärung beschreibt ausführlich, welche Informationen wir über Sie erheben und was mit diesen Daten geschieht.<br/>Daher werden wir im Folgenden erklären, wie die Datenerhebung und Speicherung funktioniert und wie wir den Schutz Ihrer persönlichen Daten gewährleisten, wenn Sie über diese Website Daten eingeben:'
      },
      'content1': {
        'en': '<b>1. How are the data collected?</b><br/>For one thing, the data are collected via online forms. These data will be sent to one of Winify\'s own addresses via e-mail. The log-in data will also be saved.',
        'de': '<b>1. Wie werden die Daten erhoben?</b><br/>Die Daten werden zum einen über Online-Formulare erhoben, dabei werden die erfassten Daten per E-Mail an eine Winify-Adresse versendet. Zum anderen werden Log-Informationen abgespeichert.'
      },
      'content2': {
        'en': '<b>2. Which data are collected?</b><br/>We only collect the data you enter for newsletter registration or into contact forms. All data input is voluntary. However, we would like you to note that not all functions may be available for use if you do not enter the complete data. Furthermore, the URL and IP address will be collected once you access a Winify website.',
        'de': '<b>2. Welche Daten werden erhoben?</b><br/>Es werden Daten erhoben über das Kontaktformular oder die Newsletter Registrierung – dabei werden nur die Daten erhoben, die Sie selbst über die Eingabemasken eingeben. Jede Dateneingabe ist freiwillig. Wir weisen Sie allerdings darauf hin, dass Sie nicht alle Funktionen vollständig nutzen können, wenn Sie nicht alle Daten eingeben. Zudem werden die URL sowie die IP Adresse beim Abrufen von Winify-Webseiten erhoben.'
      },
      'content3': {
        'en': '<b>3. How is your data being used and who uses your data?</b><br/>The data is used solely for the processing of inquiries and deleted upon completion. Only Winify AG and its subsidiaries will process and use your data to be able to offer you the correct information and services. Log-in information helps to further improve the service of Winify AG and its subsidiaries. These data do not contain any personal identification information.',
        'de': '<b>3. Wie und von wem werden die Daten genutzt?</b><br/>Die Daten werden ausschließlich zur Bearbeitung der Anfragen genutzt und nach Abschluss des Vorgangs gelöscht. Wir verarbeiten und nutzen Ihre Daten nur innerhalb der Winify AG und deren Tochterunternehmen, um Ihnen die gewünschten Informationen und Dienstleistungen anbieten zu können. Die Log-Informationen werden verwendet, um den Service der Winify AG und deren Tochterunternehmen weiter zu verbessern und beinhalten keine persönliche Identifizierungsinformation.'
      },
      'content4': {
        'en': '<b>4. How do we measure visits to the website?</b><br/>This website uses Google Analytics, a web analysis service by Google, Inc. („Google“). Google Analytics uses so-called "cookies", text files saved to your computer which allow for the analysis of your website visit. When you use this website, the information created by the cookie (including your IP address) is transmitted to a Google server in the USA and saved.<br/>Google Analytics will not link the IP address transmitted by your browser to other Google data. You may refuse the use of cookies by selecting the appropriate settings on your browser. We would like to point out, however, that you might in this case not be able to use all functions of this website to their full extent. You can also prevent the data generated by the cookie about your use of the website (including your IP address) from being transmitted to Google and being stored and processed by Google by downloading and installing the browser plugin available at the following link: <a href="http://tools.google.com/dlpage/gaoptout?hl=de">http://tools.google.com/dlpage/gaoptout?hl=de</a>.',
        'de': '<b>4. Wie messen wir die Besuche auf der Webseite?</b><br/>Diese Website benutzt Google Analytics, einen Webanalysedienst der Google Inc. („Google“). Google Analytics verwendet sog. „Cookies“, Textdateien, die auf Ihrem Computer gespeichert werden und die eine Analyse der Benutzung der Website durch Sie ermöglichen. Die durch den Cookie erzeugten Informationen über Ihre Benutzung dieser Website werden in der Regel an einen Server von Google in den USA übertragen und dort gespeichert.<br/>Die im Rahmen von Google Analytics von Ihrem Browser übermittelte IP-Adresse wird nicht mit anderen Daten von Google zusammengeführt. Sie können die Speicherung der Cookies durch eine entsprechende Einstellung Ihrer Browser-Software verhindern; wir weisen Sie jedoch darauf hin, dass Sie in diesem Fall gegebenenfalls nicht sämtliche Funktionen dieser Website vollumfänglich werden nutzen können. Sie können darüber hinaus die Erfassung der durch das Cookie erzeugten und auf Ihre Nutzung der Website bezogenen Daten (inkl. Ihrer IP-Adresse) an Google sowie die Verarbeitung dieser Daten durch Google verhindern, indem sie das unter dem folgenden Link verfügbare Browser-Plugin herunterladen und installieren: <a href="http://tools.google.com/dlpage/gaoptout?hl=de">http://tools.google.com/dlpage/gaoptout?hl=de</a>.'
      },
      'content5': {
        'en': '<b>5. Who else has access to the data?</b><br/>Nobody. Your data are not forwarded to third parties.',
        'de': '<b>5. Wer hat sonst noch Zugriff auf die Daten?</b><br/>Niemand. Eine Übermittlung Ihrer Daten an Dritte findet nicht statt.'
      },
      'content6': {
        'en': '<b>6. How can the user access data, change or delete them?</b><br/>If you would like Winify AG to delete or change data, please contact us by email: <a href="mailto:customer@winify.com">customer@winify.com</a>. By cancelling your newsletter all corresponding data is deleted.',
        'de': '<b>6. Wie kann der Nutzer auf die Daten zugreifen, sie ändern oder löschen?</b><br/>Anfragen zur Löschung der Daten oder Änderungsanfragen sind ebenso per E-Mail an die Winify AG zu richten: customer@winify.com. Mit der Abmeldung des Newsletters werden auch die entsprechenden Daten gelöscht.'
      },
      'content7': {
        'en': '<b>7. How is the data protection ensured?</b><br/>The data are stored on our own state-of-the-art security systems. Once your personal data are transferred to us via internet, our precautionary measures will ensure their protection. Your data are carefully protected against loss, destruction, manipulation and unauthorized access.',
        'de': '<b>7. Wie wird die Datensicherheit gewährleistet?</b><br/>Die Daten werden auf unseren eigenen Systemen gespeichert, deren sehr hohe Sicherheit auf dem Stand der Technik ist. Wenn Sie uns personenbezogene Daten via Internet übermittelt haben, greifen unsere Vorkehrungen, um die Sicherheit Ihrer personenbezogenen Daten zu gewährleisten. Ihre Daten werden gewissenhaft vor Verlust, Zerstörung, Manipulation und unberechtigtem Zugriff geschützt.'
      }
    },
    'impressum': {
      'title': {
        'en': 'Imprint',
        'de': 'Imprint'
      },
      'content': {
        'en': '',
        'de': ''
      },
      'berlin': {
        'en': 'Berlin office',
        'de': 'Büro Berlin'
      },
      'munich': {
        'en': 'Munich office',
        'de': 'Büro München'
      }
    }
  })
  .constant('langs', [
    {
      name: 'en',
      title: 'En'
    },
    {
      name: 'de',
      title: 'De'
    }
  ]);