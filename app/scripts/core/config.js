(function () {
  'use strict';

  angular
    .module('app.core')
    .config(configure);

  configure.$inject = ['$routeProvider', '$provide', 'urlParametersProvider'];

  function configure($routeProvider, $provide, urlParametersProvider) {
    var parameters = urlParametersProvider.getParameters();

    $routeProvider
      .when('/', {
      templateUrl: 'scripts/core/main.html'
    })
      .when('/login', {
      templateUrl: 'scripts/admin/login.html',
      controller: 'LoginController',
      controllerAs: 'vm'
    })
      .otherwise({
      redirectTo: '/'
    });

    $provide.constant('CONFIG', {
      'someConfigObject': {}
    });
  }

  // use this as an alternative aproach to bootstraping the app withing the
  // html element, <body ng-app="app" ng-strict-di>
  // angular.element(document).ready(function () {
  //   angular.bootstrap(document.getElementsByTagName('body')[0], ['app'], {
  //     'strictDi': true 
  //   });
  // });
})();
