/* global angular, localStorage */
angular.module('app.user.config', [])
  .service('userconf', function ($http, userlocal) {
    const userconf = this;
    const server = 'http://localhost:5050/api/';
    const URLS = {
      users: 'users/',
    };


    userconf.login = function (email, password) {
      return $http.post(`${server}${URLS.users}signin`, { email, password });
    };

    userconf.isLoggedIn = function(){
      if (userlocal.getToken()){
        return true;
      } else {
        return false;
      }
    }

    userconf.register = function (newUser) { // contains email, username, password
      return $http.post(`${server}${URLS.users}signup`, newUser);
    };

    userconf.testLoggedState = () => $http.get(`${URLS.users}test`);

    userconf.logout = function () {
      return userlocal.setToken();
    };

    userconf.updateUser = (user) => {
      return $http.put(`${URLS.users}updateUser`, user);
    };

  })
  .service('userlocal', function ($window) {
    const userlocal = this;
    userlocal.setToken = function (token) {
      if (token){
        $window.localStorage.setItem('jwtToken',token);
      }else {
        $window.localStorage.removeItem('jwtToken');
      }
    };
    
    userlocal.getToken = function () {
      return $window.localStorage.jwtToken;
    };
  });
