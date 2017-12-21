/**
 * Created by Bll on 2017/12/12.
 */
'use strict';

module.exports = FirstController;
FirstController.$inject = ['$scope', 'Restangular', '$state', '$stateParams'];
function FirstController($scope) {
  $scope.title = '';
  $scope.turn = function (msg) {
    $scope.title = msg;
  }
}

