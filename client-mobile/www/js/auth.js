angular.module('Pronto.auth', [])

.factory('AuthFactory', function ($http, $state, $window, $rootScope, SocketFactory) {
  var AuthFact = {};

  AuthFact.addUser = function (userObject) {
    return $http({
      method: 'POST',
      url: $rootScope.host + '/signup',
      data: userObject
    });
  };

  AuthFact.checkUser = function (userObject) {
    return $http({
      method: 'POST',
      url: $rootScope.host + '/login',
      data: userObject
    }).then(function (res) {
      this.socket = SocketFactory.connect();
      return res;
    }.bind(this));
  };

  AuthFact.logOut = function () {
    $http({
      method: 'POST',
      url: $rootScope.host + '/logout'
    }).then(function (res) {
      $window.localStorage.removeItem('com.Pronto');
      $state.go('login');
      // delete $rootScope.chatRoomId;
      // delete $rootScope.user;
      this.socket.disconnect();
    }.bind(this))
    .catch(function (err) {
      console.log(err);
    });
  };

  AuthFact.isAuth = function () {
    return $window.localStorage.getItem('com.Pronto');
  };

  return AuthFact;
})

.controller('AuthCtrl', function ($scope, $rootScope, $state, $window, AuthFactory) {
  $scope.addUser = function (username, password) {
    var userObject = {
      username: username,
      password: password
    };
    AuthFactory.addUser(userObject)
    .then(function (res) {
      $scope.checkUser(username, password);
    })
    .catch(function (err) {
      throw err;
    });
  };
  $scope.checkUser = function (username, password) {
    var userObject = {
      username: username,
      password: password
    };

    AuthFactory.checkUser(userObject).then(function (res) {
      $window.localStorage.setItem('com.Pronto', JSON.stringify(res.data));
      $rootScope.user = res.data;
      $rootScope.user.coords = $rootScope.coords;
      $state.go('load');
    });
  };


  $scope.logOut = function () {
    AuthFactory.logOut();
  };
});

