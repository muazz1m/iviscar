angular.module('starter.controllers', [])

.controller('ProfileCtrl', function($scope,$state) {

  $scope.logIn = function(){
    $state.go('carList');
  }
    
})

.controller('AddCarCtrl', function($ionicModal,$scope,$state) {

  $ionicModal.fromTemplateUrl('templates/_carForm.html', function(modal) {
		$scope.modalForm = modal;
	},{
		scope: $scope,
		animation: 'slide-in-up'
	});

  	$scope.addCar = function(){
		//$scope.todo = "";
		$scope.modalTitle = "Add New Car";
		//$scope.hideShow = true;
		$scope.modalForm.show();
	}
    
    $scope.closeModal = function() {
		$scope.modalForm.hide();
	}
})


