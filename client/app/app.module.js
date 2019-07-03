/* globals Swal*/
'use strict';
angular.module('app.openrequirements', [
  'app.openrequirements.requirements',
  'app.openrequirements.specifications',
  'app.openrequirements.specification',
  'app.openrequirements.login',
  'app.openrequirements.register',
  'app.user.config',
  'pascalprecht.translate',
  'ngRoute'
])
  .run(function ($rootScope) {
    $rootScope.appContext = {};
    $rootScope.appContext.logged = false;
    $rootScope.specificationSelected = false;
  })
  .config(['$routeProvider', '$locationProvider',
    function ($routeProvider, $locationProvider) {
      // Système de routage
      $routeProvider
        .when('/specifications/', {
          templateUrl: 'app/components/specifications/specifications.html',
          controller: 'specificationsController'
        })
        .when('/specifications/:specificationId', {
          templateUrl: 'app/components/specification/specification.html',
          controller: 'specificationController'
        })
        .when('/login', {
          templateUrl: 'app/components/users/login/login.html',
          controller: 'loginController'
        })
        .when('/register', {
          templateUrl: 'app/components/users/register/register.html',
          controller: 'registerController'
        })
        .otherwise({ redirectTo: '/specifications/' });

      $locationProvider.html5Mode(true);
    }
  ])
  .directive("contenteditable", function () {
    return {
      restrict: "A",
      require: "ngModel",
      link: function (scope, element, attrs, ngModel) {

        function read() {
          ngModel.$setViewValue(element.html());
        }

        ngModel.$render = function () {
          element.html(ngModel.$viewValue || "");
        };

        element.bind("blur change", function () {
          scope.$apply(read);
        });
      }
    };
  })
  .service('APIInterceptor', function (userlocal, $rootScope) {
    var service = this;
    service.request = function (config) {
      var currentUser = userlocal.getToken()
      if (currentUser) {
        config.headers.authorization = currentUser;
      } else {
        $rootScope.appContext.logged = false;
      }
      return config;
    };
    service.responseError = function (response) {
      if (response.status === 401) {
        $rootScope.$broadcast('unauthorized');
      }
      if (response.status === 403) {
        console.log(response)
        Swal.fire({
          type: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
          footer: '403 error, contact your admin (' + response.statusText + ')'
        });
      }
      if (response.status === 500) {
        console.log(response)
        Swal.fire({
          type: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
          footer: '500 error, contact your admin (' + response.statusText + ')'
        });
      }
      return response;
    };

  })

  .config(function ($httpProvider, $translateProvider) {

    $httpProvider.interceptors.push('APIInterceptor');
    $translateProvider.useSanitizeValueStrategy(null);
    $translateProvider.useStaticFilesLoader({
      prefix: 'locales/locale-',
      suffix: '.json'
    });

    $translateProvider
      .fallbackLanguage('default')
      .preferredLanguage('default')
  })

  .controller('mainController', function ($scope, $rootScope, $location) {

    // update log state
    $scope.logged = $rootScope.appContext.logged;

    // check if specification is requested
    $scope.getUrlParams = () => {
      console.log("TCL: $scope.getUrlParams -> $location.search().document", $location.search().specification)
      if ($location.search().specification) {
        $rootScope.specificationSelected = true;
      } else {
        $rootScope.specificationSelected = false;
      }
    }

    $scope.$on('$locationChangeStart', (newUrl) => {
      $scope.getUrlParams();
    })
    $scope.$on('$locationChangeSuccess', (newUrl) => {
    })
    $scope.$on('loggedIn', (token) => {
      $scope.logged = true;
    });


  });
