'use strict';

/* Config */
var RealistApp = angular.module('realistApp', [
  'ngRoute',
  // 'ngCookies',
  'ngCookies',
  'ui.bootstrap',
  'socket-io',
  'realistApp.controllers'
]);

/* Routes */
RealistApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {templateUrl: 'partials/list.html', controller: 'ListController'});
  $routeProvider.otherwise({redirectTo: '/'});
}]);

/* Serivce */
RealistApp.factory('myService', function($http) {
   return {
        getFoos: function() {
             //return the promise directly.
             return $http.get('/foos')
                       .then(function(result) {
                            //resolve the promise as the data
                            return result.data;
                        });
        }
   }
});

RealistApp.factory('validateCookie', function($cookieStore, $http){
    return function(scope) {
        // Validate the cookie here...
        console.log("sbbasd");
    }
})

RealistApp.run(function($rootScope, validateCookie) {
    $rootScope.$on('$routeChangeSuccess', function () {
        validateCookie($rootScope);
    })
})

//////////////////////////////////////////

var myList = {
  items: [],
  addItem: function($scope) {
      var item = {
        "name" : $scope.itemText,
        "is_checked" : false
      };
      this.items.push(item);
      $scope.itemText = '';
      socket.emit('list changed', $scope.items);
    }
}




//////////////////////////////////////////

/* Controllers */
;(function() {

  'use strict';

  angular.module('realistApp.controllers', []).controller('ListController', function($scope, socket, myService) {

    // check login first
    $scope.foos = myService.getFoos().then(function(foos) {
        // $scope.foos = foos;
        console.log("durn", foos);
    });


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

    $scope.clearAll = function() {
      $scope.items = [];
      socket.emit('list changed', $scope.items);
    };

    $scope.clearChecked = function() {
      for (var i = $scope.items.length - 1; i >= 0; i--) {
        if ($scope.items[i].is_checked) {
          $scope.items.splice(i, 1);
        } 
      }
      socket.emit('list changed', $scope.items);
    };

    socket.on("list loaded", function(list) {
      if (list.items) {
        $scope.items = list.items;
      }
    });

    socket.on("list saved", function(items) {
      $scope.items = items;
    });

  });

})();