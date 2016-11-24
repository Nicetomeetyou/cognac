var tabFamilyFlavors_fr = ["", "Fromages", "Fruits et Légumes", "Pâtisseries et Chocolats", "Poissons et coquillages", "Viandes et charcuteries"];
var tabFamilyFlavors_en = ["", "Cheeses", "Fruits & vegetables", "Desserts", "Fish & seashell", "Meat"];

var tabFamilyRecipes_fr = ["", "Entrées", "Plats", "Desserts"];
var tabFamilyRecipes_en = ["", "Starters", "Dishes", "Desserts"];

var tabResultCognac_fr = ["Vous êtes jeunes dans le cognac. Entrainez-vous à refaire le quizz avant de passer à la pratique !", "Pas mal. Réessayez pour viser le sans-faute. Vous êtes prêts à découvrir nos accords cognac/saveurs et passer à la pratique !", "Le cognac n’a plus de secret pour vous. Avouez le, le cognac est déjà présent sur votre table !"];
var tabResultCognac_en = ["You are a newbie with cognac. Keep practicing with this test before doing anything concrete!", "That’s not bad at all! Try again, you might get it right next time. You are ready to discover our pairings of cognac and flavours and to move on to more practical things!", "Cognac is no longer a mystery to you. Alright, admit it: you’ve got the bottle already sitting on your table, right?"];

var app = angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ksSwiper', 'pascalprecht.translate', 'ngAnimate', 'ion-sticky'])


.run(function($ionicPlatform, $rootScope) {
	$rootScope.numQuestionDisplay = 1;
	$rootScope.numQuestion = 0;

	$ionicPlatform.ready(function() {
		if (window.cordova && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
			cordova.plugins.Keyboard.disableScroll(true);
		}

		ionic.Platform.fullScreen();

		if(typeof analytics !== "undefined") {
			analytics.startTrackerWithId("UA-86976605-1");
		} else {
			console.log("Google Analytics Unavailable");
		}

		if (window.StatusBar) {
			return StatusBar.hide();
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
				controller: function($scope, $ionicSideMenuDelegate) {
					if(typeof analytics !== "undefined") { analytics.trackView("Accueil"); }

					/* Animation home page */
					setTimeout(function(){ 
						var welcomeJs= document.getElementById('welcome-js');
						angular.element(welcomeJs).addClass('anime');
						var cookingRecipesJs= document.getElementById('cooking-recipes-js');
						angular.element(cookingRecipesJs).addClass('anime');
					}, 1000);

					$ionicSideMenuDelegate.canDragContent(false);
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

	.state('app.quizz-end', {
		url: '/quizz-end',
		views: {
			'menuContent': {
				templateUrl: 'templates/quizz-end.html',
				controller: 'quizzEndController'
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
				controller: function($scope, $stateParams, flavorsFactory, cognacFactory, $ionicHistory, recipesFactory, $sce) {
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

					if(typeof analytics !== "undefined") { analytics.trackView("Trouver l'accord - "+$scope.tabContent.title); }

					$scope.renderHtml = function(html_code) { return $sce.trustAsHtml(html_code); }
					
					/* Read more */
					$scope.toggleItem= function(item) {
						if ($scope.isItemShown(item)) {
							$scope.shownItem = null;
						} else {
							$scope.shownItem = item;
						}
					};
					$scope.isItemShown = function(item) {
						return $scope.shownItem === item;
					};
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
			controller: function($scope, $stateParams, flavorsFactory, cognacFactory, recipesFactory, $ionicHistory, $sce) {
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

				$scope.renderHtml = function(html_code) { return $sce.trustAsHtml(html_code); }

				/* Read more */
				$scope.toggleItem= function(item) {
					if ($scope.isItemShown(item)) {
						$scope.shownItem = null;
					} else {
						$scope.shownItem = item;
					}
				};
				$scope.isItemShown = function(item) {
					return $scope.shownItem === item;
				};

				if(typeof analytics !== "undefined") { analytics.trackView("Trouver l'accord - "+$scope.tabContent.title); }

				$scope.renderHtml = function(html_code) { return $sce.trustAsHtml(html_code); }
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
			/*controller: function($scope, recipesFactory, $state) {
				
			}*/
		}
	}
})

.state('app.cuisiner-single', {
	url: '/cuisiner/:idAccord',
	views: {
		'menuContent': {
			templateUrl: 'templates/cuisiner-single.html',
			controller: function($scope, $stateParams, recipesFactory, $ionicHistory, $sce) {
				$scope.tabRecipe = recipesFactory.getJsonRecipesById($stateParams.idAccord);
				$scope.tabFamilyRecipes = eval("tabFamilyRecipes_"+langApp);

				$scope.goBack = function() {
					$ionicHistory.goBack();
				}

				if(typeof analytics !== "undefined") { analytics.trackView("Recette - "+$scope.tabRecipe.title); }

				$scope.renderHtml = function(html_code) { return $sce.trustAsHtml(html_code); }				}
			}
		},
		resolve:{
			idAccord: ['$stateParams', function($stateParams){
				return $stateParams.idAccord;
			}]
		}
	});



	// if none of the above states are matched, use this as the fallback
	$urlRouterProvider.otherwise('/app/accueil');

	for(lang in translations){
		$translateProvider.translations(lang, translations[lang]);
	}

	$translateProvider.preferredLanguage('en');
})

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
				var content = element.next('.slideable_content');
				var next = element.next(".slideable");

				if(!next.hasClass('open')) {
					var y = content[0].scrollHeight;
					
					if(attrs.id == 'filter') { 
						var myElement = document.getElementById('filter');
						myElement.innerHTML = "Fermer";
					}

					next.css("height" , y + 'px');
					next.addClass('open')
				} else {

					if(attrs.id == 'filter') { 
						var myElement = document.getElementById('filter');
						myElement.innerHTML = "Filtrez les saveurs";
					}

					next.css("height" , '60px');
					next.removeClass('open')
				}
				attrs.expanded = !attrs.expanded;
			});
		}
	}
})
.directive('toggleClass', function() {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			element.bind('click', function() {
				element.toggleClass(attrs.toggleClass);
			});
		}
	};
})