app.controller("LoginController", ["$scope", "$http", function($scope, $http) {

    $scope.loginData = {
        email: "",
        password: "",
        remember: false
    };

    $scope.loginMessage = "";

    $scope.login = function() {

        if ($scope.loginForm.$invalid) {
            return;
        }

        $scope.loginMessage = "";

        $http.post("http://localhost:5000/api/auth/login", {
            email: $scope.loginData.email,
            password: $scope.loginData.password
        })
        .then(function(response) {

            localStorage.setItem(
                "smartInventoryUser",
                JSON.stringify(response.data.user)
            );

            window.location.href = "index.html";

        })
        .catch(function(error) {

            if (error.data && error.data.message) {
                $scope.loginMessage = error.data.message;
            } else {
                $scope.loginMessage = "Unable to connect to the server.";
            }

        });
    };

}]);
