/**
 * Created by Bll on 2017/12/7.
 */
'use strict';
require('angular');
var md = module.exports = angular.module('pratice.public',[]);
md.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('pratice.public', {
      url: '/public',
      abstract: true
    })
    .state('pratice.public.home',{
      url: '/home',
      views: {
        '@': {
          template: require('../../template/public/index.html'),
          controller: 'indexController'
        },
        'header@': {
          template: require('../../template/public/head.html')
        },
        'footer@': {
          template: require('../../template/public/foot.html')
        }
      }
    })
}]);
md.controller('indexController', require('./index_controller'));

