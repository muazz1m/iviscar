// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
/*angular.module('starter', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });

  

})*/

angular.module("ionic").provider("$ionicMaterialConfig",function(){var e=this;this.allPlatforms=!1,e.$get=function(){return e}}),angular.module("ionic").directive("button",["$ionicPlatform",function(e){return{restrict:"E",compile:function(n,t){t.hasOwnProperty("noRipple")||n.addClass("mdl-js-button mdl-js-ripple-effect"),e.ready(function(){componentHandler.upgradeElement(n[0],"MaterialButton"),componentHandler.upgradeElement(n[0],"MaterialRipple")})}}}]),angular.module("ionic").directive("ionTabNav",["$ionicPlatform",function(e){return{restrict:"E",compile:function(n,t){t.hasOwnProperty("noRipple")||n.addClass("mdl-tabs__tab"),e.ready(function(){componentHandler.upgradeElement(n[0],"MaterialButton"),componentHandler.upgradeElement(n[0],"MaterialRipple")})}}}]),angular.module("ionic").directive("ionTabs",["$ionicPlatform",function(e){return{restrict:"E",compile:function(n,t){t.hasOwnProperty("noRipple")||n.addClass("mdl-js-tabs mdl-js-ripple-effect"),e.ready(function(){componentHandler.upgradeElement(n[0],"MaterialTabs"),componentHandler.upgradeElement(n[0],"MaterialRipple")})}}}]);

angular.module('material-starter', ['ionic']).run();

angular.module('material-starter', ['ionic'])

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state('page1', {
    url: '/1',
    templateUrl: 'page1.html',
    controller:"Page1Ctrl"
  })
  .state('renterLogin', {
    url: '/2',
    templateUrl: 'renterLogin.html',
    controller: "BackCtrl"
  })
  .state('ownerLogin', {
    url: '/3',
    templateUrl: 'ownerLogin.html',
    controller : "BackCtrl"
  })
  .state('ownerAddCar', {
    url: '/4',
    templateUrl: 'ownerAddCar.html',
    controller : "BackCtrl"
  })
  
  $urlRouterProvider.otherwise("/1");
})

.controller('BackCtrl', function($scope,$ionicHistory) {
  $scope.back = function() {
    
    $ionicHistory.goBack();
    //$ionicHistory.clearHistory();
    //$ionicHistory.currentStateName="page1";
    console.log($ionicHistory.currentStateName());

}
})
.controller('Page1Ctrl', function($scope,$ionicHistory) {
    $ionicHistory.nextViewOptions({
     disableBack: false
  });
    //$ionicHistory.goBack();
    $ionicHistory.backView = null;

    $ionicHistory.clearHistory();
    //$ionicHistory.currentStateName="page1";
    console.log($ionicHistory.currentStateName());
})

/*.run(function($ionicPlatform){
$ionicPlatform.registerBackButtonAction(function (event) {
    if($state.current.name=="page1"){
  
  
  var confirmPopup = $ionicPopup.confirm({
       title: 'Consume Ice Cream',
       template: 'Are you sure you want to eat this ice cream?'
     });
     confirmPopup.then(function(res) {
       if(res) {
      navigator.app.exitApp();
       } else {
         console.log('You are not sure');
       }
     });   
    }
else 
{ 
     navigator.app.backHistory();
    }
  }, 100);
})*/
.controller('TabCtrl', function($scope, $ionicPlatform) {
  $ionicPlatform.onHardwareBackButton(function() {
     e.stopPropagation();
     //alert('you sure you want to exit?');
  });
})


.controller('NestedCtrl', function($scope, $ionicPlatform) {
  $ionicPlatform.onHardwareBackButton(function() {
     //alert('going back now yall');
  });
});