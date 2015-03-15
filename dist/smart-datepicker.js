angular.module('smartDatepicker', [])
    .directive('smartDatepicker', function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                min: '=',
                max: '=',
                type: '@',
                model: '='
            },
            template: '<div ng-click="click()" ng-class="{\'smart-datepicker-focus\': isFocus}" class="smart-datepicker">' +
            '   <div tabindex="0" ng-blur="blur()" ng-focus="focus()" class="smart-datepicker-input smart-datepicker-input-day">дд</div>.' +
            '   <div tabindex="0" ng-blur="blur()" ng-focus="focus()" class="smart-datepicker-input smart-datepicker-input-month">мм</div>.' +
            '   <div tabindex="0" ng-blur="blur()" ng-focus="focus()" class="smart-datepicker-input smart-datepicker-input-year">гггг</div>,' +
            '   <div tabindex="0" ng-blur="blur()" ng-focus="focus()" class="smart-datepicker-input smart-datepicker-input-hour">--</div>:' +
            '   <div tabindex="0" ng-blur="blur()" ng-focus="focus()" class="smart-datepicker-input smart-datepicker-input-minute">--</div>' +
            '</div>',
            link: function ($scope, $element) {
                $scope.isFocus = false;
                $scope.focus = function () {
                    $scope.isFocus = true;
                };
                $scope.blur = function () {
                    $scope.isFocus = false;
                };
                $scope.click = function () {
                    if(!$scope.isFocus) {
                        ///console.log(angular.element($element).find('.smart-datepicker-input-day').eq(0));
                       $element.find('.smart-datepicker-input-day').eq(0).focus();
                    }
                };


                /*console.log( $element.find('.smart-datepicker-input').size());
                $element.find('.smart-datepicker-input').on('focusin', function() {
                    console.log('focusin');
                    $element.addClass('smart-datepicker-focus');
                });
                $element.find('.smart-datepicker-input').on('focusout', function() {
                    console.log('focusout');
                    $element.removeClass('smart-datepicker-focus');
                })*/
            }
        }
    });