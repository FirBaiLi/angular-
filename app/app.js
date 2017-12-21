/**
 * Created by Bll on 2017/12/7.
 */
require('./style/app.less');

require.ensure(['angular', 'angular-ui-router', 'angular-sanitize', 'restangular','bootstrap'], function (require) {
  require('angular');
  // require('jquery');
  require('bootstrap');
  require('angular-ui-router');
  require('angular-sanitize');
  require('restangular');
  require('./script/public');
  require('./script/jc');
  require('./script/common');
  require('./commonPlugin');
  
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
  app.controller('applicationController',['$scope',function($scope){
    // 一般用来获取用户信息等
  }]);
  angular.bootstrap(document.body, ['pratice'], {strictDi: true});
});
