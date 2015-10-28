angular.module('starter.controllers', [])

.controller('ProfileCtrl', function($scope,$state) {

  $scope.logIn = function(){
    $state.go('carList');
  }
    
})

