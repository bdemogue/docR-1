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

	$scope.hmEvents = {
		isSidebar : false,
		type :'',
		event : {}
	}
	

	$scope.$on('$routeChangeSuccess',function(){
		$scope.hmEvents.isSidebar = false;
	});
	
	//active menu
	$scope.isActive = function(viewLocation){
		return viewLocation === $location.path();
	};

	//Show sidebar with hammer, swipe / drag gestures

	
	$scope.closeSidebar = function(event){
		$scope.hmEvents.isSidebar = false;
	}

	$scope.sidebar = function(event){
		event.gesture.preventDefault();
		$scope.hmEvents.type = event.type;
		
		if($scope.hmEvents.type == 'drag'){
			$scope.hmEvents.event = event;
			$scope.hmEvents.isSidebar = true;
		}
		else{
			$scope.hmEvents.isSidebar = !$scope.hmEvents.isSidebar;
		}

		console.log($scope.hmEvents);
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

				var body     = angular.element('body'),
					page     = angular.element('#page'),
					btnLines = angular.element('.top-bar .toggle-topbar.menu-icon a'),
					topBar   = angular.element('.top-bar'),
					swipeZn  = angular.element('.swipezone'),
					sideBar  = angular.element(element);

				var popSidebar = function(){
					console.log(scope.hmEvents.type);
					switch(scope.hmEvents.type){
						case 'tap':
							sideBar.show().animate({left: '0px'}, 50);
						break;

						case 'drag':
							scope.$watch('hmEvents.event', function(){
								var deltaX = scope.hmEvents.event.gesture.deltaX;
								var sideBarPosX = sideBar.position().left;
								swipeZn.css({ width: '200px' });
								console.log(sideBarPosX, deltaX);
								sideBar.show();
								if( deltaX >= sideBar.outerWidth() ){
									sideBar.css({left: '0px'});
									return true;
								}
								sideBar.css({left: deltaX-sideBar.outerWidth()+'px'});
							})
							
							
						break;
					}
					
					body.css({ overflow:'hidden' });
					page.css({ opacity : .3 });
					btnLines.animate({ right:'10px'}, 50);
					topBar.css({ borderBottom: '1px solid #777' });
				}

				var hideSidebar = function(){
					sideBar.animate({left: '-200px'}, 50, 'linear').promise().pipe(function(){
						sideBar.hide();
					})
					body.css({ overflow:'auto' });
					page.css({	opacity : 1 });
					btnLines.animate({right:'1px'}, 50);
					topBar.css({ borderBottom: '0 none' });
				}	
				
				scope.$watch('hmEvents.isSidebar',function(){
					

					if(scope.hmEvents.isSidebar){
						popSidebar();
					}
					else{
						hideSidebar();
					}
				})
			})			
		},

		
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