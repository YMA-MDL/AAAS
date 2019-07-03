angular.module('app.openrequirements.login', [
  'app.user.config'
]).controller('loginController', function ($rootScope, $scope, userconf, userlocal, $location) {
  console.info("loginController")
  $scope.submit = (email, password) => {
    console.log("TCL: $scope.submit -> email,password", email, password)
    userconf.login(email, password)
      .then(function (userObject) {
        console.log("TCL: $scope.submit -> userObject", userObject)
        let userData = userObject.data
        if (!userData.isError && userData.token) {
          userlocal.setToken(userData.token);
          $rootScope.appContext.logged = true;
          $rootScope.appContext.user = userData;
          mixpanel.identify($rootScope.appContext.user._id);
          mixpanel.people.set({
            "$email": email,
            "$last_login": new Date()
          });
          // test if spec is defined in the url

          $location.path('/specification');
          //     $location.search('specification', specification._id);
        } else if (!userData.dbError) {
          Notification.error({
            message: "Failed Login! Please try again..."
          });
        } else {
          Notification.error({
            message: "Database not available"
          });
        }
      })
    const token = email + password;

    $scope.$emit("loggedIn", token);
  }
});      
