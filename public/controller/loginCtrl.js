/*--------Login Service------*/
app.service('loginService',function(webService){		
	this.SignIn = function(param){
		if(!param.txtEmail){
			alert("Please enter the Username");
			return false;
		}
		if(!param.txtPass){
			alert("Please enter the Password");
			return false;
		}
		if(param.txtEmail && param.txtPass){
			var Obj = {'txtEmail':param.txtEmail,'txtPass':param.txtPass}		
			webService.save(Obj,function(data){						
				if(data[0]=="s"){
					sessionStorage.setItem("loginSession","success");
					var data = sessionStorage.getItem('loginSession');					
					if(data == "success"){
						window.location.assign('/index');	
					}										
				}else{
					alert("Username/Password is wrong");
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