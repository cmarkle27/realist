// routes



'use strict';

var RealistApp = angular.module('realistApp', [
  'ngRoute',
  'ui.bootstrap',
  'socket-io',
  'realistApp.controllers'
]);


RealistApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {templateUrl: 'partials/list.html', controller: 'ListController'});
  $routeProvider.otherwise({redirectTo: '/'});
}]);

/* Controllers */
// (function() {
  var RealistControllers = angular.module('realistApp.controllers', []);
  RealistControllers.controller('ListController', function($scope, socket) {

    $scope.items = [];

    $scope.addItem = function() {
      var item = {
        "name" : $scope.itemText,
        "is_checked" : false
      };
      $scope.items.push(item);
      $scope.itemText = '';
      socket.emit('list changed', $scope.items);
    };

    $scope.toggleItem = function(index) {
      $scope.items[index].is_checked = !($scope.items[index].is_checked);
      socket.emit('list changed', $scope.items);
    };

    socket.on("list loaded", function(list) {
      console.log(list);
      if (list.items) {
        $scope.items = list.items;
      }
    });

    socket.on("list saved", function(items) {
      $scope.items = items;
    });

  });

// })();