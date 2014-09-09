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
  .factory('$transition', ['$q', '$timeout', '$rootScope', function ($q, $timeout, $rootScope) {

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
    'intro': {
      'slide1': {
        'layer3': {
          'btn': {
            'en': 'Project calculator <br/><span>Here you can estimate the approximate costs of your project (website or app development) in a few simple steps.</span>',
            'de': 'Projektrechner <br/><span>Hier in wenigen Schritten die Kosten Ihres Projektes (Webseite oder App) berechnen.</span>'
          }
        }
      },
      'slide2': {
        'layer1': {
          'h2': {
            'en': 'We develop your <span>ideas</span><br/>and bring them to life.',
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
            'en': 'Contact us',
            'de': 'Kontakt'
          }
        }
      }
    },
    'skills': {
      'column1': {
        'title': {
          'en': '',
          'de': 'Wir sind <span>Winify</span>'
        },
        'content': {
          'en': '',
          'de': '85 Mitarbeiter, Büros in Deutschland, Schweiz, Polen, Moldawien, Australien'
        }
      },
      'column2': {
        'title': {
          'en': '',
          'de': 'Wir sind <span>Spezialisten</span>'
        },
        'content': {
          'en': '',
          'de': 'Mobile Apps & Webseiten, Bezahllösungen, E & M - Commerce, Social Plattformen'
        }
      },
      'column3': {
        'title': {
          'en': '',
          'de': 'Wir entwickeln <span>Software</span>'
        },
        'content': {
          'en': '',
          'de': 'Alle relevanten Programmiersprachen, Produkt & Projekt Management, Qualitätskontrolle, Administration & Service'
        }
      },
      'title': {
        'en': 'We listen to you and give you useful advices.<br/>We make beautiful websites.<br/>We make good software.<br/><span>Winify.</span>',
        'de': 'Wir sind <span>Winify.</span><br/>Wir machen gute Software.<br/>Wir machen schöne Webseiten.<br/>Wir hören Ihnen zu und beraten Sie.'
      },
      'content': {
        'en': 'The core to your success is fully functional technology that fulfills all user’s needs and can even generate joy. We master all the leading software solutions and tailor them exactly to your needs. The thing that makes the difference is our creativity! We believe that only solutions that stand out from the mass can be successful. Our solutions inspire, they are intuitive and possess the magnetism for the user. Our standard is the success in our client\'s business. That\'s why we always think integrally and give our clients competent and innovative advices in all the areas of a product chain.',
        'de': 'Wir beherrschen alle führenden Programmiersprachen und Software-Lösungen und passen sie exakt auf Ihre Ansprüche an. Und packen eine gehörige Portion Kreativität drauf. Denn nur Ideen, die sich von der Masse abheben, werden überdurchschnittlich erfolgreich sein. Unsere Lösungen begeistern, lassen sich intuitiv bedienen und erzeugen eine hohe Anziehungskraft.'
      },
      'content2': {
        'en': '',
        'de': 'Software ist kein Selbstzweck. Software ist ein digitales Werkzeug, das einen Zweck zu erfüllen hat. Sie wollen Software programmieren oder eine Webseite erstellen lassen, weil Sie damit ein Ziel verfolgen. Und natürlich wollen Sie damit Erfolg haben. Genauso sehen wir das auch: Uns treibt der Wunsch, Produkte zu erstellen, die unsere Kunden weiterbringen.'
      },
      'list': [
        {
          'ico': 'skill-dev',
          'head': {
            'en': 'Software Development',
            'de': 'Software Entwicklung'
          },
          'desc': {
            'en': 'We develop powerful and secure software, websites and apps.',
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
            'en': 'We\'re satisfied with our project management only when you feel well-informed and secure.',
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
            'en': 'Testing and QA Program by Winify accompanies your project from the early stages untill final delivery to you.',
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
            'en': 'Together with you we develop a software that exactly matches your needs. And all its parts are built individually from database till logo design.',
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
            'en': 'We maintain and secure the functionality of your service over time. 24/7 and 365 days a year.',
            'de': 'Wir kümmern uns darum, dass Ihr Service immer einwandfrei läuft. 24/7 an 365 Tagen im Jahr.'
          }
        }
      ]
    },
    'flow': {
      'title': {
        'en': 'From initial <span>Idea</span>, through general <span>Concept</span><br/>to the <span>Launch</span>',
        'de': 'Von der ersten <span>Idee</span>, über das <span>Konzept</span><br/>bis zum <span>Launch</span>'
      },
      'list': [
        {
          'ico': 'flow-plan',
          'head': {
            'en': 'Plan',
            'de': 'Plan'
          },
          'desc': {
            'en': 'Set goals<br/>Arrange milestones<br/>Plan launch date',
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
            'en': 'UI Design<br/>User Experience<br/>Usability<br/>Build mock-up & prototype',
            'de': 'UI Design<br/>User Experience<br/>Usability<br/>Entwurf & Prototyp erstellen'
          }
        },
        {
          'ico': 'flow-dev',
          'head': {
            'en': 'Develop',
            'de': 'Entwickeln'
          },
          'desc': {
            'en': 'Web & App Development<br/>Content Management<br/>Databases<br/>E-Commerce solutions<br/>Responsive Web Design<br/>Quality Assurance',
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
            'en': 'Switch to live<br/>SEO/SEM<br/>Administration<br/>QA and maintenance',
            'de': 'Live schalten<br/>SEO/SEM<br/>Administration<br/>Wartung und QA'
          }
        }
      ]
    },
    'about': {
      'title': {
        'en': 'Your csutomers are glad to use your website.<br/>Your sales are high.<br/><span>Winify</span> has done a good job.',
        'de': 'Ihre Kunden nutzen Ihre Webseite gerne.<br/>Ihre Umsätze sind gut.<br/><span>Winify</span> hat einen guten Job gemacht.'
      },
      'content': {
        'en': 'We make good products by throwing all our experience, know-how and creativity into the mix. We want to reach the best results for our clients: state-of-the-art websites and software products, user friendly design & usability, shops that convert into sales and many more. Too many buzzwords? Please, scroll down. There you will find our contact form. Just let us speak and we’ll get straight to the point.',
        'de': 'Gute Produkte zu machen heißt für uns, unsere ganze Erfahrung, all unser Know How und Kreativität in die Waagschale zu werfen. Wir wollen das beste für unsere Kunden erreichen: State-of-the-Art Webseiten und Software Produkte, kundenfreundliches Design & Usability, konvertierende Shops und vieles mehr. Zu viele Buzzwords? Scrollen Sie bitte etwas herunter. Dort ist unser Kontaktfeld. Lassen Sie uns sprechen, wir werden gerne konkret.'
      }
    },
    'quotes': [
      {
        'text': {
          'en': 'Collaboration with Winify has always been a pleasure. We’ve developed a precious personal and professional connection over time that makes us feel like we’re in good hands. Winify is always ready to react to all the comments and critique. We have equal roles in our discussions and this allows us to secure the best results.',
          'de': 'Die Zusammenarbeit mit Winify hat immer Freude bereitet. Über die Zeit hat sich ein persönlich-professionelles Verhältnis entwickelt, in dem wir uns gut aufgehoben fühlen. Winify ist immer bereit auf Anmerkungen und Kritik einzugehen. Wir diskutieren auf Augenhöhe und holen so sicher das Beste heraus.'
        },
        'author': {
          'name': 'Cashless Nation AG',
          'desc': ''
        }
      },
      {
        'text': {
          'en': 'We’ve started to work with Winify on a small contract and were very satisfied with the job. Over time we’ve been developing our collaboration way further and now we can tell that Winify is our most important software and product partner.',
          'de': 'Wir haben mit einem kleineren Auftrag mit der Winify AG begonnen und waren sehr zufrieden. Nach und nach haben wir die Zusammenarbeit ausgebaut und mittlerweile ist Winify unser wichtigster Software und Produkt Partner.'
        },
        'author': {
          'name': 'MUUME AG',
          'desc': ''
        }
      },
      {
        'text': {
          'en': 'We’ve been working with Winify for over three years on different projects. Their competence, especially in “Payment” and all related fields is noteworthy.',
          'de': 'Wir arbeiten mit Winify nun schon seit drei Jahren in verschiedenen Projekten zusammen. Die Kompetenz vor allem im Bereich "Payment" und was damit zu tun hat, ist beachtenswert.'
        },
        'author': {
          'name': 'Dr. Felix Hötzinger, Vorstand, Demekon Entertainment AG',
          'desc': ''
        }
      },
      {
        'text': {
          'en': 'For many portfolio enterprises is Winify partially for shorter phases, partially for those over 12 months always in use. For us Winify is a very valuable and especially important partner.',
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
        'en': 'Our <span>Projects</span>',
        'de': 'Unsere <span>Projekte</span>'
      },
      'content': {
        'en': 'We are proud to have accomplished interesting projects with over 100 known and innovative enterprises. Here you will find several examples:',
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
        'en': 'Germany',
        'de': 'Polen'
      },
      {
        'en': 'Germany',
        'de': 'Moldau'
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
          'en': 'Disclaimer',
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
          'en': 'We',
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
          'en': 'Contact us',
          'de': 'Kontakt'
        }
      }
    ],
    'agb': {
      'title': {
        'en': 'Disclaimer',
        'de': 'Haftungsausschluss'
      },
      'content': {
        'en': 'Winify AG and its subsidiaries do not guarantee that all the information presented on this website is full, correct and actual in any case. This also works for all the links that refer from this website directly or indirectly. Winify AG and its subsidiaries aren’t responsible for the content of the websites that can be reached through by clicking on the links. Winify AG and its subsidiaries reserve the right to change or to complete the already present information without prior notice. <br/>In making this information available, Winify AG and its subsidiaries do not establish the basis for any offer about information, consulting or similar contractual relationships. All liability for the use of the content of the website or for the accuracy of the information or for the access ability of this website is excluded.<br/>Winify AG and its subsidiaries are not liable for specific, indirect and direct damage or for any damage which can arise as a result of a lack of accessibility, loss of data or lost profits that arouse as a result of the use of documentation and information presented on this website.',
        'de': 'Die Winify AG und deren Tochterunternehmen übernehmen keine Garantie dafür, dass die auf dieser Website bereitgestellten Informationen vollständig, richtig und in jedem Falle aktuell sind. Dies gilt auch für alle Verbindungen (“Links”), die von dieser Website direkt oder indirekt verweisen. Die Winify AG und deren Tochterunternehmen sind für den Inhalt einer Seite, die mit einem Link erreicht wird, nicht verantwortlich. Die Winify AG und deren Tochterunternehmen behalten sich das Recht vor, ohne vorherige Ankündigung Änderungen oder Ergänzungen der bereitgestellten Informationen vorzunehmen.<br/>Die Winify AG und deren Tochterunternehmen begründen durch die Bereitstellung dieser Informationen kein Vertragsangebot über Auskünfte, Beratung oder ähnliche Vertragsbeziehungen. Jegliche Haftung für die Nutzung der Inhalte der Website oder die Richtigkeit der Inhalte oder die Erreichbarkeit der Website wird ausgeschlossen.<br/>Die Winify AG und deren Tochterunternehmen haften daher nicht für konkrete, mittelbare und unmittelbare Schäden oder Schäden, die durch fehlende Nutzungsmöglichkeiten, Datenverluste oder entgangene Gewinne entstehen können, die im Zusammenhang mit der Nutzung von Dokumenten oder Informationen entstehen, die auf dieser Website zugänglich sind.'
      }
    },
    'datenschutz': {
      'title': {
        'en': 'Privacy policy',
        'de': 'Datenschutzbestimmungen'
      },
      'title2': {
        'en': 'Your data by us',
        'de': 'Ihre Daten bei uns'
      },
      'content': {
        'en': 'Winify AG and its subsidiaries undertake to protect your personal data. This data privacy statement describes in detail which information we collect from you and what happens to that data.<br/>In the following we shall thus declare how the collection and storage of data takes place and how we protect personal data that you give through this website:',
        'de': 'Die Winify AG und deren Tochterunternehmen verpflichten sich, Ihre persönlichen Daten zu schützen. Diese Datenschutzerklärung beschreibt ausführlich, welche Informationen wir über Sie erheben und was mit diesen Daten geschieht.<br/>Daher werden wir im Folgenden erklären, wie die Datenerhebung und Speicherung funktioniert und wie wir den Schutz Ihrer persönlichen Daten gewährleisten, wenn Sie über diese Website Daten eingeben:'
      },
      'content1': {
        'en': '<b>1. How is the data collected?</b><br/>The data is first collected with the use of online forms. For this end the necessary data is sent to Winify by e-mail.  Second, the log information is also saved.',
        'de': '<b>1. Wie werden die Daten erhoben?</b><br/>Die Daten werden zum einen über Online-Formulare erhoben, dabei werden die erfassten Daten per E-Mail an eine Winify-Adresse versendet. Zum anderen werden Log-Informationen abgespeichert.'
      },
      'content2': {
        'en': '<b>2. Which data is collected?</b><br/>The data is collected through contact form or newsletter registration, thus we collect only the data that you provide by yourself by filling the form. The input of these data takes place voluntarily. At the same time we point it out that you can’t use all the functions unless you provide all the data. In addition to this URL as well as IP address is also collected by Winify websites.',
        'de': '<b>2. Welche Daten werden erhoben?</b><br/>Es werden Daten erhoben über das Kontaktformular oder die Newsletter Registrierung – dabei werden nur die Daten erhoben, die Sie selbst über die Eingabemasken eingeben. Jede Dateneingabe ist freiwillig. Wir weisen Sie allerdings darauf hin, dass Sie nicht alle Funktionen vollständig nutzen können, wenn Sie nicht alle Daten eingeben. Zudem werden die URL sowie die IP Adresse beim Abrufen von Winify-Webseiten erhoben.'
      },
      'content3': {
        'en': '<b>3. Who uses the data and how?</b><br/>The data is used exclusively for the processing of the inquiry and is removed after this procedure. We process and use your data only within Winify AG and its subsidiaries in order to be able to offer you the desired information and services. Log information is used to further improve Winify AG and its subsidiaries’ services and thus contains no personally identifiable information.',
        'de': '<b>3. Wie und von wem werden die Daten genutzt?</b><br/>Die Daten werden ausschließlich zur Bearbeitung der Anfragen genutzt und nach Abschluss des Vorgangs gelöscht. Wir verarbeiten und nutzen Ihre Daten nur innerhalb der Winify AG und deren Tochterunternehmen, um Ihnen die gewünschten Informationen und Dienstleistungen anbieten zu können. Die Log-Informationen werden verwendet, um den Service der Winify AG und deren Tochterunternehmen weiter zu verbessern und beinhalten keine persönliche Identifizierungsinformation.'
      },
      'content4': {
        'en': '<b>4. How do we count the number of visits to our website?</b><br/>This website uses Google Analytics, a web analysis service of the Google Inc. („Google“). Google Analytics uses the so-called „cookies“, text files that are saved on a computer and that allow for analysis of the use of website. The information generated by the cookie concerning your use of this website is usually transferred to one of Google\'s servers in the USA, where it is stored.<br/>The IP address transferred from your browser within Google Analytics will not be associated with other data held by Google. You can prevent the use of cookies by a special setting in your browser, still we point it out that by doing so you won’t be able to use certain functionalities of this website. Moreover, you can prevent the collection of your data (incl. IP address) by the use of cookies and its further processing by Google by downloading and installing the following plugin for your browser: <a href="http://tools.google.com/dlpage/gaoptout?hl=de">http://tools.google.com/dlpage/gaoptout?hl=de</a>.',
        'de': '<b>4. Wie messen wir die Besuche auf der Webseite?</b><br/>Diese Website benutzt Google Analytics, einen Webanalysedienst der Google Inc. („Google“). Google Analytics verwendet sog. „Cookies“, Textdateien, die auf Ihrem Computer gespeichert werden und die eine Analyse der Benutzung der Website durch Sie ermöglichen. Die durch den Cookie erzeugten Informationen über Ihre Benutzung dieser Website werden in der Regel an einen Server von Google in den USA übertragen und dort gespeichert.<br/>Die im Rahmen von Google Analytics von Ihrem Browser übermittelte IP-Adresse wird nicht mit anderen Daten von Google zusammengeführt. Sie können die Speicherung der Cookies durch eine entsprechende Einstellung Ihrer Browser-Software verhindern; wir weisen Sie jedoch darauf hin, dass Sie in diesem Fall gegebenenfalls nicht sämtliche Funktionen dieser Website vollumfänglich werden nutzen können. Sie können darüber hinaus die Erfassung der durch das Cookie erzeugten und auf Ihre Nutzung der Website bezogenen Daten (inkl. Ihrer IP-Adresse) an Google sowie die Verarbeitung dieser Daten durch Google verhindern, indem sie das unter dem folgenden Link verfügbare Browser-Plugin herunterladen und installieren: <a href="http://tools.google.com/dlpage/gaoptout?hl=de">http://tools.google.com/dlpage/gaoptout?hl=de</a>.'
      },
      'content5': {
        'en': '<b>5. Who else has access to the data?</b><br/>No one. Your data is not transmitted to third parties.',
        'de': '<b>5. Wer hat sonst noch Zugriff auf die Daten?</b><br/>Niemand. Eine Übermittlung Ihrer Daten an Dritte findet nicht statt.'
      },
      'content6': {
        'en': '<b>6. How can the user access the data, change or remove it?</b><br/>The requests to remove or to change the data can be e-mailed to Winify AG at customer@winify.com. When you cancel your newsletter all corresponding data is deleted.',
        'de': '<b>6. Wie kann der Nutzer auf die Daten zugreifen, sie ändern oder löschen?</b><br/>Anfragen zur Löschung der Daten oder Änderungsanfragen sind ebenso per E-Mail an die Winify AG zu richten: customer@winify.com. Mit der Abmeldung des Newsletters werden auch die entsprechenden Daten gelöscht.'
      },
      'content7': {
        'en': '<b>7. How is ensured the data security?</b><br/>The data will be saved on our own servers that comply with the highest security standards. If you send us your personal data via internet, we take measures to secure the safety of your personal data. Your data is carefully protected against loss, destruction, manipulation, and illegal access.',
        'de': '<b>7. Wie wird die Datensicherheit gewährleistet?</b><br/>Die Daten werden auf unseren eigenen Systemen gespeichert, deren sehr hohe Sicherheit auf dem Stand der Technik ist. Wenn Sie uns personenbezogene Daten via Internet übermittelt haben, greifen unsere Vorkehrungen, um die Sicherheit Ihrer personenbezogenen Daten zu gewährleisten. Ihre Daten werden gewissenhaft vor Verlust, Zerstörung, Manipulation und unberechtigtem Zugriff geschützt.'
      }
    }
  });