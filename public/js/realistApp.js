// ------------------------------------------------------------------------------
/* App */
// ------------------------------------------------------------------------------

// var ModalInstanceCtrl = function($scope, $modalInstance, email) {

//   $scope.thing = email;
//   $scope.email = email;

//   $scope.login = function() {
//     // console.log(email);
//     $scope.thing = $scope.email;
//     $modalInstance.close($scope.thing, $scope.email);
//   };

//   $scope.cancel = function() {
//     $modalInstance.dismiss('cancel');
//   };
// }; 

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
    // $routeProvider.when('/login', {templateUrl: 'partials/login.html', controller: 'LoginController'});
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
        isLoggedIn : function() {
            return (user) ? user : false;
        }
    }
  })

  RealistApp.run(function($rootScope, $modal, $log, Auth, socket) { // $location
    $rootScope.$on('$routeChangeSuccess', function() {

      $rootScope.user = {
        email: 'name',
        password: null
      };

      if (!Auth.isLoggedIn()) {
        console.log('DENY');
        // event.preventDefault();
        // $location.path('/login');

        var modalInstance = $modal.open({
          templateUrl: 'partials/myModel.html',
          keyboard: false,
          backdrop: 'static',
          controller: function ($rootScope, $modalInstance, $log, user) {
            $rootScope.user = user;
            $rootScope.submit = function () {
              $log.log('Submiting user info.');
              Auth.setUser(user);
              $modalInstance.dismiss('cancel');
              socket.emit('ready');
            }
            $rootScope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
          },
          resolve: {
            user: function () {
              return $rootScope.user;
            }
          }             
        });
      } else {
        console.log('ALLOW');
        // $location.path('/');
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
  // RealistControllers.controller('LoginController', function($scope) {
  //   console.log("logggy");
    // $scope.foos = myService.getFoos().then(function(foos) {
    //     // $scope.foos = foos;
    //     console.log("durn", foos);
    // });

    // $scope.lastVal = $cookieStore.get('tab');

    // $scope.changeTab = function(tabName){
    //     $scope.lastVal = tabName;
    //     $cookieStore.put('tab', tabName);
    // };


  // });


  // RealistControllers.controller('ModalInstanceCtrl', function($scope, $modalInstance) {
// var ModalInstanceCtrl = function ($scope, $modalInstance) {

//     // $scope.items = items;
//     // $scope.selected = {
//     //   item: $scope.items[0]
//     // };

//     $scope.ok = function () {
//       // $modalInstance.close($scope.selected.item);
//     };

//     $scope.cancel = function () {
//       $modalInstance.dismiss('cancel');
//     };
//   };  

  RealistControllers.controller('ListController', function($scope, socket) {

    // $scope.user = {
    //   email: 'name',
    //   password: null
    // };

    // if (!Auth.isLoggedIn()) {
    //   console.log('DENY');
    //   // event.preventDefault();
    //   // $location.path('/login');

    //   var modalInstance = $modal.open({
    //     templateUrl: 'partials/myModel.html',
    //     keyboard: false,
    //     backdrop: 'static',
    //     controller: function ($scope, $modalInstance, $log, user) {
    //       $scope.user = user;
    //       $scope.submit = function () {
    //         $log.log('Submiting user info.');
    //         $log.log(user);
    //         $modalInstance.dismiss('cancel');
    //       }
    //       $scope.cancel = function () {
    //           $modalInstance.dismiss('cancel');
    //       };
    //     },
    //     resolve: {
    //       user: function () {
    //         return $scope.user;
    //       }
    //     }             
    //   });
    // } else {
    //   console.log('ALLOW');
    //   // $location.path('/');
    // }




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