var docRApp = angular.module('docR', ['ngRoute', 'ui.bootstrap', 'ui.select2', 'LocalStorageModule', 'mongolabResource']);

docRApp.constant('API_KEY', 'RaaG5FZIUwKBa3Men9gHm9oM9Siv1Vi8');
docRApp.constant('DB_NAME', 'docr');

docRApp.config(["$routeProvider", "$locationProvider",'localStorageServiceProvider', function($routeProvider, $locationProvider, localStorageServiceProvider) {

	$routeProvider
		.when('/docs', {
			templateUrl: 'partials/view.html',
			controller : 'DocsController'
		})
		.when('/add', {
			templateUrl: 'partials/add.html',
			controller : 'AddDocController'
		})
		.otherwise({ redirectTo: '/docs' });

		localStorageServiceProvider.setPrefix('docR');

}]);


docRApp.controller('NavController',['$scope','$location','userDocsService', function($scope, $location, userDocsService){
	$scope.docs = userDocsService.getAllDocs();
	//collapse
	$scope.isCollapsed = true;

	//active menu
	$scope.isActive = function(viewLocation){
		console.log($location.path());
		return viewLocation === $location.path();
	};


}]);

docRApp.controller('DocsController',['$scope','$location','$http','userDocsService', function($scope, $location, $http, userDocsService){

	//retrive docs
	$scope.isDeleted = userDocsService.delDocs();
	$scope.docs = userDocsService.getAllDocs();

}]);


docRApp.controller('AddDocController',['$scope','$location','$http', function($scope, $location, $http){

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

docRApp.factory('Doc', function ($mongolabResource) {
  return $mongolabResource('docs');
});


docRApp.factory('userDocsService', ['localStorageService','Doc', function(localStorageService, Doc){

	return {

		setDocs : function() {
			var docs = localStorageService.get('docs');

			if(docs==null){
				
				docs = Doc.query();
				localStorageService.set('docs', docs);
			}

			return docs;

		},
		getAllDocs: function() {
			return this.setDocs();
		},

		delDocs: function() {
			
			return localStorageService.clearAll();
		}
	}
	
}]);