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
            '   <div tabindex="0" ng-bind="changers.day.view()" ng-keydown="keydown($event)" ng-blur="blur()" ng-focus="focus(\'day\')" class="smart-datepicker-input smart-datepicker-input-day">дд</div>.' +
            '   <div tabindex="0" ng-bind="changers.month.view()" ng-keydown="keydown($event)" ng-blur="blur()" ng-focus="focus(\'month\')" class="smart-datepicker-input smart-datepicker-input-month">мм</div>.' +
            '   <div tabindex="0" ng-bind="changers.year.view()" ng-keydown="keydown($event)" ng-blur="blur()" ng-focus="focus(\'year\')" class="smart-datepicker-input smart-datepicker-input-year">гггг</div>,' +
            '   <div tabindex="0" ng-bind="changers.hour.view()" ng-keydown="keydown($event)" ng-blur="blur()" ng-focus="focus(\'hour\')" class="smart-datepicker-input smart-datepicker-input-hour">--</div>:' +
            '   <div tabindex="0" ng-bind="changers.minute.view()" ng-keydown="keydown($event)" ng-blur="blur()" ng-focus="focus(\'minute\')" class="smart-datepicker-input smart-datepicker-input-minute">--</div>' +
            '</div>',
            link: function ($scope, $element) {
                $scope.isFocus = false;
                var changer = null;
                $scope.changers = {
                    day: {
                        onUp: function () {
                            if ((this.current === null) || (this.current === 31)) {
                                this.current = 1;
                            } else {
                                this.current += 1;
                            }
                        },
                        onDown: function () {
                            if ((this.current === null) || (this.current === 1)) {
                                this.current = 31;
                            } else {
                                this.current -= 1;
                            }
                        },
                        onWrite: function(numeric, firstContact) {
                            // todo write
                            // todo focus
                        },
                        view: function () {
                            if (this.current) {
                                return String('00' + (this.current)).slice(-2)
                            }
                            return this.placeholder;
                        },
                        placeholder: 'дд',
                        current: null
                    },
                    month: {
                        onUp: function () {
                            if ((this.current === null) || (this.current === 12)) {
                                this.current = 1;
                            } else {
                                this.current += 1;
                            }
                        },
                        onDown: function () {
                            if ((this.current === null) || (this.current === 1)) {
                                this.current = 12;
                            } else {
                                this.current -= 1;
                            }
                        },
                        view: function () {
                            if (this.current) {
                                return String('00' + this.current).slice(-2);
                            }
                            return this.placeholder;
                        },
                        placeholder: 'мм',
                        current: 0
                    },
                    year: {
                        onUp: function () {
                            if (!this.current) {
                                var currentTime = new Date();
                                this.current = currentTime.getFullYear();
                            } else {
                                this.current += 1;
                            }
                        },
                        onDown: function () {
                            if (!this.current) {
                                var currentTime = new Date();
                                this.current = currentTime.getFullYear();
                            } else {
                                this.current -= 1;
                            }
                        },
                        view: function () {
                            if (this.current) {
                                return String('0000' + (this.current)).slice(-4)
                            }
                            return this.placeholder;
                        },
                        placeholder: 'гггг',
                        current: null
                    },
                    hour: {
                        onUp: function () {
                            if ((this.current === null) || (this.current === 23)) {
                                this.current = 0;
                            } else {
                                this.current += 1;
                            }
                        },
                        onDown: function () {
                            if ((this.current === null) || (this.current === 0)) {
                                this.current = 23;
                            } else {
                                this.current -= 1;
                            }
                        },
                        view: function () {
                            if (this.current !== null) {
                                return String('00' + (this.current)).slice(-2)
                            }
                            return this.placeholder;
                        },
                        placeholder: '--',
                        current: null
                    },
                    minute: {
                        onUp: function () {
                            if ((this.current === null) || (this.current === 59)) {
                                this.current = 0;
                            } else {
                                this.current += 1;
                            }
                        },
                        onDown: function () {
                            if ((this.current === null) || (this.current === 0)) {
                                this.current = 59;
                            } else {
                                this.current -= 1;
                            }
                        },
                        view: function () {
                            if (this.current !== null) {
                                return String('00' + (this.current)).slice(-2)
                            }
                            return this.placeholder;
                        },
                        placeholder: '--',
                        current: null
                    }
                };

                $scope.focus = function (typeChanger) {
                    $scope.isFocus = true;
                    changer = typeChanger;
                };
                $scope.blur = function () {
                    $scope.isFocus = false;
                    $scope.changer = null;
                };
                $scope.click = function () {
                    if (!$scope.isFocus) {
                        $element.find('.smart-datepicker-input-day').eq(0).focus();
                    }
                };
                $scope.keydown = function (event) {
                    switch (event.which) {
                        case 38: // up
                            $scope.changers[changer].onUp();
                            break;
                        case 40: // down
                            $scope.changers[changer].onDown();
                            break;
                        case 37: //left
                            $element.find('.smart-datepicker-input-' + changer).prev('.smart-datepicker-input').focus();
                            break;
                        case 39: //right
                            $element.find('.smart-datepicker-input-' + changer).next('.smart-datepicker-input').focus();
                            break;
                        case 46: // delete
                        case 8: // backspace
                            $scope.changers[changer].current = null;
                            break;
                        default:
                            var numeric = (function (code) {
                                var numericKeyCodes = [
                                    [96, 48],
                                    [97, 49],
                                    [98, 50],
                                    [99, 51],
                                    [100, 52],
                                    [101, 53],
                                    [102, 54],
                                    [103, 55],
                                    [104, 56],
                                    [105, 57]
                                ];
                                var numeric = false;
                                angular.forEach(numericKeyCodes, function (e, i) {
                                    if ((code === e[0]) || (code === e[1])) {
                                        numeric = i;
                                    }
                                });
                                return numeric;
                            })(event.which);
                            console.log(numeric);
                            break;
                    }
                };

            }
        }
    });