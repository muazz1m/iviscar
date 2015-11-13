angular.module('starter', ['ionic', 'starter.controllers', 'starter.services','firebase','ngCordova','ngStorage'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      StatusBar.styleLightContent();
    }
  });
})


.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider

    .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl'    
  })

  .state('menu',{
    url:'/menu',
    templateUrl:'templates/menu.html',
    abstract:true,
    controller: 'AppCtrl'
  })

  .state('menu.profile', {
    url:'/profile',
    views:{
      'menuContent':{
        templateUrl:'templates/profile.html',
        controller:'ProfileCtrl'
      }
    }
  })

    .state('menu.carlist', {
    url:'/carlist',
    views:{
      'menuContent':{
        templateUrl:'templates/carList.html',
        controller:'AddCarCtrl'
      }
    }
  })

    .state('menu.inbox', {
    url:'/inbox',
    views:{
      'menuContent':{
        templateUrl:'templates/inbox.html',
        controller:'InboxCtrl'
      }
    }
  })

    .state('menu.setting', {
    url: '/setting',
    views:{
      'menuContent':{
        templateUrl:'templates/setting.html',
        controller:'SettCtrl'
      }
    }
  })

    .state('editPro', {
    url: '/editProfile',
    templateUrl: 'templates/_editProfile.html',
    controller:'SettCtrl'
  })

    .state('allCar', {
    url: '/allCar',
    templateUrl: 'templates/allCar.html',
    controller:'AddCarCtrl'
  })

    .state('notification', {
    url: '/notification',
    templateUrl: 'templates/notification.html'
    
  })

    .state('carDetail', {
    url: '/carDetail',
    templateUrl: 'templates/_carDetail.html',
    controller: 'AddCarCtrl'
  })

  $urlRouterProvider.otherwise('/login');

});
