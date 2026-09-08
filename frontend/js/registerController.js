app.controller("RegisterController", ["$scope", "$http", function($scope, $http) {

    $scope.registerData = {
        name: "",
        email: "",
        password: ""
    };

    $scope.registerMessage = "";

    $scope.register = function() {

        if ($scope.registerForm.$invalid) {
            return;
        }

        $scope.registerMessage = "";

        $http.post("http://localhost:5000/api/auth/register", {
            name: $scope.registerData.name,
            email: $scope.registerData.email,
            password: $scope.registerData.password
        })
        .then(function(response) {

            window.location.href = "login.html";

        })
        .catch(function(error) {

            if (error.data && error.data.message) {
                $scope.registerMessage = error.data.message;
            } else {
                $scope.registerMessage = "Unable to connect to the server.";
            }

        });
    };

}]);
