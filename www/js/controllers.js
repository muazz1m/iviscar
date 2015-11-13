angular.module('starter.controllers', [])

.controller('ProfileCtrl', function($state, $scope, UserService, FirebaseService, $localstorage){

	var fb = FirebaseService.getAuth();
	var path = FirebaseService.child("owner").child("user").child(fb.uid).child("profile");

	$scope.viewCar = function(){
    	$state.go('carList');
  	}

  	$scope.reqCar = function(){
  		$state.go('carList');
  	}

	$scope.userProfile = function(){

		if($localstorage.get("type") == 1){
			UserService.pathOwner.child(fb.uid).child("profile").set({
				ivis_username: $localstorage.get("username"),
				ivis_phoneNumber: $localstorage.get("pNumber")
			});

			UserService.pathOwner.child(fb.uid).child("profile").on("value",function(snap){
				var newPost = snap.val();
				$scope.username = newPost.ivis_username;
				$scope.pNumber = newPost.ivis_phoneNumber;
			})
			$scope.renter = true;	
		}
		if($localstorage.get("type") == 2){
			UserService.pathRenter.child(fb.uid).child("profile").set({
					ivis_username: $localstorage.get("username"),
					ivis_phoneNumber: $localstorage.get("pNumber")
			});

			UserService.pathRenter.child(fb.uid).child("profile").on("value",function(snap){
				var newPost = snap.val();
				$scope.username = newPost.ivis_username;
				$scope.pNumber = newPost.ivis_phoneNumber;
			})
			$scope.renter = false;
		}
	}  
})
.controller('AddCarCtrl', function(FirebaseService, $firebaseAuth, $firebaseObject, $ionicModal,$scope,$state,$localstorage, UserService) {
	var fb = FirebaseService.getAuth();

  $ionicModal.fromTemplateUrl('templates/_carForm.html', function(modal) {
		$scope.modalForm = modal;
	},{
		scope: $scope,
		animation: 'slide-in-up'
	});

  $ionicModal.fromTemplateUrl('templates/_carDetail.html', function(modal) {
		$scope.modalForm2 = modal;
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

	$scope.createCar = function(car) {

		$scope.car = {};
		if(!car.name.length) {
			return ;
		} else {
			var npath = UserService.pathOwner.child(fb.uid).child("carlist");
			var cpath = UserService.pathCar.child("list");
			var user_id = fb.uid;

			var car_id = npath.push({
				car_name: car.name,
				car_transition: car.trans
			}).key();

			cpath.push({
				car_name: car.name,
				car_transition: car.trans,
				car_owner_id : user_id,
				car_id : car_id
			});

			$scope.closeModal();
			car.name = "";
		}
	}

	$scope.list = function(){

		var npath = UserService.pathOwner.child(fb.uid).child("carlist");
		var npath2 = UserService.pathCar.child("list");

		if($localstorage.get("type") == 1){

			if(fb){
				var syncObject = $firebaseObject(npath);
				syncObject.$bindTo($scope, "carlist");
			}else{
				$state.go('login');
			}
		}
		if($localstorage.get("type") == 2){
			if(fb){
				var syncObject = $firebaseObject(npath2);
				syncObject.$bindTo($scope, "carlist");
			}else{
				$state.go('login');
			}

			$scope.hide = true;
			$scope.hide2 = true;
		}
	}
/*
	$scope.listAll = function(){

		var npath = UserService.pathCar.child("list");

		if(fb){
			var syncObject = $firebaseObject(npath);
			syncObject.$bindTo($scope, "list");
		}else{
			$state.go('login');
		}
	}

	$scope.viewCar = function(){
		//$state.go('carDetail');
		$scope.modalTitle = "";
		$scope.modalForm.show();
	}
*/
	$scope.viewCarDetail = function(key){

		if($localstorage.get("type") == 2){
			
			$scope.modalTitle = "CAR DETAIL";
			//$scope.hideShow = true;
			$scope.modalForm2.show();

			UserService.pathCar.child("list").child(key).on("value",function(snap){
				var newPost = snap.val();
				$scope.car_name = newPost.car_name;
				$scope.car_transition = newPost.car_transition;
				$scope.car_id = newPost.car_id;
				$scope.owner_id = newPost.car_owner_id;
			});
		}
		else{
			$scope.modalTitle = "CAR DETAIL";
			$scope.modalForm.show();
		}
	}
    
    $scope.closeModal = function() {
		$scope.modalForm.hide();
		$scope.modalForm2.hide();
	}

	$scope.editCar = function(car){
		$scope.modalTitle = "Edit todo";
		$scope.car = car;
		$scope.hide = false;
		$scope.modalForm.show();
	}

	$scope.removeCar = function(key){
		var npath = UserService.pathOwner.child(fb.uid).child("carlist").child(key);
		UserService.pathCar.child("list").on("value",function(snap){
			snap.forEach(function(childSnap){

				var ref = childSnap.val();
				var ref2 = childSnap.key();

				if(ref.car_id == key){
					var cpath = UserService.pathCar.child("list").child(ref2).remove();
				}
			});
		});
		npath.remove();
	}

	$scope.request = function(owner_id, car_id){

		//alert(owner_id + "_" + car_id);
		UserService.pathOwner.child(owner_id).child("carlist").child(car_id).on("value",function(snap){
			var car_name = snap.val();
			var mssg = $localstorage.get("username") + " wants this car ";
			var msgPath = UserService.pathOwner.child(owner_id).child("inbox");

			msgPath.push({
				sender : $localstorage.get("username"),
				car_id : car_id,
				car_name : car_name.car_name,
				msg : mssg
			});
		});

		$scope.closeModal();
	}
})

.controller('LoginCtrl', function(FirebaseService,$firebaseAuth, $state, $scope,$localstorage, UserService){
	var fb = $firebaseAuth(FirebaseService);
	var loggedIn = FirebaseService.getAuth();

	if(!loggedIn){

	$scope.login = function(username, pNumber,type_opt){
	
	$localstorage.set("username",username);
	$localstorage.set("pNumber",pNumber);
	$localstorage.set("type",type_opt);

		var email = username + "_" + pNumber + "@ivis.com";
		var pswd  = username + "_" + pNumber;
		var id = username + "_" + pNumber + "_" + type_opt;

			fb.$authWithPassword({	
				email:email,
				password:pswd
			}).then(function(authData){
				$state.go('menu.carlist');
			}).catch(function(error){
				alert(error);
			})
	}

	$scope.register = function(username, pNumber,type_opt){

	$localstorage.set("username",username);
	$localstorage.set("pNumber",pNumber);
	$localstorage.set("type",type_opt);

		var email = username + "_" + pNumber + "@ivis.com";
		var pswd  = username + "_" + pNumber;
		var id = username + "_" + pNumber + "_" + type_opt;

			var obj = {
				email:email,
				password:pswd
			}
			fb.$createUser(obj).then(function(){
				return fb.$authWithPassword(obj);
			}).then(function(authData){
				$state.go('menu.profile');
			}).catch(function(error){
				alert(error);
			})
	}
}
else{
	$state.go("menu.profile");
}
})

.controller('AppCtrl', function($state, $scope, FirebaseService, $localstorage){

	$scope.inbox = function(){
		$state.go('menu.inbox');
	}

	$scope.setting = function(){
		$state.go('menu.setting');
	}

	$scope.logout = function(){
		FirebaseService.unauth();
		$localstorage.empty();
		//$localstorage.remove('username');
		//$localstorage.remove('pNumber');
    	$state.go('login');
	}
})

.controller('InboxCtrl', function($state, $scope,$firebaseObject, FirebaseService, $localstorage, UserService){
	
	var fb = FirebaseService.getAuth();
	$scope.list = function(){

		var npath = UserService.pathOwner.child(fb.uid).child("inbox");

		if(fb){
			var syncObject = $firebaseObject(npath);
			syncObject.$bindTo($scope, "inbox");
		}else{
			$state.go('login');
		}
	}

})

.controller('SettCtrl', function($scope, $state, $localstorage, $ionicModal, $cordovaDevice, $cordovaFile, $ionicPlatform, $cordovaEmailComposer, $ionicActionSheet, ImageService, FileService, UserService, FirebaseService, $ionicPopup){

	$scope.username = $localstorage.get("username");
	$scope.pNumber = $localstorage.get("pNumber");

	$ionicModal.fromTemplateUrl('templates/_editProfile.html', function(modal) {
		$scope.modalForm = modal;
	},{
		scope: $scope,
		animation: 'slide-in-up'
	});
	$scope.editPro = function(){
		$scope.modalTitle = " Profile "
		$scope.modalForm.show();
	}

	$scope.closeModal = function(){
		$scope.modalForm.hide();
	}

	$ionicPlatform.ready(function() {
	    $scope.images = FileService.images();
	    $scope.$apply();
	  });
 
	  $scope.urlForImage = function(imageName) {
	    //var trueOrigin = cordova.file.dataDirectory + imageName;
	    //return trueOrigin;
	  }
 
  $scope.addMedia = function() {
    $scope.hideSheet = $ionicActionSheet.show({
      buttons: [
        { text: 'Take photo' },
        { text: 'Photo from library' }
      ],
      titleText: 'Add images',
      cancelText: 'Cancel',
      buttonClicked: function(index) {
        $scope.addImage(index);
      }
    });
  }
 
  $scope.addImage = function(type) {
    $scope.hideSheet();
    ImageService.handleMediaDialog(type).then(function() {
      $scope.$apply();
    });
  }	
	/*$ionicPlatform.ready(function() {
	
		$scope.getImageSaveContact = function() {       
	        // Image picker will load images according to these settings
		    var options = {
		        maximumImagesCount: 1, // Max number of selected images, I'm using only one for this example
		        width: 800,
		        height: 800,
		        quality: 80            // Higher is better
		    };
	 
		    $cordovaImagePicker.getPictures(options).then(function (results) {
		                // Loop through acquired images
		        for (var i = 0; i < results.length; i++) {
		            $scope.selectedImage = results[i];   // Print image URI
		 			/*window.plugins.Base64.encodeFile($scope.selectedImage, function(base64){  // Encode URI to Base64 needed for contacts plugin
		                        $scope.selectedImage = base64;
		                        //$scope.addContact();    // Save contact
		            });
		        }
		    }, function(error) {
		        console.log('Error: ' + JSON.stringify(error));    // In case of error
		    });
		};
	});  */

	//delete account function
	var fb = FirebaseService.getAuth();
	var path = UserService.pathOwner.child(fb.uid);
	var path2 = UserService.pathRenter.child(fb.uid);
	$scope.deleteAcc = function(){
		if(fb){

			var confirmPopup = $ionicPopup.confirm({
	     		title: 'Delete Account',
	     		template: 'Are you sure you want to delete account?',
	     		okText: 'Delete',
	     okType: 'button-assertive'
	   		});

	   		confirmPopup.then(function(res) {
	     	
		     	if(res) {

					if($localstorage.get("type") == 1){
						UserService.pathCar.child("list").on("value",function(snap){
							snap.forEach(function(childSnap){

								var ref = childSnap.val();
								var ref2 = childSnap.key();

								if(ref.car_owner_id == fb.uid){
									var cpath = UserService.pathCar.child("list").child(ref2).remove();
								}
							});
						});
						path.child("profile").remove();
						path.child("inbox").remove();
						path.child("carlist").remove();
					}
					if($localstorage.get("type") == 2){
						path2.child("profile").remove();
						path2.child("inbox").remove();
					}

					FirebaseService.removeUser({
						email: $localstorage.get("username") + "_" + $localstorage.get("pNumber") + "@ivis.com",
						password: $localstorage.get("username") + "_" + $localstorage.get("pNumber")
					}, function(error) {
						  if (error) {
						    switch (error.code) {
						      case "INVALID_USER":
						        console.log("The specified user account does not exist.");
						        break;
						      case "INVALID_PASSWORD":
						        console.log("The specified user account password is incorrect.");
						        break;
						      default:
						        console.log("Error removing user:", error);
						    }
						  } else {
						    console.log("User account deleted successfully!");
						  }
					});
					$localstorage.empty();
					$state.go('login');
		     	} else {
		     	}
	   		});
	   	}
	};
})

.controller('AccCtrl', function($scope, $state, $localstorage, UserService, FirebaseService, $localstorage, $ionicPopup){

	var fb = FirebaseService.getAuth();
	var path = UserService.pathOwner.child(fb.uid);
	var path2 = UserService.pathRenter.child(fb.uid);
	$scope.deleteAcc = function(){
		if(fb){

			var confirmPopup = $ionicPopup.confirm({
	     		title: 'Delete Account',
	     		template: 'Are you sure you want to delete account?'
	   		});

	   		confirmPopup.then(function(res) {
	     	
		     	if(res) {

					if($localstorage.get("type") == 1){
						UserService.pathCar.child("list").on("value",function(snap){
							snap.forEach(function(childSnap){

								var ref = childSnap.val();
								var ref2 = childSnap.key();

								if(ref.car_owner_id == fb.uid){
									var cpath = UserService.pathCar.child("list").child(ref2).remove();
								}
							});
						});
						path.child("profile").remove();
						path.child("inbox").remove();
						path.child("carlist").remove();
					}
					if($localstorage.get("type") == 2){
						path2.child("profile").remove();
						path2.child("inbox").remove();
					}

					FirebaseService.removeUser({
						email: $localstorage.get("username") + "_" + $localstorage.get("pNumber") + "@ivis.com",
						password: $localstorage.get("username") + "_" + $localstorage.get("pNumber")
					}, function(error) {
						  if (error) {
						    switch (error.code) {
						      case "INVALID_USER":
						        console.log("The specified user account does not exist.");
						        break;
						      case "INVALID_PASSWORD":
						        console.log("The specified user account password is incorrect.");
						        break;
						      default:
						        console.log("Error removing user:", error);
						    }
						  } else {
						    console.log("User account deleted successfully!");
						  }
					});
					$localstorage.empty();
					$state.go('login');
		     	} else {
		     	}
	   		});
	   	}
	};
})

/*.controller('ImageCtrl', function($scope,$ionicModal, $cordovaDevice, $cordovaFile, $ionicPlatform, $cordovaEmailComposer, $ionicActionSheet, ImageService, FileService) {

	$scope.editPro = function(){
		$state.go('editPro');
		$scope.modalTitle = " Profile "
		$scope.modalForm.show();
	}

	$scope.closeModal = function(){
		$scope.modalForm.hide();
	} 
  $ionicPlatform.ready(function() {
    $scope.images = FileService.images();
    $scope.$apply();
  });
 
  $scope.urlForImage = function(imageName) {
    var trueOrigin = cordova.file.dataDirectory + imageName;
    return trueOrigin;
  }
 
  $scope.addMedia = function() {
    $scope.hideSheet = $ionicActionSheet.show({
      buttons: [
        { text: 'Take photo' },
        { text: 'Photo from library' }
      ],
      titleText: 'Add images',
      cancelText: 'Cancel',
      buttonClicked: function(index) {
        $scope.addImage(index);
      }
    });
  }
 
  $scope.addImage = function(type) {
    $scope.hideSheet();
    ImageService.handleMediaDialog(type).then(function() {
      $scope.$apply();
    });
  }
  });*/