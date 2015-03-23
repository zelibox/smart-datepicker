angular.module('demoApp', ['smartDatepicker'])
    .controller('demoController', function ($scope) {
        $scope.date = new Date();
    });