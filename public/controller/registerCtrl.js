/*--------Register Service------*/
app.service('regiService',function(webService){		
	this.SignIn = function(param){
		if(!param.firstName){
			alert("Please Enter the First Name");
			return false;
		}
		if(!param.txtEmail){
			alert("Please Enter the Username");
			return false;
		}
		if(!param.txtPass){
			alert("Please Enter the Password");
			return false;
		}
		if(param.firstName && param.txtEmail && param.txtPass){
			var Obj = {'txtFirstName':param.firstName,'txtEmailid':param.txtEmail,'txtPass':param.txtPass}		
			webService.register(Obj,function(data){		
				if(data.response=="already"){
					alert('Username already exists')	
						window.location.assign('/');															
				}else{
					alert("Sign up successfully");
					window.location.assign('/');
				}				
			});
		}		
	}	
})

app.controller('registerController',function($scope,regiService){	
	$scope.myForm = {};	
	$scope.myForm.formSubmit = function(){
		regiService.SignIn($scope.myForm);
	}
})