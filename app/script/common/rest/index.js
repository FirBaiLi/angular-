/**
 * Created by cd on 2017/8/21.
 */

require("restangular");
require("lodash");
var md = module.exports = angular.module('common.rest', ['restangular']);

/**
 * http restful错误码
 */
md.constant("HTTP_STATUS",
  function () {
    var status = {
      OK: {code: 200, text: 'OK', description: ''},
      CREATED: {code: 201, text: 'CREATED', description: ''},
      DELETED: {code: 204, text: 'DELETED', description: ''},
      NOT_MODIFIED: {code: 304, text: 'NOT MODIFIED', description: ''},
      BAD_REQUEST: {code: 400, text: 'BAD REQUEST', description: '不正确的请求信息'},
      METHOD_NOT_ALLOWED: {code: 405, text: 'METHOD NOT ALLOWED', description: '请求方法不支持'},
      UNSUPPORTED_MEDIA_TYPE: {code: 415, text: 'UNSUPPORTED MEDIA TYPE', description: '媒体类型不支持'},
      INTERNAL_SERVER_ERROR: {code: 500, text: 'INTERNAL SERVER_ERROR', description: '服务器内部错误'},
      PAGE_NOT_FOUND: {code: 404, text: 'PAGE NOT FOUND', description: '网络资源无法访问'},
      NOT_AUTHORIZED: {code: 401, text: 'NOT AUTHORIZED', description: '未经授权的访问'},
      FORBIDDEN: {code: 403, text: 'FORBIDDEN', description: '禁止访问'},
      UNPROCESSABLE_ENTITY: {code: 422, text: 'UNPROCESSABLE ENTITY', description: ''},
      SESSION_TIME_OUT: {code: 419, text: 'SESSION_TIME_OUT', description: '会话超时'}
    };
    status.CODES = {
      /**
       * 成功
       */
      SUCCESS: {
        200: status.OK,
        201: status.CREATED,
        204: status.DELETED,
        304: status.NOT_MODIFIED
      },
      /**
       * 程序错误或恶意攻击
       */
      PROGRAM_ERROR: {
        400: status.BAD_REQUEST,
        405: status.METHOD_NOT_ALLOWED,
        415: status.UNSUPPORTED_MEDIA_TYPE,
        500: status.INTERNAL_SERVER_ERROR
      },
      /**
       * 网络访问错误
       */
      NETWORK_ERROR: {
        404: status.PAGE_NOT_FOUND
      },
      /**
       * 权限错误
       * TODO 419未确定
       */
      AUTH_ERROR: {
        401: status.NOT_AUTHORIZED,
        403: status.FORBIDDEN,
        419: status.SESSION_TIME_OUT
      },
      /**
       * 正常交互错误
       */
      COMMUNICATION_ERROR: {
        422: status.UNPROCESSABLE_ENTITY
      }
    };
    return status;
  }()
);

/**
 * 全局http请求拦截
 */
md.factory('httpInterceptor', httpInterceptorFunction);

httpInterceptorFunction.$inject = ["$log", "$q", "$location", "HTTP_STATUS"/*,"alertService"*/];

function httpInterceptorFunction($log, $q, $location, HTTP_STATUS/*, alertService*/) {
  function errorMessage(rejection) {
    $log.info(JSON.stringify(rejection));
    var errorData = {};
    /*status;*/
    if (HTTP_STATUS.CODES.NETWORK_ERROR[rejection.status]) {
      errorData.msg = HTTP_STATUS.CODES.NETWORK_ERROR[rejection.status].description;
      errorData.verboseMsg = angular.copy(rejection.data);
    } else if (HTTP_STATUS.CODES.PROGRAM_ERROR[rejection.status]) { //500
      errorData.msg = HTTP_STATUS.CODES.PROGRAM_ERROR[rejection.status].description;
      errorData.verboseMsg = angular.copy(rejection.data);
      /*if (HTTP_STATUS.BAD_REQUEST === status) {
       verboseMsg = "";
       } else if (HTTP_STATUS.INTERNAL_SERVER_ERROR === status) {
       verboseMsg = "";
       } else if (HTTP_STATUS.METHOD_NOT_ALLOWED === status) {
       verboseMsg = "";
       } else if (HTTP_STATUS.UNSUPPORTED_MEDIA_TYPE === status) {
       verboseMsg = "";
       }*/
    } else if (HTTP_STATUS.CODES.AUTH_ERROR[rejection.status]) {
      errorData.msg = HTTP_STATUS.CODES.AUTH_ERROR[rejection.status].description;
      errorData.verboseMsg = angular.copy(rejection.data);
      /*if (HTTP_STATUS.FORBIDDEN === status) {
       verboseMsg = "";
       } else if (HTTP_STATUS.NOT_AUTHORIZED === status) {
       verboseMsg = "";
       } else if(HTTP_STATUS.SESSION_TIME_OUT === status) {
       verboseMsg = "";
       }*/
    } else if (HTTP_STATUS.CODES.COMMUNICATION_ERROR[rejection.status]) {
      // 不处理， 交互错误由后台构造
      if (!rejection.data || (!rejection.data.msg || !rejection.data.msg.length) && (!rejection.data.verboseMsg || !rejection.data.verboseMsg.length)) {
        errorData.msg = "422错误未返回错误信息";
      }
    } else {
      // 未定义的其他非常用错误
      errorData.msg = "网络连接失败";
      errorData.verboseMsg = JSON.stringify(rejection);
    }
    /**
     * 错误信息
     * @type {{msg: string, verboseMsg: string}}
     */
    rejection.data = _.assign(rejection.data || {}, errorData);
    /**
     * 控制自动错误提示：
     * showError: 'auto'，默认开启
     * showError: 'none'，关闭自动错误提示
     * showError: promise，等待promise后提示
     *
     * restangular设置：.withHttpConfig({showError: 'none'})
     * http设置：$http({showError: 'none'})
     *
     * promise使用举例：
     * var deffer = $q.defer();
     return authRestangular.one("login").withHttpConfig({showError: deffer.promise}).post("", credentials)
     .then(function (res) {
                    // 做成功该做的事
                }, function (err) {
                    // 先做失败该做的事，或者是补救措施、重新尝试、或者是应对处理
                    dealWithError().then(function(res){
                        // 可以在做成功后返回resolve，继续提示。返回之前的err
                        deffer.resolve(err);
                        // 也可以不再提示错误，比如因为补救成功
                        deffer.reject(res);
                    },function(err2){
                        // 可以在失败后返回resolve，继续提示。这里可以是err,也可以是进一步的错误err2。
                        // 如果dealWithError()也是一个http请求，可以忽略处理，因为又被自动提示了
                        // deffer.resolve(err2);
                        // 也可以不再提示错误，如果有可能需要的话！
                        deffer.reject(err2);
                    })
                });
     */
    //console.log(JSON.stringify(rejection));
    if (rejection.config.hasOwnProperty("showError")) {
      var showError = rejection.config["showError"];
      if (angular.isString(showError)) {
        if (showError != "none") {
          // alertService.showError(rejection);
        }
      } else {
        if (angular.isObject(showError) && showError.hasOwnProperty('then')) {
          showError.then(function (err) {
            // alertService.showError(err);
          });
        }
      }
    } else {
      // alertService.showError(rejection);
    }
  }
  
  
  var interceptor = {
    'request': function (config) {
      
      // 如果前后端分离服务造成跨域访问，添加认证Cookies
      if (process.env.SERVER_PATH && config.url.indexOf(process.env.SERVER_PATH) > -1) {
        config.withCredentials = true;
      }
      if (config.url.indexOf('http') == 0) {//以http开头则放过
        return config;
      }
      //TODO 静态资源简单处理 ->> 逻辑方案？以/api/开头的为向后端api请求
      var reg = /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot|html|json|js|css|less)$/;
      if (reg.test(config.url)) {
        //静态资源暂不处理
      } else {
        config.url = process.env.SERVER_PATH + '/api' + config.url;
      }
      // 成功的请求方法
      return config; // 或者 $q.when(config);
    },
    'response': function (response) {
      // 响应成功
      return response; // 或者 $q.when(config);
    },
    'requestError': function (rejection) {
      errorMessage(rejection);
      return $q.reject(rejection);
    },
    'responseError': function (rejection) {
      errorMessage(rejection);
      return $q.reject(rejection);
    }
  };
  return interceptor;
}

/**
 * http拦截器添加
 */
md.config(["$httpProvider", function ($httpProvider) {
  $httpProvider.interceptors.push('httpInterceptor');
}]);

/**
 * restangular全局配置
 */
md.config(restangularConfig);

restangularConfig.$inject = ["RestangularProvider"];

function restangularConfig(RestangularProvider) {
  // rest根地址bc
  // RestangularProvider.setBaseUrl(process.env.SERVER_PATH + '/api');
  // 从父级继承显示的字段
  //RestangularProvider.setExtraFields(['name']);
  // 对返回请求的拦截处理， 倒序执行
  RestangularProvider.setResponseExtractor(function (response, operation) {
    __DEBUG__ && console.log("执行" + operation);
    return response;
  });
  
  // 默认关闭缓存
  RestangularProvider.setDefaultHttpFields({cache: false});
  // 将其他方法都以post方式传递， 在 X-HTTP-Method-Override header里是真实方法
  //RestangularProvider.setMethodOverriders(["put", "patch"]);
  // 添加统一的后缀，可配合后端.do等设置方式
  //RestangularProvider.setRequestSuffix('.json');
  
  // 对发起请求的拦截处理，添加用户确认信息，顺序执行。
  RestangularProvider.addRequestInterceptor(function (element, operation, route, url) {
    //element["djxh"]
    return element;
  });
  
  // 错误拦截
  RestangularProvider.addErrorInterceptor(function (response, deferred, responseHandler) {
    //return false; // error handled
    return true; // error not handled
  });
}
