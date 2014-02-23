// ------------------------------------------------------------------------------
/* App */
// ------------------------------------------------------------------------------

;(function() {

  'use strict';

  var RealistApp = angular.module('realistApp', [
    'ngRoute',
    'ngCookies',
    'ui.bootstrap',
    'socket-io',
    'realistApp.controllers'
  ]);

  /* Routes */
  RealistApp.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {templateUrl: 'partials/list.html', controller: 'ListController'});
    $routeProvider.when('/login', {templateUrl: 'partials/login.html', controller: 'LoginController'});
    $routeProvider.otherwise({redirectTo: '/'});
  }]);

  /* Serivce */
  // RealistApp.factory('myService', function($http) {
  //    return {
  //         getFoos: function() {
  //              //return the promise directly.
  //              return $http.get('/foos')
  //                        .then(function(result) {
  //                             //resolve the promise as the data
  //                             return result.data;
  //                         });
  //         }
  //    }
  // });

  RealistApp.factory('Auth', function($cookieStore, $http) {

    var user;

    return {
        setUser : function(aUser) {
            user = aUser;
        },
        isLoggedIn : function(){
            return (user) ? user : false;
        }
    }
  })

  RealistApp.run(function($rootScope, $location, Auth) {
      $rootScope.$on('$routeChangeSuccess', function() {
          // validateCookie($rootScope);
          if (!Auth.isLoggedIn()) {
              console.log('DENY');
              // event.preventDefault();
              $location.path('/login');
          }
          else {
              console.log('ALLOW');
              $location.path('/');
          }

      })
  });

})();

// ------------------------------------------------------------------------------
/* Controllers */
// ------------------------------------------------------------------------------

;(function() {

  'use strict';

  var RealistControllers = angular.module('realistApp.controllers', []);

  // angular.module('realistApp.controllers', [])
  RealistControllers.controller('LoginController', function($scope) {
    console.log("logggy");
    // $scope.foos = myService.getFoos().then(function(foos) {
    //     // $scope.foos = foos;
    //     console.log("durn", foos);
    // });
  });

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