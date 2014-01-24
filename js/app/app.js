var docRApp = angular.module('docR', ['ngRoute', 'ui.bootstrap', 'ui.select2', 'LocalStorageModule']);

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


docRApp.factory('userDocsService', ['localStorageService', function(localStorageService){

	return {

		setDocs : function() {
			var docs = localStorageService.get('docs');

			if(docs==null){
				
				docs = [
				{ 'cat' : 'Angularjs', 'desc' : 'doc sur angularjs' },
				{ 'cat' : 'Laravel', 'desc' : 'doc sur laravel' },
				{ 'cat' : 'Bower', 'desc' : 'installation, gestion des packages' },
				{ 'cat' : 'Grunt', 'desc' : 'installation, uglify + minification'},
				{ 'cat' : 'Photo', 'desc' : 'Canon7D, Cadrage / Décadrage'},
				{ 'cat' : 'Angularjs', 'desc' : 'Services / factory' },
				{ 'cat' : 'CakePHP', 'desc' : 'Specs 3.0' },
				{ 'cat' : 'Compass', 'desc' : 'Mixins' },
				{ 'cat' : 'Github', 'desc' : 'Config git'},
				{ 'cat' : 'Windows 7', 'desc' : 'Lignes de commandes utiles'},
				{ 'cat' : 'Sublime Text 2', 'desc' : 'Snippets php' },
				{ 'cat' : 'Laravel', 'desc' : 'IOC' },
				{ 'cat' : 'Node.js', 'desc' : 'installation, npm' },
				{ 'cat' : 'Html5', 'desc' : 'Boilerplate de base'}
				];
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