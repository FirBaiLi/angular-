/**
 * Created by Bll on 2017/12/19.
 */
module.exports = angular.module('ui.common.alert',[])
  .directive('uicAlert',function () {   // 加在首页index.htm文件中
    return {
      restrict: 'A',
      template: require('./alert.html'),
      replace: false, // 标签存在
      scope:true, // 继承父元素并改变 但是修改不会影响父元素（继承隔离）,
      controller: ['$scope','alertService',function ($scope,alertService) {
        $scope.alerts = alertService.alerts;
        $scope.mark = alertService.mark;
      }]
    }
  })
  .factory('alertService',function () {
    var service = {
      //控制alert个数 repeat的对象
      alerts: [],
      mark: []
    };
    //关闭alert
    service.closeAlert = function (alert) {
      var self = this;
      self.alerts.splice(self.alerts.indexOf(alert), 1);
    };
    //弹出alert
    service.addAlert = function (options) {
      var self = this;
      //参数值的默认处理
      options = options || {};
      options.type = ( options.type || 'tip');
      (options.cover === undefined) && (options.cover = true);
      options.title = ( options.title || '提示');
      
      //tip的默认样式设置
      if (options.type == 'tip') {
        options.msg = ( options.msg || '是否确认?');
        options.btn = (options.btn || {yes: '确 定', no: '关 闭'});
      } else if (options.type == 'success') {
        options.msg = ( options.msg || '操作成功');
        options.btn = (options.btn || {yes: '确 定'});
      } else if (options.type == 'error') {
        options.msg = ( options.msg || '操作失败');
        options.btn = (options.btn || {yes: '确 定'});
      }
    
      //默认的回调函数设置 与btn之间靠key值建立一一对应关系
      options.callBack = (options.callBack || {});
      angular.forEach(options.btn, function (value, key) {
        options.callBack[key] = (options.callBack[key] || function () {
        });
      });
      //处理btn 避免ng-repeat遍历对象时的顺序问题
      var buttons = [];
      //传入两个字 中间加空格
      var reg = /^[\u4E00-\u9FA5]{2}$/;
      angular.forEach(options.btn, function (value, key) {
        if (reg.test(value)) {
          value = value.slice(0, 1) + ' ' + value.slice(1);
        }
        var arr = new Array(key, value);
        buttons.push(arr);
      });
    
    
      //禁用body滚动条
      var body_scrollHeight = $('body')[0].scrollHeight;
      var docHeight = document.documentElement.clientHeight;
      if (body_scrollHeight > docHeight) {
        $('body').addClass('alert_open');
      }
      //确定alerts的属性
      self.alerts.push({
        type: options.type,
        cover: options.cover,
        title: options.title,
        msg: options.msg,
        detail: options.detail,
        btn: buttons,
        close: function ($event) {
          self.closeAlert(this);
          //解除body滚动条
          if (!self.alerts.length) {
            $('body').removeClass('alert_open');
          }
        
          //根据btn的类型确定回调函数
          if ($event) {
            var key = $($event.target).attr('data-types');
            options.callBack[key]();
          }
        }
      });
    };
    //弹出loading
    service.mask = function (msg) {
      var self = this;
      self.mark[0] = msg;
    };
    service.unmask = function () {
      var self = this;
      self.mark.splice(0, 1);
    };
    return service;
  });

