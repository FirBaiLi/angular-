/**
 * Created by Bll on 2017/12/12.
 */
'use strict';
require('angular');
var md = module.exports = angular.module('pratice.jc',[]);
md.config(['$stateProvider','$urlRouterProvider',function ($stateProvider,$urlRouterProvider) {
  $stateProvider
  .state('pratice.jc',{
    url: '/jc',
    abstract: true
  })
  .state('pratice.jc.first',{
    url: '/first',
    views: {
      '@': {
        template: require('../../template/jc/1/1.html'),
        controller: 'FirstController'
      },
      'header@': {
        template: require('../../template/public/head.html')
      },
      'footer@': {
        template: require('../../template/public/foot.html')
      }
    }
  })
    .state('pratice.jc.second',{
      url: '/second',
      views: {
        '@': {
          template: require('../../template/jc/2/2.html'),
          controller: 'SecondController'
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
md.controller('FirstController', require('./1/1_controller'));
md.controller('SecondController', require('./2/2_controller'));
