// 'use strict';

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

    socket.on('send:name', function (data) {
      $scope.name = data.name;
    });

    $scope.items = [
      {text:'feed1', done:true},
      {text:'feed2', done:true},
      {text:'other feed', done:true},
      {text:'more feed', done:true},
      {text:'another feed', done:false}
    ];

    $scope.addItem = function() {
      $scope.items.push({text:$scope.todoText, done:false});
      $scope.todoText = '';
      console.log($scope.items);
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
        })
      }
    };
  });  

})();
