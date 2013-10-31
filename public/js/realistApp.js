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

    socket.on("list loaded", function(list) {
      $scope.items = list.items;
    });

    socket.on("item saved", function(grocery) {
      console.log("new item saved");
      $scope.items.push({
        "name" : grocery.name,
        "is_checked" : grocery.is_checked
      });
    });    

    $scope.addItem = function() {
      var item = {
        "name" : $scope.itemText,
        "is_checked" : false
      };
      $scope.items.push(item);
      $scope.itemText = '';
      console.log($scope.items);
      socket.emit('list changed', $scope.items);
    };

    $scope.toggleItem = function(index) {
      $scope.items[index]["is_checked"] = !($scope.items[index]["is_checked"]);
      // console.log($scope.items[index]["is_checked"]);
      // var item = {
      //   "name" : $scope.itemText,
      //   "is_checked" : false
      // };
      // $scope.items.push(item);
      // $scope.itemText = '';
      // // console.log(item);
      socket.emit('list changed', $scope.items);
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
