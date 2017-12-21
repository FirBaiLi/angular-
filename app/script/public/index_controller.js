/**
 * Created by Bll on 2017/12/7.
 */
module.exports = indexController;
indexController.$inject = ['$scope', '$state', '$stateParams','Restangular','alertService'];
function indexController($scope, $state, $stateParams,Restangular,alertService) {
  $scope.apiData = [];
  $scope.apiData = [
    {
      name: 'ng',
      expression: 'AngularJS的默认模块，包含AngularJS的所有核心组件。'
    },
    {
      name:'ngRoute',
      expression: 'AngularJS是一套前端的MVC框架。那么，为了实现视图的中转，肯定会涉及到路由的概念。ngRoute即是AngularJS的路由模块。'
    },
    {
      name: 'ngAnimate',
      expression: 'AngularJS的动画模块，使用ngAnimate各种核心指令能为你的应用程序提供动画效果。动画可使用css或者JavaScript回调函数。'
    },
    {
      name: 'ngAria',
      expression: '使用ngaria为指令注入共同的可达性属性和提高残疾人用户体验。'
    },
    {
      name: 'ngResource',
      expression: '当查询和发送数据到一个REST 服务器时，使用ngResource模块。。'
    },
    {
      name: 'ngCookies',
      expression:'ngCookies模块提供了一个方便的包用于读取和写入浏览器的cookies。'
    },
    {
      name: 'ngTouch',
      expression:'ngRoute模块提供触摸事件，方便的应用于移动触摸设备。它的实现是实现是基于jQuery移动触摸事件处理。。'
    },
    {
      name: 'ngSanitize',
      expression: 'ngSanitize模块可安全地在你的应用程序中解析和操作HTML数据。'
    },
    {
      name: 'ngMessages',
      expression: 'AngularJS表单验证模块。ngMessages模块完美的实现了很多表单验证的常用功能，简化你的开发流程。'
    }
  ];
  $scope.show = function () {
    $('#myModal').modal('show');
  };
  $scope.delete = function () {
    // alertService.mask('加载中');
    alertService.addAlert({
      type: 'tip',
      title: '提示',
      msg:'确定要删除吗？',
      callBack: {
        yes: function () {
          alertService.addAlert({
            type: 'success',
            title: '提示',
            msg:'删除成功'
          })
        }
      }
    })
  }
}
