angular.module('app.openrequirements.register', [])
  .controller('registerController', function ($scope, userconf, $location) {

    $scope.submit = (user) => {
      userconf.register(user)
        .then(function (userObject) {
          console.log(userObject);
          Swal.fire({
            title: 'Sweet!',
            text: 'We have sent you an email to confirm your registration.',
            imageUrl: 'images/email.svg',
            imageWidth: 400,
            imageHeight: 200,
            imageAlt: 'email image'
          }).then((result) => {
            console.log(result);
            mixpanel.people.set({
              "$email": user.email,    // only special properties need the $
              "$created": new Date(),
              "$last_login": new Date(),
            });
            $location.path('/login');
            $scope.$apply();
          })
        })
        .catch(err => console.error(err))

    }
  })
  .directive('match', function () {
    return {
      restrict: 'A',
      controller: function ($scope) {

        $scope.confirmed = false;

        $scope.doConfirm = function (values) {
          values.forEach((ele) => {
            if (ele === $scope.confirm) {
              $scope.confirmed = true;
            } else {
              $scope.confirmed = false;
            }
          });
        }
      },
      link: function ($scope, element, attrs) {
        attrs.$observe('match', function () {
          $scope.matches = JSON.parse(attrs.match);
          $scope.doConfirm($scope.matches);
        });
        $scope.$watch('confirm', function () {
          $scope.matches = JSON.parse(attrs.match);
          $scope.doConfirm($scope.matches);
        })

      }
    }
  });