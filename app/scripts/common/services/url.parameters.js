(function () {
  'use strict';

  angular
    .module('app.common')
    .provider('urlParameters', urlParameters);

  function urlParameters() {
    function splitURL(search) {
      return window.location.search.substr(1).split(search);
    }
    
    return {
      getParameters: function () {
        var params = {};
        var search;

        if (window.location.search.indexOf('&amp;') !== -1) {
          search = '&amp;';
        } else {
          search = '&';
        }
        angular.forEach(splitURL(search), function (item) {
          params[(item.split('=')[0])] = item.split('=')[1];
        });

        return params;
      },

      $get: function () {
        return {};
      }
    };
  }

})();
