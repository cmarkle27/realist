'use strict';

var RealistApp = angular.module('realistApp', [
  'ui.bootstrap',
  'realistApp.services',
  'realistApp.controllers'
]);

  // Realist.config(['$routeProvider', function($routeProvider) {
  //   $routeProvider.when('/view1', {templateUrl: 'partials/partial1.html', controller: 'MyCtrl1'});
  //   $routeProvider.when('/view2', {templateUrl: 'partials/partial2.html', controller: 'MyCtrl2'});
  //   $routeProvider.otherwise({redirectTo: '/view1'});
  // }]);

/* Controllers */
(function() {
  var RealistControllers = angular.module('realistApp.controllers', []);
  RealistControllers.controller('ListController', function($scope, socket) {

    $scope.items = [];
    $scope.user = '0'; // user should be group instead

    socket.on("items loaded", function(groceries) {
      var items = [];
      groceries.forEach(function(grocery) {
        items.push({
          "title" : grocery.title,
          "checked" : grocery.checked
        });
      });
      $scope.items = items;
    });

    socket.on("item saved", function(grocery) {
      console.log("new item saved");
      $scope.items.push({
        "title" : grocery.title,
        "checked" : grocery.checked
      });
    });    

    $scope.addItem = function() {
      var item = {
        "title" : $scope.itemText,
        "checked" : false
      };
      $scope.items.push(item);
      $scope.itemText = '';
      console.log(item);
      socket.emit('item added', item);
    };

  });

})();


/* Services */
(function() {
  var RealistServices = angular.module('realistApp.services', []);
  RealistServices.factory('socket', function($rootScope) {
    var socket = io.connect();
    return {
      on: function(eventName, callback) {
        socket.on(eventName, function() {
          var args = arguments;
          $rootScope.$apply(function() {
            callback.apply(socket, args);
          });
        });
      },
      emit: function(eventName, data, callback) {
        socket.emit(eventName, data, function() {
          var args = arguments;
          $rootScope.$apply(function() {
            if (callback) {
              callback.apply(socket, args);
            }
          });
        });
      }
    };
  });

})();
