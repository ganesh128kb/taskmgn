/*-----Validator-----*/
app.directive('validateEmail', function() {
  var EMAIL_REGEXP = /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
  return {
    link: function(scope, elm) {
      elm.on("keyup",function(){
            var isMatchRegex = EMAIL_REGEXP.test(elm.val());
            if( isMatchRegex&& elm.hasClass('warning') || elm.val() == ''){
              elm.removeClass('warning');
            }else if(isMatchRegex == false && !elm.hasClass('warning')){
              elm.addClass('warning');
            }
      });
    }
  }
});

/*--------Register Service------*/
app.service('forgetService',function(webService){		
	this.SignIn = function(param){	
		if(!param.txtEmailId){
			alert("Please enter the Email id");
			return false;
		}						
		if(param.txtEmailId){
			var Obj = {'txtEmail':param.txtEmailId}					
			webService.forgetPass(Obj,function(data){		
				if(data.response=="wrong"){
					alert("Email id doesn't exits");
				}else{
					alert("Sent Successfully");
				}
				
			});
		}		
	}	
})

app.controller('forgetPassCtrl',function($scope,forgetService){	
	$scope.myForm = {};	
	$scope.myForm.formSubmit = function(){
		forgetService.SignIn($scope.myForm);
	}	
})