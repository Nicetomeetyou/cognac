angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, flavorsFactory, recipesFactory) {
    var flavors = flavorsFactory.getJsonFlavors();
    
    var topRecipes = [{ "id" : "1" }, { "id" : "2" }, { "id" : "6" }, { "id" : "7" }];
    
    recipesFactory.getJsonRecipes().then(function(recipes){
        $scope.associatedRecipes = recipesFactory.getRecipesAssociated(topRecipes, recipes);
    });


})

.controller('flavorController', function($scope, flavorsFactory, cognacFactory, $state) {
    var _this = $scope;

    _this.show_1 = true;
    _this.show_2 = true;
    _this.show_3 = true;
    _this.show_4 = true;
    _this.show_5 = true;

    _this.filterList = function(idFamily) {
        _this.show_1 = false;
        _this.show_2 = false;
        _this.show_3 = false;
        _this.show_4 = false;
        _this.show_5 = false;

        _this["show_"+idFamily] = true;

        if(idFamily == 0) {
            _this.show_1 = true;
            _this.show_2 = true;
            _this.show_3 = true;
            _this.show_4 = true;
            _this.show_5 = true;
        }

        var myElement= document.getElementById('filter');
        angular.element(myElement).triggerHandler('click');
    }

    flavorsFactory.getJsonFlavors().then(function(flavors){
        _this.tabSaveurs = flavors;
    });

    cognacFactory.getJsonCognac().then(function(cognac){
        _this.tabCognac = cognac;
    });

    $scope.goHome = function() {
        $state.go('app.accueil');
    };

    if(window.FirebasePlugin) window.FirebasePlugin.logEvent("Trouver l'accord");
    if(typeof analytics !== "undefined") { analytics.trackView("Trouver l'accord"); }
})

.controller('recipesController', function($scope, recipesFactory, $state) {
    var _this = $scope;

    _this.tabFamilyRecipes = eval("tabFamilyRecipes_"+langApp);

    recipesFactory.getRecipesFamily(1).then(function(tabRecipes){
        _this.tabRecipes = tabRecipes;
    });

    $scope.goHome = function() {
        $state.go('app.accueil');
    };

    if(window.FirebasePlugin) window.FirebasePlugin.logEvent("Recette");
    if(typeof analytics !== "undefined") { analytics.trackView("Recette"); }
})

.controller('CarouselController', function($scope) {
    $scope.swiper = {};

    $scope.onReadySwiper = function (swiper) {

        swiper.on('slideChangeStart', function () {
            //console.log('slide start');
        });

        swiper.on('onSlideChangeEnd', function () {
            //console.log('slide end');
        });     
    };
})

.controller('feedController', function($scope, $http, $ionicHistory) {
    $scope.endLoadingFeed = false;
    $scope.endLoadingFeedError = false;

    $http({method: "GET", url: "http://php7.hbgt2.com/cognac/feed.php"})
    .success(function(result) {
        $scope.feed = result;
        $scope.endLoadingFeed = true;
    })
    .error(function(error) {
       $scope.endLoadingFeed = true;
       $scope.endLoadingFeedError = true;
   })

    $scope.goBack = function() {
        $ionicHistory.goBack();
    };

    $scope.linkify = function(mess) {
        result =  mess.replace(/#(\S*)/g,'<span class="highlight">#$1</span>');
        result =  result.replace(/@(\S*)/g,'<span class="highlight">@$1</span>');
        replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
        result =  result.replace(replacePattern1,'<span class="highlight">$1</span>');  
        return result;
    }

    if(window.FirebasePlugin) window.FirebasePlugin.logEvent("Social Wall");
    if(typeof analytics !== "undefined") { analytics.trackView("Social Wall"); }
})

.controller('quizzController', function($scope, $ionicHistory, quizzFactory, $rootScope, $state) {
    quizzFactory.getJsonQuizz().then(function(quizz){
        $scope.tabQuizz = quizz;
    });

    $scope.setResponse = function(id, response) {
        $rootScope.response = response;
        $rootScope.responseText = $scope.tabQuizz[$rootScope.numQuestion].validation;

        $state.go('app.quizz-response'); 
    }

    $scope.nextQuestion = function(id, response) {
        $rootScope.numQuestionDisplay++;
        $rootScope.numQuestion++;
        $rootScope.response = "-";

        $state.go('app.quizz'); 
    }

    $scope.goHome = function() {
        $rootScope.numQuestionDisplay = 1;
        $rootScope.numQuestion = 0;

        $state.go('app.accueil'); 
    };

    if(window.FirebasePlugin) window.FirebasePlugin.logEvent("Quizz");
    if(typeof analytics !== "undefined") { analytics.trackView("Quizz"); }
});


