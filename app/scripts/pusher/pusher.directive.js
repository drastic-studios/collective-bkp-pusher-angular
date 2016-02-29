(function () {
  'use strict';

  angular
    .module('app.pusher')
    .directive('pusher', pusher);

  function pusher() {
    return {
      restrict: 'E',
      scope: {
        push: '='
      },
      controller: 'PusherCtrl',
      controllerAs: 'vm',
      templateUrl: 'scripts/pusher/pusher.html'
    };
  }

  angular
    .module('app.pusher')
    .controller('PusherCtrl', PusherCtrl);

  PusherCtrl.$inject = ['$scope', '$pusher'];

  function PusherCtrl($scope, $pusher) {
    var vm = this;
    vm.records = [];
    var client = new Pusher('1f4112082637b5a39e20');
    var pusher = $pusher(client);
    pusher.subscribe('twitter_streaming_channel');
    pusher.bind('hashtag_cbpk_posted', function (data) {
      console.log(data);
      vm.records.unshift(data.tweet);
    });
  }
})();
