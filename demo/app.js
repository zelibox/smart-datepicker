angular.module('demoApp', ['smartDatepicker'])
    .controller('demoController', function ($scope) {
        $scope.date1 = new Date();
    });