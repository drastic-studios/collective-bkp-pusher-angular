(function () {
  'use strict';

  angular
    .module('app.core')
    .controller('MainCtrl', MainCtrl);

  MainCtrl.$inject = ['$scope'];

  function MainCtrl($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  }
})();
