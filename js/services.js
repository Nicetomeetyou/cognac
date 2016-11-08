var langApp = "fr";

angular.module('starter.services', [])

.factory('flavorsFactory', function($http, $q) {
    var flavors = [];

    var req = {
        method: 'GET',
        url: 'json/flavors-'+langApp+'.json',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        }
    };
    var promise = $http(req).then(function successCallback(response) {
        flavors = response.data;
        return flavors;
    }, function errorCallback(err) {
        return err;
    })

    return {
        getJsonFlavors: function(){
            return $q.when(promise).then(function(){
                return flavors;
            });
        },
        getJsonFlavorsById: function(id){
            for (var i = 0; i < flavors.length; i++) {
                if (flavors[i].id === parseInt(id)) {
                    return flavors[i];
                }
            }
            return null;
        }
    }
})

.factory('cognacFactory', function($http, $q) {
    var cognac = [];

    var req = {
        method: 'GET',
        url: 'json/cognac-'+langApp+'.json',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        }
    };
    var promise = $http(req).then(function successCallback(response) {
        cognac = response.data;
        return cognac;
    }, function errorCallback(err) {
        return err;
    })

    return {
        getJsonCognac: function(){
            return $q.when(promise).then(function(){
                return cognac;
            });
        },
        getJsonCognacById: function(id){
            for (var i = 0; i < cognac.length; i++) {
                if (cognac[i].id === parseInt(id)) {
                    return cognac[i];
                }
            }
            return null;
        },
        getFlavorsByCognac: function(tabFlavors, idCognac) {
            var maxLength = tabFlavors.length;

            var tabPerfectTmp = [];
            var tabPossibleTmp = [];
            var tabAvoidTmp = [];
            var tabContent = [];

            for (var i = 0; i < maxLength; i++) {

                var maxLengthPerfect = tabFlavors[i].perfect.length;
                var maxLengthPossible = tabFlavors[i].possible.length;
                var maxLengthAvoid = tabFlavors[i].avoid.length;

                for(var j = 0; j < maxLengthPerfect; j++) {

                    if(parseInt(idCognac) == tabFlavors[i].perfect[j].accord[0].name) {

                        var tmpTab = [];
                        tmpTab['family'] = tabFlavors[i].family;
                        tmpTab['name'] = tabFlavors[i].title;
                        tmpTab['note'] = tabFlavors[i].perfect[j].accord[1].note;
                        tabPerfectTmp.push(tmpTab);
                    }
                }
                tabContent.push(tabPerfectTmp);

                for(var j = 0; j < maxLengthPossible; j++) {

                    if(parseInt(idCognac) == tabFlavors[i].possible[j].accord[0].name) {

                        var tmpTab = [];
                        tmpTab['family'] = tabFlavors[i].family;
                        tmpTab['name'] = tabFlavors[i].title;
                        tmpTab['note'] = tabFlavors[i].possible[j].accord[1].note;
                        tabPossibleTmp.push(tmpTab);
                    }
                }
                tabContent.push(tabPossibleTmp);

                for(var j = 0; j < maxLengthAvoid; j++) {

                    if(parseInt(idCognac) == tabFlavors[i].avoid[j].accord[0].name) {

                        var tmpTab = [];
                        tmpTab['family'] = tabFlavors[i].family;
                        tmpTab['name'] = tabFlavors[i].title;
                        tmpTab['note'] = tabFlavors[i].avoid[j].accord[1].note;
                        tabAvoidTmp.push(tmpTab);
                    }
                }
                tabContent.push(tabAvoidTmp);
            }

            return tabContent;
        }
    }
})

.factory('recipesFactory', function($http, $q) {
    var recipes = [];
    var obj = [];

    var req = {
        method: 'GET',
        url: 'json/recipes-'+langApp+'.json',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        }
    };
    var promise = $http(req).then(function successCallback(response) {
        recipes = response.data;
        return recipes;
    }, function errorCallback(err) {
        return err;
    })

    
    obj.getJsonRecipes = function(){
            return $q.when(promise).then(function(){
                return recipes;
            });
        }
    obj.getJsonRecipesById = function(id){
            for (var i = 0; i < recipes.length; i++) {
                console.log(recipes[i].id +" == "+ parseInt(id))
                if (recipes[i].id == parseInt(id)) {
                    return recipes[i];
                }
            }
            return null;
        }
    obj.getRecipesAssociated = function(tabRecipes, recipes) {
            var tabRecipesAssociated = [];
            var tabLength = tabRecipes.length;

            for (var j = 0; j < tabLength; j++) {
                for (var k = 0; k < recipes.length; k++) {
                    if (recipes[k].id == tabRecipes[j].id) {
                        tabRecipesAssociated.push(recipes[k]);
                    }
                }
            }

            return tabRecipesAssociated;
        }
    obj.getRecipesFamily = function(){
            return $q.when(promise).then(function(){
                var tabRecipes = [];

                var tabRecipes_1 = [];
                var tabRecipes_2 = [];
                var tabRecipes_3 = [];
                var tabLength = recipes.length;

                for (var i = 0; i < tabLength; i++) {
                    if (recipes[i].family == "1") {
                        tabRecipes_1.push(recipes[i]);
                    }
                }
                tabRecipes[0] = tabRecipes_1;

                for (var i = 0; i < tabLength; i++) {
                    if (recipes[i].family == "2") {
                        tabRecipes_2.push(recipes[i]);
                    }
                }
                tabRecipes[1] = tabRecipes_2;

                for (var i = 0; i < tabLength; i++) {
                    if (recipes[i].family == "3") {
                        tabRecipes_3.push(recipes[i]);
                    }
                }
                tabRecipes[2] = tabRecipes_3;
                
                return tabRecipes;
            });
        }
    return obj;
})

.factory('quizzFactory', function($http, $q) {
    var quizz = [];

    var req = {
        method: 'GET',
        url: 'json/quizz-'+langApp+'.json',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        }
    };
    var promise = $http(req).then(function successCallback(response) {
        quizz = response.data;
        return quizz;
    }, function errorCallback(err) {
        return err;
    })

    return {
        getJsonQuizz: function(){
            return $q.when(promise).then(function(){
                return quizz;
            });
        },
        getJsonQuizzById: function(id){
            for (var i = 0; i < quizz.length; i++) {
                if (quizz[i].id === parseInt(id)) {
                    return quizz[i];
                }
            }
            return null;
        }
    }
})