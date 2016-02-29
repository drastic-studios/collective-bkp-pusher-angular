(function () {
  'use strict';
  angular
    .module('app.common')
    .service('trackEvents', trackEvents);

  function trackEvents() {
    var service = {
      record: record
    };
    return service;

    function record(eventName) {
      console.log('-------------------');
      console.log('TRACKING - > IS NOT IMPLEMENTED, THIS IS TBD!!! ');
      console.log(eventName);
      console.log('-------------------');
      console.log('eventName -' + eventName);
    }
  }

})();
