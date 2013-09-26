'use strict';

var Realist = angular.module('realistApp', ['ui.bootstrap']);
  // .config(['$routeProvider', function($routeProvider) {
  //   $routeProvider.when('/view1', {templateUrl: 'partials/partial1.html', controller: 'MyCtrl1'});
  //   $routeProvider.when('/view2', {templateUrl: 'partials/partial2.html', controller: 'MyCtrl2'});
  //   $routeProvider.otherwise({redirectTo: '/view1'});
  // }]);

Realist.controller('ListController',['$scope', function($scope) {
  
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
  };  

}]);
