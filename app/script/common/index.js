/**
 * Created by cd on 2017/8/21.
 */
module.exports = angular.module('common', [
  require('./cache').name,
  require('./rest').name
]);