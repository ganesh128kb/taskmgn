app.controller('ListmanagementController',function($scope,webService){
	
  /*--------Ajax Query ------*/
  $scope.list = webService.query();  
  $scope.list.$promise.then(function(result){
    $scope.records = result;	
	localStorage.setItem('listRecords', JSON.stringify($scope.records));
  });
	
  $scope.markAll = false;
  $scope.saved = localStorage.getItem('listRecords');
  $scope.records = (localStorage.getItem('listRecords') !== null) ? JSON.parse($scope.saved) : [];
 	localStorage.setItem('listRecords', JSON.stringify($scope.records));
		
  // Add Event.
	  $scope.myFrm = {};
	  $scope.myFrm.addDetails = function(){
		if(!$scope.myFrm.firstname){
			alert("Please enter the FirstName");
			return false;
		}
		if(!$scope.myFrm.lastname){
			alert("Please enter the LastName");
			return false;
		}
		if(!$scope.myFrm.emailid){
			alert("Please enter the EmailId");
			return false;
		}
		if(!$scope.myFrm.number){
			alert("Please enter the PhoneNumber");
			return false;
		}
		if($scope.myFrm.firstname && $scope.myFrm.lastname && $scope.myFrm.emailid && $scope.myFrm.number){
			var Obj = {'txtName':$scope.myFrm.firstname,'txtLastname':$scope.myFrm.lastname,'txtEmailid':$scope.myFrm.emailid,'txtPhone':$scope.myFrm.number};
			webService.saveList(Obj,function(data){
				$scope.records.push({
				'txtName': $scope.myFrm.firstname,
				'txtLastname': $scope.myFrm.lastname,
				'txtEmailid': $scope.myFrm.emailid,
				'txtPhone': $scope.myFrm.number
			  })
			  $scope.myFrm.firstname = '';
			  $scope.myFrm.lastname = '';
			  $scope.myFrm.emailid = ''; 
			  $scope.myFrm.number = '';
			  localStorage.setItem('listRecords', JSON.stringify($scope.records));	
			})
		}
	  }
    //Remove Records
  $scope.removePerson = function(index,elmId) {	 
    $scope.records.splice(index, 1);	
    localStorage.setItem('listRecords', JSON.stringify($scope.records));
	var Obj = {'delRedId':elmId};
		webService.delete(Obj,function(data){				
	})
  };
  
  // Records Length	
  $scope.remaining = function() {
    var count = 0;
    angular.forEach($scope.records, function(list,key) {		
      count += list.done ? 0 : 1;
    });
    return count;
  };
  
  //Records Edit
  $scope.editHandler = function(index){
	 console.log(index);
  }  
})

app.directive('listCustom',function(){
	return{
		restrict : 'E',
		scope:{done:"="},		
		template:'<div class="wrapper"><div class="row"><div class="panel panel-success"><div class="panel-heading"><h3 class="panel-title" id="panel-title">Task Management<a class="anchorjs-link" href="#panel-title"><span class="anchorjs-icon"></span></a></h3><button type="button" class="btn btn-danger logBtn" ng-click="logHandler()">Logout</button></div><div class="panel-body"><form class="form-inline"><div class="form-group frmField"><input type="text" class="form-control" placeholder="First Name" ng-model="myFrm.firstname"><input type="text" class="form-control" placeholder="Last Name" ng-model="myFrm.lastname"><input type="text" class="form-control" placeholder="Email Id" ng-model="myFrm.emailid"><input type="text" class="form-control" placeholder="Phone Number" ng-model="myFrm.number"></div><button type="submit" class="btn btn-success" ng-click="myFrm.addDetails()">Add</button></form></div></div></div><div class="alert alert-danger" role="alert">{{remaining()}} of {{records.length}} remaining</div><div class="panel-body"><div class="form-group"><input type="text" class="form-control" placeholder="Search" ng-model="txtSearch" style="width:20%"></div></div><div class="table-responsive"><table class="table table-bordered"><thead><tr><th>First Name</th><th>Last Name</th><th>Email Id</th><th>Phone Number</th><th>Edit</th><th>Delete</th></tr></thead><tbody><tr ng-repeat="list in records | filter:txtSearch"><td>{{list.txtName}}</td><td>{{list.txtLastname}}</td><td>{{list.txtEmailid}}</td><td>{{list.txtPhone}}</td><td><button type="button" class="btn btn-danger" ng-click="editHandler($index)" data-editId="{{list.id}}" disabled>Edit</button></td><td><button type="button" class="btn btn-danger" ng-click="removePerson($index,list.id)">Delete</button></td></tr><tr ng-show="myFrm.firstname"><td>{{myFrm.firstname}}</td><td>{{myFrm.lastname}}</td><td>{{myFrm.emailid}}</td><td>{{myFrm.number}}</td><td><button type="button" class="btn btn-danger" ng-click="editHandler($index)" disabled>Edit</button></td><td><button type="button" class="btn btn-danger" ng-click="removePerson($event.target)">Delete</button></td></tr></tbody></table></div></div>',
		controller :'ListmanagementController'
	}	
})