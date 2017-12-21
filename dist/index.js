webpackJsonp([0,4],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(5);


/***/ },
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by Bll on 2017/12/7.
	 */
	__webpack_require__(6);

	__webpack_require__.e/* nsure */(1, function (require) {
	  __webpack_require__(11);
	  // require('jquery');
	  __webpack_require__(20);
	  __webpack_require__(16);
	  __webpack_require__(17);
	  __webpack_require__(19);
	  __webpack_require__(33);
	  __webpack_require__(40);
	  __webpack_require__(45);
	  __webpack_require__(53);
	  
	  var app = angular.module('pratice',['ui.router','ngSanitize','ui.common','pratice.public','pratice.jc','common']);
	  app.config(['$stateProvider','$urlRouterProvider','$locationProvider',function ($stateProvider,$urlRouterProvider,$locationProvider) {
	    $stateProvider
	      .state('pratice',{
	        url: '/pratice',
	        views: {
	          '': {
	            template: '',
	            controller: function () {
	              // window.location.href = ROOT;
	            }
	          }
	        }
	      });
	      $urlRouterProvider.when('', '/pratice/public/home');// 空的路由跳到这里
	      $urlRouterProvider.otherwise('/pratice/public/home');// 没匹配路由的时候就跳到这里 默认路径
	  }]);
	/*
	  app.run(['$rootScope', '$state', '$stateParams', function ($rootScope, $state, $stateParams) {
	    $rootScope.$state = $state;
	    $rootScope.$stateParams = $stateParams;
	    $rootScope.safeApply = function (fn) {
	      var phase = $rootScope.$$phase;
	      if (phase === '$apply' || phase === '$digest') {
	        if (fn && (typeof(fn) === 'function')) {
	          fn();
	        }
	      } else {
	        this.$apply(fn);
	      }
	    };
	  }]);
	*/
	  app.controller('applicationController',['$scope',function($scope){
	    // 一般用来获取用户信息等
	  }]);
	  angular.bootstrap(document.body, ['pratice'], {strictDi: true});
	});


/***/ },
/* 6 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }
]);