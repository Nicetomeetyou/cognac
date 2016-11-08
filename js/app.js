var tabFamilyFlavors_fr = ["", "Fromages", "Fruits et Légumes", "Pâtisseries et Chocolats", "Poissons et coquillages", "Viandes et charcuteries"];
var tabFamilyRecipes_fr = ["", "Entrées", "Plats", "Desserts"];

// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var app = angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ksSwiper', 'pascalprecht.translate'])
.directive('slideable', function () {
    return {
        restrict:'C',
        compile: function (element, attr) {
            // wrap tag
            var contents = element.html();
            element.html('<div class="slideable_content" style="margin:0 !important; padding:0 !important" >' + contents + '</div>');

            return function postLink(scope, element, attrs) {
                // default properties
                attrs.duration = (!attrs.duration) ? '0.5s' : attrs.duration;
                attrs.easing = (!attrs.easing) ? 'ease-in-out' : attrs.easing;
                element.css({
                    'overflow': 'hidden',
                    'height': '0px',
                    'transitionProperty': 'height',
                    'transitionDuration': attrs.duration,
                    'transitionTimingFunction': attrs.easing
                });
            };
        }
    };
})

.directive('slideToggle', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var target = document.querySelector(attrs.slideToggle);
            attrs.expanded = false;
            element.bind('click', function() {
                var content = target.querySelector('.slideable_content');
                if(!attrs.expanded) {
                    var y = content.clientHeight;
                    content.style.border = 0;
                    target.style.height = y + 'px';
                } else {
                    target.style.height = '0px';
                }
                attrs.expanded = !attrs.expanded;
            });
        }
    }
})

.run(function($ionicPlatform, $rootScope) {
    $rootScope.numQuestionDisplay = 1;
    $rootScope.numQuestion = 0;

    $ionicPlatform.ready(function() {
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);
        }

        if (window.StatusBar) {
            StatusBar.styleDefault();
        }

        if (window.FirebasePlugin) {
            FirebasePlugin.getInstanceId(function(token) {
                console.log("Token", token);
            }, function(error) {
                console.error(error);
            });
        }

        if(typeof analytics !== "undefined") {
            analytics.startTrackerWithId("UA-86976605-1");
        } else {
            console.log("Google Analytics Unavailable");
        }
    });
})

.filter('unsafe', function($sce) {
    return function(val) {
        return $sce.trustAsHtml(val);
    };
})

.config(function($stateProvider, $urlRouterProvider, $translateProvider) {
    $stateProvider

    .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
    })

    .state('app.accueil', {
        url: '/accueil',
        views: {
            'menuContent': {
                templateUrl: 'templates/accueil.html',
                controller: function() {
                    if(window.FirebasePlugin) window.FirebasePlugin.logEvent("Accueil");
                    if(typeof analytics !== "undefined") { analytics.trackView("Accueil"); }
                }
            }
        }
    })

    .state('app.quizz', {
        url: '/quizz',
        views: {
            'menuContent': {
                templateUrl: 'templates/quizz.html',
                controller: 'quizzController'
            }
        }
    })

    .state('app.quizz-response', {
        url: '/quizz-response',
        views: {
            'menuContent': {
                templateUrl: 'templates/quizz-response.html',
                controller: 'quizzController'
            }
        }
    })

    .state('app.social', {
        url: '/social',
        views: {
            'menuContent': {
                templateUrl: 'templates/social.html',
                controller: 'feedController'
            }
        }
    })

    .state('app.trouver-accord', {
        url: '/trouver-accord',
        views: {
            'menuContent': {
                templateUrl: 'templates/trouver-accord.html',
                controller: 'flavorController'
            }
        }
    })

    .state('app.trouver-saveurs-single', {
        url: '/trouver-saveurs/:idAccord',
        views: {
            'menuContent': {
                templateUrl: 'templates/trouver-accord-saveurs.html',
                controller: function($scope, $stateParams, flavorsFactory, cognacFactory, $ionicHistory, recipesFactory) {
                    $scope.tabContent = flavorsFactory.getJsonFlavorsById($stateParams.idAccord);

                    $scope.associatedRecipes = [];
                    recipesFactory.getJsonRecipes().then(function(recipes){
                        $scope.associatedRecipes = recipesFactory.getRecipesAssociated($scope.tabContent.recipes, recipes);
                    });

                    $scope.tabFamilyFlavors = eval("tabFamilyFlavors_"+langApp);

                    $scope.notesPerfect = $scope.tabContent.perfect;
                    $scope.notesPossible = $scope.tabContent.possible;
                    $scope.notesAvoid = $scope.tabContent.avoid;

                    cognacFactory.getJsonCognac().then(function(cognac){
                        $scope.tabCognac = cognac;
                    });

                    $scope.goBack = function() {
                        $ionicHistory.goBack();
                    };

                    if(window.FirebasePlugin) window.FirebasePlugin.logEvent("Trouver l'accord - "+$scope.tabContent.title);
                    if(typeof analytics !== "undefined") { analytics.trackView("Trouver l'accord - "+$scope.tabContent.title); }
                }
            }
        },
        resolve:{
            idAccord: ['$stateParams', function($stateParams){
                return $stateParams.idAccord;
            }]
        }
    })

.state('app.trouver-cognac-single', {
    url: '/trouver-cognac/:idAccordCognac',
    views: {
        'menuContent': {
            templateUrl: 'templates/trouver-accord-cognac.html',
            controller: function($scope, $stateParams, flavorsFactory, cognacFactory, recipesFactory, $ionicHistory) {
                $scope.tabContent = cognacFactory.getJsonCognacById($stateParams.idAccordCognac);

                var tmpTab = flavorsFactory.getJsonFlavors().then(function(flavors){
                    var tabContentFlavor = cognacFactory.getFlavorsByCognac(flavors, $stateParams.idAccordCognac);
                    $scope.tabPerfect = tabContentFlavor[0];
                    $scope.tabPossible = tabContentFlavor[1];
                    $scope.tabAvoid = tabContentFlavor[2];
                });

                recipesFactory.getJsonRecipes().then(function(recipes){
                    $scope.associatedRecipes = recipesFactory.getRecipesAssociated($scope.tabContent.recipes, recipes);
                });

                $scope.goBack = function() {
                    $ionicHistory.goBack();
                };

                $scope.secondIndex = function(arr){
                    return arr[1];
                }

                if(window.FirebasePlugin) window.FirebasePlugin.logEvent("Trouver l'accord - "+$scope.tabContent.title);
                if(typeof analytics !== "undefined") { analytics.trackView("Trouver l'accord - "+$scope.tabContent.title); }
            }
        }
    },
    resolve:{
        idAccordCognac: ['$stateParams', function($stateParams){
            return $stateParams.idAccordCognac;
        }]
    },
})

.state('app.cuisiner', {
    url: '/cuisiner',
    views: {
        'menuContent': {
            templateUrl: 'templates/cuisiner.html',
            controller: 'recipesController'
        }
    }
})

.state('app.cuisiner-single', {
    url: '/cuisiner/:idAccord',
    views: {
      'menuContent': {
        templateUrl: 'templates/cuisiner-single.html',
        controller: function($scope, $stateParams, recipesFactory, $ionicHistory) {
            $scope.tabRecipe = recipesFactory.getJsonRecipesById($stateParams.idAccord);

            $scope.goBack = function() {
                $ionicHistory.goBack();
            }

            if(window.FirebasePlugin) window.FirebasePlugin.logEvent("Recette - "+$scope.tabRecipe.title);
            if(typeof analytics !== "undefined") { analytics.trackView("Recette - "+$scope.tabRecipe.title); }
        }
    }
},
resolve:{
    idAccord: ['$stateParams', function($stateParams){
        return $stateParams.idAccord;
    }]
}
})

.state('app.mentions-legales', {
    url: '/mentions-legales',
    views: {
        'menuContent': {
            templateUrl: 'templates/mentions-legales.html'
        }
    }
})

.state('app.credits', {
    url: '/credits',
    views: {
        'menuContent': {
            templateUrl: 'templates/credits.html'
        }
    }
});



    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/accueil');

    for(lang in translations){
        $translateProvider.translations(lang, translations[lang]);
    }

    $translateProvider.preferredLanguage('fr');
})



function openCity(evt, cityName) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the link that opened the tab
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";
}

app.value("", 0);