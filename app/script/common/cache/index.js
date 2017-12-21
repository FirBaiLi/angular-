/**
 * @author : Bang
 * @date : 2016/8/24
 * @module :
 * @description :
 */
require("angular-cache");
var store = require("store-js");
var md = module.exports = angular.module("common.cache", ['angular-cache', require("../rest").name]);
/**
 * 缓存全局配置
 */
md.config(["CacheFactoryProvider", function (CacheFactoryProvider) {
  angular.extend(CacheFactoryProvider.defaults, {
    // 暂时没有需要统一设置的！
    //maxAge: 3600000,
    //deleteOnExpire: 'aggressive'
  });
}]);

/**
 * 使用举例
 * md.service('BookService', function (CacheFactory, $http) {
    // Check to make sure the cache doesn't already exist
    if (!CacheFactory.get('bookCache')) {
        // or CacheFactory('bookCache', { ... });
        CacheFactory.createCache('bookCache', {
            deleteOnExpire: 'aggressive',
            recycleFreq: 60000
        });
    }

    var bookCache = CacheFactory.get('bookCache');

    profileCache.put('/profiles/34', {
        name: 'John',
        skills: ['programming', 'piano']
    });

    profileCache.put('/profiles/22', {
        name: 'Sally',
        skills: ['marketing', 'climbing', 'painting']
    });

    return {
        findBookById: function (id) {
            return $http.get('/api/books/' + id, {cache: bookCache});
        }
    };
});
 */


/**
 * 运行系统使用配置
 */
md.run(cacheRunFunction);

cacheRunFunction.$inject = ["$http", "$injector", "CacheFactory"/*, "formCache"*/];

function cacheRunFunction($http, $injector, CacheFactory/*, formCache*/) {
  /**
   * 替换http默认缓存
   */
  $http.defaults.cache = CacheFactory('httpDefaultCache', {
    // 30分钟内http缓存有效，否则过期
    maxAge: 30 * 60 * 1000,
    // 每1小时自动清理所有，以免访问太多缓存占用太多
    cacheFlushInterval: 60 * 60 * 1000,
    // 轮循检查过期，1分钟
    recycleFreq: 60 * 1000,
    // 过期直接清理
    deleteOnExpire: 'aggressive'/*,
     // 过期不报错，这里为特殊处理。 不处理，浏览器默认重新获取
     onExpire: function (key, value) {
     var _this = this; // "this" is the cache in which the item expired
     angular.injector(['ng']).get('$http').get(key).success(function (data) {
     _this.put(key, data);
     });
     }*/
  });
  
  /**
   * 设置form表单缓存服务
   */
/*  formCache.setCacheGenerator(function (formName) {
    var localCacheService = $injector.get("localCacheService");
    return localCacheService;
  });*/
  
  /**
   * TODO key 生成时带上表单关键KEY
   */
/*  formCache.setKeyGenerator(function (formName) {
    var session = $injector.get("session");
    if (session && session.id) {
      return session.id + "_" + formName;
    } else {
      //无需登录的表单记录，应该不会用到
      return formName;
    }
  });*/
}

/**
 * 专处理会话数据缓存
 * 使用sessionStorage缓存。
 */
md.service('sessionCacheService', sessionCacheServiceFunction);

sessionCacheServiceFunction.$inject = ["CacheFactory"];

function sessionCacheServiceFunction(CacheFactory) {
  
  var sessionStorageCache = CacheFactory('sessionStorageCache', {
    // 不设置过期时间
    //maxAge: 30 * 60 * 1000,
    // 超时即删除
    deleteOnExpire: 'aggressive',
    // 使用sessionStorage缓存
    storageMode: 'sessionStorage'
  });
  
  if (!window.sessionStorage) {
    __DEBUG__ && console.log("sessionStorage不能用？请问您用的是什么破浏览器？暂时不提供替换方法，请将错误信息反馈");
  }
  
  return sessionStorageCache;
}

/**
 * 专处理表单缓存
 * 使用localStorage缓存。
 * store.js解决localStorage在各种浏览器中的支持问题，并将数据都以json object string的方式存储
 * 当用户使用私有模式时，调用远程接口实现缓存
 */
md.service('localCacheService', localCacheServiceFunction);

localCacheServiceFunction.$inject = ["CacheFactory", "remoteCacheService"];

function localCacheServiceFunction(CacheFactory, remoteCacheService) {
  
  var storeJsToStandard = {
    getItem: store.get,
    setItem: store.set,
    removeItem: store.remove
  };
  
  var remoteToStandard = {
    getItem: remoteCacheService.get,
    setItem: remoteCacheService.set,
    removeItem: remoteCacheService.remove
  };
  
  var options = {
    // 表单数据过期时间2天=48 * 60 * 60 * 1000
    maxAge: 48 * 60 * 60 * 1000,
    onExpire: function (key, value, done) {
      __DEBUG__ && console.log("过期的local缓存:key(" + key + ")" + " value(" + value + ")");
      return done;
    },
    // 过期不直接删除，在下次被调用时删除并返回undefined
    deleteOnExpire: 'passive',
    // 存储方式 localStorage
    storageMode: 'localStorage',
    // 轮循检查过期的间隔时间，设置10分钟检查一次=10 * 60 * 1000，由于表单数据保存时间较长。
    recycleFreq: 10 * 60 * 1000,
    // 默认使用 store.js 实现localStorage存储方式
    storageImpl: storeJsToStandard
  };
  
  // 当localStorage不能使用时，使用远程服务器缓存
  if (!window.localStorage) {
    __DEBUG__ && console.log("您的浏览器不支持localStorage，没关系，我们有准备！");
    if (!store.enabled) {
      __DEBUG__ && console.log("很抱歉，您的浏览器真的不能支持localStorage，或者您使用了隐私模式！请关闭隐私模式，或者升级为新版现代浏览器……^_^ 其实我们还有办法");
      // 使用远程服务实现localStorage存储方式
      options.storageImpl = remoteToStandard;
    }
  }
  var localStorageCache = CacheFactory('localStorageCache', options);
  
  return localStorageCache;
}

/**
 * 专处理本地设置的缓存
 * 其实现与表单缓存一致，区别为配置
 */
md.service('configCacheService', configCacheServiceFunction);

configCacheServiceFunction.$inject = ["CacheFactory", "remoteCacheService"];

function configCacheServiceFunction(CacheFactory, remoteCacheService) {
  
  var storeJsToStandard = {
    getItem: store.get,
    setItem: store.set,
    removeItem: store.remove
  };
  
  var remoteToStandard = {
    getItem: remoteCacheService.get,
    setItem: remoteCacheService.set,
    removeItem: remoteCacheService.remove
  };
  
  var options = {
    // 存储方式 localStorage
    storageMode: 'localStorage',
    // 默认使用 store.js 实现localStorage存储方式
    storageImpl: storeJsToStandard
  };
  
  // 当localStorage不能使用时，使用远程服务器缓存
  if (!window.localStorage) {
    __DEBUG__ && console.log("您的浏览器不支持localStorage，没关系，我们有准备！");
    if (!store.enabled) {
      __DEBUG__ && console.log("很抱歉，您的浏览器真的不能支持localStorage，或者您使用了隐私模式！请关闭隐私模式，或者升级为新版现代浏览器……^_^ 其实我们还有办法");
      // 使用远程服务实现localStorage存储方式
      options.storageImpl = remoteToStandard;
    }
  }
  var configCacheService = CacheFactory('configCacheService', options);
  
  return configCacheService;
}

/**
 * 服务端实现缓存
 * api/sb/sbb/cache
 */
md.service("remoteCacheService", remoteCacheServiceFunction);

remoteCacheServiceFunction.$inject = ['sbbCacheRestangular'];

function remoteCacheServiceFunction(sbbCacheRestangular) {
  var remoteCacheService = {};
  remoteCacheService.get = function (key) {
    __DEBUG__ && console.log("调用远程GET CACHE");
    sbbCacheRestangular.get({key: key});
  };
  remoteCacheService.set = function (key, value) {
    __DEBUG__ && console.log("调用远程SET CACHE");
    sbbCacheRestangular.post({key: key, value: value});
  };
  remoteCacheService.remove = function (key) {
    __DEBUG__ && console.log("调用远程REMOVE CACHE");
    sbbCacheRestangular.delete({key: key});
  };
  return remoteCacheService;
}

/**
 * sbb cache rest
 */
md.factory("sbbCacheRestangular", ['Restangular', function (Restangular) {
  return Restangular.withConfig(function (RestangularConfigurer) {
    RestangularConfigurer.setBaseUrl(process.env.SERVER_PATH + "/api/sb/sbb/cache");
  });
}]);
