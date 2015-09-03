/*--------Login Service------*/
app.service('loginService',function(webService){				
	this.SignIn = function(param){
		if(!param.txtEmail){
			alert("Please Enter the Username");
			return false;
		}	
		if(!param.txtPass){
			alert("Please Enter the Password");
			return false;
		}	
		if(param.txtEmail && param.txtPass){
			var Obj = {'txtEmail':param.txtEmail,'txtPass':param.txtPass}		
			webService.save(Obj,function(data){	
				if(data.response=="WrongUserPass"){
					alert("The username/password you entered is incorrect");
				}
				else if(data.response=="UserName"){
					alert("The password you entered is incorrect");												
				}
				else if(data.response=="success"){					
					sessionStorage.setItem("loginSession","success");
					localStorage.setItem("username",data.username);
					var data = sessionStorage.getItem('loginSession');				
					if(data == "success"){
						window.location.assign('/index');
					}	
				}
			});
		}		
	}	
})

app.controller('LoginController',function($scope,loginService){	
	$scope.myForm = {};	
	$scope.myForm.formSubmit = function(){
		loginService.SignIn($scope.myForm);
	}
})