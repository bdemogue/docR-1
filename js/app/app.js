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

docRApp.controller('NavCtrl',['$scope','$location', function($scope, $location){
	$scope.$on('$routeChangeSuccess',function(){
		$scope.isSidebar = false;
	})
	$scope.isSidebar = false;
	console.log($scope.isSidebar);
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
		console.log($scope.isSidebar);
	}


}]);

docRApp.controller('DocsCtrl',['$scope','$location','$http', 'docs', function($scope, $location, $http, docs){
	
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

docRApp.directive('sidebar', ['$timeout', function($timeout){
	return {
		restrict : 'E',
		templateUrl :'partials/directives/sidebar.html',
		link : function postLink(scope, element, attrs){

			scope.$on('$viewContentLoaded', function() {
				
				scope.$watch('isSidebar',function(){
					var body = angular.element('body');
					var page = angular.element('#page');
					var btnLines = angular.element('.top-bar .toggle-topbar.menu-icon a');
					var topBar = angular.element('.top-bar');
					if(scope.isSidebar){
						body.css({ overflow:'hidden' });

						page.css({ opacity : .3 });
						btnLines.animate({ right:'10px'}, 50);
						topBar.css({ borderBottom: '1px solid #777' });
					}
					else{
						body.css({ overflow:'auto' });

						page.css({	opacity : 1 });

						btnLines.animate({right:'1px'}, 50);

						topBar.css({ borderBottom: '0 none' });
					}
				})
			})
		
				
		}	
	}
}]);

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