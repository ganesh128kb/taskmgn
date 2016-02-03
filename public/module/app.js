var app = angular.module('febeApp',['ngResource']);
app.factory('webService',function($resource){
	return $resource("/restService/:user",{user:'@user'},{
		'query': {method: 'GET',url:'/restService/', isArray: true},
		'saveList':{method:'POST',url:'/listService/',isArray:false},
		'delete':{method:'POST',url:'/delService/',isArray:false},
		'register':{method:'POST',url:'/regiService/',isArray:false},
		'getQuery':{method:'GET',url:'/getService/',isArray:true}
	});
})