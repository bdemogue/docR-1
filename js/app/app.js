var docRApp = angular.module('docR', ['ngRoute', 'ngAnimate', 'mm.foundation', 'hmTouchEvents', 'ui.select2', 'LocalStorageModule', 'mongolabResourceHttp']);

docRApp.constant('MONGOLAB_CONFIG',{API_KEY:'RaaG5FZIUwKBa3Men9gHm9oM9Siv1Vi8', DB_NAME:'docr'});

docRApp.config(["$routeProvider", "$locationProvider",'localStorageServiceProvider', function($routeProvider, $locationProvider, localStorageServiceProvider) {

	$routeProvider
		.when('/docs', {
			templateUrl: 'partials/view.html',
			controller : 'DocsCtrl',
			resolve : {

				docs : ['Doc', function(Doc){
				 	return Doc.all();
				}]
			}
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
	$scope.isSidebar = false;

	//active menu
	$scope.isActive = function(viewLocation){
		return viewLocation === $location.path();
	};

	//Show sidebar with hammer, swipe / drag gestures
	
	$scope.closeSidebar = function(event){
		$scope.isSidebar = false;
	}

	$scope.sidebar = function(event){
		$scope.isSidebar = !$scope.isSidebar;
	}


}]);

docRApp.controller('DocsCtrl',['$scope','$location','$http','userDocsService', 'docs', function($scope, $location, $http, userDocsService, docs){
	
	$scope.docs = docs;
	//console.log($scope.docs);

	$scope.remove = function(doc, index){
		/*doc.$remove(function(){

			$scope.docs.splice(index, 1);
			$location.path('/docs');

		}, function(){
			throw new Error("Sth went wrong...");
		})*/
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

docRApp.directive('sidebar', function($animate){
	return {
		restrict : 'E',
		templateUrl :'partials/directives/sidebar.html',
		link : function(scope, element, attrs){
			var body = angular.element('body');
			var container = angular.element('.container');
			var btnLines = angular.element('.top-bar .toggle-topbar.menu-icon a');
			scope.$watch('isSidebar',function(){
				if(scope.isSidebar){
					body.css({ overflow:'hidden' });

					container.css({ opacity : .3 });
					btnLines.animate({ right:'10px'}, 50);
				}
				else{
					body.css({ overflow:'auto' });

					container.css({	opacity : 1 });

					btnLines.animate({right:'1px'}, 50);
				}
			});
				
		}
	}
});

//Set mongolab ressource

docRApp.factory('Doc', function ($mongolabResourceHttp) {
  return $mongolabResourceHttp('docs');
});


docRApp.factory('userDocsService', ['localStorageService','Doc', function(localStorageService, Doc){

	return {

		setDocs : function(Doc) {
			
			return localStorageService.set('docs',Doc);
		},
		getAllDocs: function() {
			return this.setDocs();
		},

		delDocs: function() {
			
			return localStorageService.clearAll();
		}
	}
	
}]);