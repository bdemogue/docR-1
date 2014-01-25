var docRApp = angular.module('docR', ['ngRoute', 'ui.bootstrap', 'ui.select2', 'LocalStorageModule', 'mongolabResourceHttp']);

docRApp.constant('MONGOLAB_CONFIG',{API_KEY:'RaaG5FZIUwKBa3Men9gHm9oM9Siv1Vi8', DB_NAME:'docr'});

docRApp.config(["$routeProvider", "$locationProvider",'localStorageServiceProvider', function($routeProvider, $locationProvider, localStorageServiceProvider) {

	$routeProvider
		.when('/docs', {
			templateUrl: 'partials/view.html',
			controller : 'DocsCtrl',
			resolve : {
				docs: ['Doc' , function(Doc){
					return Doc.all();
				}
			]}
		})
		.when('/add', {
			templateUrl: 'partials/add.html',
			controller : 'AddDocCtrl'
		})
		.otherwise({ redirectTo: '/docs' });

		localStorageServiceProvider.setPrefix('docR');

}]);


docRApp.controller('NavCtrl',['$scope','$location','userDocsService', function($scope, $location, userDocsService){
	//collapse
	$scope.isCollapsed = true;

	//active menu
	$scope.isActive = function(viewLocation){
		console.log($location.path());
		return viewLocation === $location.path();
	};


}]);

docRApp.controller('DocsCtrl',['$scope','$location','$http','userDocsService', 'docs', function($scope, $location, $http, userDocsService, docs){
	
	$scope.docs = docs;
	console.log($scope.docs);

	$scope.remove = function(doc, index){
		console.log(index);
		doc.$remove(function(){

			$scope.docs.splice(index, 1);
			$location.path('/docs');

		}, function(){
			throw new Error("Sth went wrong...");
		})
	}
	
}]);


docRApp.controller('AddDocCtrl',['$scope','$location','$http', function($scope, $location, $http){

	//select2 options
	 $scope.categories = [

	 ];
	 $scope.select2Options = {
	 	'width' : '100%',
        'multiple': true,
        'simple_tags': true,
        'tags': ['AngularJS', 'nodeJS', 'laravel', 'grunt'] // Can be empty list.
    };
	
}]);

//Set mongolab ressource

docRApp.factory('Doc', function ($mongolabResourceHttp) {
  return $mongolabResourceHttp('docs');
});


docRApp.factory('userDocsService', ['localStorageService','Doc', function(localStorageService, Doc){

	return {

		setDocs : function() {
			var docs = localStorageService.get('docs');

			if(docs==null){
				
				docs = Doc.all(function(dbDocs){
					localStorageService.set('docs', dbDocs);
					return docs;
				});
		
				
			}
			else{
				return docs;
			}
			

		},
		getAllDocs: function() {
			return this.setDocs();
		},

		delDocs: function() {
			
			return localStorageService.clearAll();
		}
	}
	
}]);