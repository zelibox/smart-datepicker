angular.module('smartDatepicker', [])
    .directive('smartDatepicker', function ($interval) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                min: '=',
                max: '=',
                step: '=',
                model: '='
            },
            template: '<div ng-focus="focus()" ng-blur="blur()" ng-keydown="keydown($event)" tabindex="0" ng-class="{\'smart-datepicker-empty\': isEmpty()}" class="smart-datepicker">' +
            '   <div class="smart-datepicker-changer {{ \'smart-datepicker-changer-\' + changer }}"  ' +
            '        ng-class="{\'smart-datepicker-changer-focus\' :isFocusChanger(changer)}" ' +
            '        ng-repeat="changer in activeChangers">' +
            '       <span ng-if="changers[changer].before" ng-bind="changers[changer].before"></span>' +
            '       <div ng-bind="changers[changer].view()"' +
            '            ng-mousedown="setFocusChanger(changer)"></div>' +
            '   </div>' +
            '   <div class="smart-datepicker-switch">' +
            '       <div ng-mousedown="increment()" ng-mouseleave="stopIncrement()" ng-mouseup="stopIncrement()" class="smart-datepicker-increment"></div>' +
            '       <div ng-mousedown="decrement()" ng-mouseleave="stopDecrement()" ng-mouseup="stopDecrement()" class="smart-datepicker-decrement"></div>' +
            '   </div>' +
            '   <div ng-click="clear()" class="smart-datepicker-clear">&times;</div>' +
            '</div>',
            link: function ($scope) {
                var step = 60;
                $scope.$watch('step', function (newStep) {
                    $scope.activeChangers = ['day', 'month', 'year'];
                    /*step = (angular.isNumber(newStep) && (newStep >= 0.001)) ? newStep : 86400;
                    var c = Math.floor(newStep);
                    var d = (newStep - Math.floor(c)).toFixed(3);
                    if(c % 3600) {
                        $scope.activeChangers.push('hour');
                        $scope.activeChangers.push('minute');
                    } else
                    if (d * 1) {
                        $scope.activeChangers.push('hour');
                        $scope.activeChangers.push('minute');
                        $scope.activeChangers.push('second');
                        $scope.activeChangers.push('millisecond')
                    } else if (c % 60) {
                        $scope.activeChangers.push('hour');
                        $scope.activeChangers.push('minute');
                        $scope.activeChangers.push('second')
                    }*/

                });
                var isFocus = false;
                $scope.activeChangers = [
                    'day',
                    'month',
                    'year',
                    'hour',
                    'minute',
                    'second',
                    'millisecond'
                ];

                var changer = null;
                var firstContact = true;
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
                        onWrite: function (numeric) {
                            if (!numeric && firstContact) {
                                return true;
                            }
                            if (firstContact) {
                                this.current = numeric;
                                if (numeric > 3) {
                                    return false;
                                }
                            } else {
                                if ((this.current + '' + numeric) > 31) {
                                    this.current = 31;
                                } else {
                                    this.current = Number(this.current + '' + numeric);
                                }
                                return false;
                            }
                            firstContact = false;
                            return true;
                        },
                        view: function () {
                            if (this.current) {
                                return String('00' + (this.current)).slice(-2)
                            }
                            return this.placeholder;
                        },
                        before: null,
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
                        onWrite: function (numeric) {
                            if (!numeric && firstContact) {
                                return true;
                            }
                            if (firstContact) {
                                this.current = numeric;
                                if (numeric > 1) {
                                    return false;
                                }
                            } else {
                                if ((this.current + '' + numeric) > 12) {
                                    this.current = 12;
                                } else {
                                    this.current = Number(this.current + '' + numeric);
                                }
                                return false;
                            }
                            firstContact = false;
                            return true;
                        },
                        view: function () {
                            if (this.current) {
                                return String('00' + this.current).slice(-2);
                            }
                            return this.placeholder;
                        },
                        before: '.',
                        placeholder: 'мм',
                        current: null
                    },
                    year: {
                        onUp: function () {
                            if (!this.current || ((this.current + 1) >= 9999)) {
                                var currentTime = new Date();
                                this.current = currentTime.getFullYear();
                            } else {
                                this.current += 1;
                            }
                        },
                        onDown: function () {
                            if (!this.current || ((this.current - 1) <= 0)) {
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
                        onWrite: function (numeric) {
                            if (!numeric && firstContact) {
                                return true;
                            }
                            if (firstContact) {
                                this.current = numeric;
                            } else {
                                if ((this.current + '' + numeric) > 9999) {
                                    this.current = 9999;
                                } else {
                                    this.current = Number(this.current + '' + numeric);
                                }
                                if (this.current > 999) {
                                    return false;
                                }
                            }
                            firstContact = false;
                            return true;
                        },
                        before: '.',
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
                        onWrite: function (numeric) {
                            if (firstContact) {
                                this.current = numeric;
                                if (numeric > 2) {
                                    return false;
                                }
                            } else {
                                if ((this.current + '' + numeric) > 23) {
                                    this.current = 23;
                                } else {
                                    this.current = Number(this.current + '' + numeric);
                                }
                                return false;
                            }
                            firstContact = false;
                            return true;
                        },
                        before: null,
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
                        onWrite: function (numeric) {
                            if (firstContact) {
                                this.current = numeric;
                                if (numeric > 5) {
                                    return false;
                                }
                            } else {
                                if ((this.current + '' + numeric) > 59) {
                                    this.current = 59;
                                } else {
                                    this.current = Number(this.current + '' + numeric);
                                }
                                return false;
                            }
                            firstContact = false;
                            return true;
                        },
                        before: ':',
                        placeholder: '--',
                        current: null
                    },
                    second: {
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
                        onWrite: function (numeric) {
                            if (firstContact) {
                                this.current = numeric;
                                if (numeric > 5) {
                                    return false;
                                }
                            } else {
                                if ((this.current + '' + numeric) > 59) {
                                    this.current = 59;
                                } else {
                                    this.current = Number(this.current + '' + numeric);
                                }
                                return false;
                            }
                            firstContact = false;
                            return true;
                        },
                        before: ':',
                        placeholder: '--',
                        current: null
                    },
                    millisecond: {
                        onUp: function () {
                            if (((this.current + 1) > 999)) {
                                this.current = 0;
                            } else {
                                this.current += 1;
                            }
                        },
                        onDown: function () {
                            if (((this.current - 1) < 0)) {
                                this.current = 999;
                            } else {
                                this.current -= 1;
                            }
                        },
                        view: function () {
                            if (this.current != null) {
                                return String('000' + (this.current)).slice(-3)
                            }
                            return this.placeholder;
                        },
                        onWrite: function (numeric) {
                            if (firstContact) {
                                this.current = numeric;
                            } else {
                                if ((this.current + '' + numeric) > 999) {
                                    this.current = 999;
                                } else {
                                    this.current = Number(this.current + '' + numeric);
                                }
                                if (this.current > 99) {
                                    return false;
                                }
                            }
                            firstContact = false;
                            return true;
                        },
                        before: ',',
                        placeholder: '---',
                        current: null
                    }
                };

                $scope.setFocusChanger = function (typeChanger) {
                    firstContact = true;
                    changer = typeChanger;
                };

                $scope.isFocusChanger = function (typeChanger) {
                    return changer === typeChanger;
                };

                $scope.focus = function () {
                    isFocus = true;
                    if (!changer) {
                        $scope.setFocusChanger($scope.activeChangers[0]);
                    }
                };

                $scope.blur = function () {
                    isFocus = false;
                    $scope.setFocusChanger(null);
                };

                $scope.clear = function () {
                    angular.forEach($scope.activeChangers, function (typeChanger) {
                        $scope.changers[typeChanger].current = null;
                    });
                };

                $scope.isEmpty = function () {
                    var empty = true;
                    angular.forEach($scope.activeChangers, function (typeChanger) {
                        if ($scope.changers[typeChanger].current !== null) {
                            empty = false;
                        }
                    });
                    return empty;
                };

                var incrementInterval = null;
                var countIncrementInterval = 0;
                $scope.increment = function () {
                    $scope.focus();
                    $scope.changers[changer].onUp();
                    incrementInterval = $interval(function () {
                        if (!changer) {
                            $scope.stopIncrement();
                            return;
                        }
                        if (countIncrementInterval > 5) {
                            $scope.changers[changer].onUp();
                        }
                        countIncrementInterval++;
                    }, 60)
                };
                $scope.stopIncrement = function () {
                    $interval.cancel(incrementInterval);
                    incrementInterval = null;
                    countIncrementInterval = 0;
                };

                var decrementInterval = null;
                var countDecrementInterval = 0;
                $scope.decrement = function () {
                    $scope.focus();
                    $scope.changers[changer].onDown();
                    decrementInterval = $interval(function () {
                        if (!changer) {
                            $scope.stopIncrement();
                            return;
                        }
                        if (countDecrementInterval > 5) {
                            $scope.changers[changer].onDown();
                        }
                        countDecrementInterval++;
                    }, 60)
                };
                $scope.stopDecrement = function () {
                    $interval.cancel(decrementInterval);
                    incrementInterval = null;
                    countDecrementInterval = 0;
                };

                $scope.keydown = function (event) {
                    switch (event.which) {
                        case 38: // up
                            $scope.changers[changer].onUp();
                            event.preventDefault();
                            break;
                        case 40: // down
                            $scope.changers[changer].onDown();
                            event.preventDefault();
                            break;
                        case 37: //left
                            (function () {
                                var index = $scope.activeChangers.indexOf(changer);
                                if (angular.isDefined($scope.activeChangers[index - 1])) {
                                    $scope.setFocusChanger($scope.activeChangers[index - 1]);
                                    event.preventDefault();
                                }
                            })();
                            break;
                        case 39: //right
                            (function () {
                                var index = $scope.activeChangers.indexOf(changer);
                                if (angular.isDefined($scope.activeChangers[index + 1])) {
                                    $scope.setFocusChanger($scope.activeChangers[index + 1]);
                                    event.preventDefault();
                                }
                            })();
                            break;
                        case 46: // delete
                        case 8: // backspace
                            $scope.changers[changer].current = null;
                            break;
                        case 9: // tab
                            if (event.shiftKey) {
                                (function () {
                                    var index = $scope.activeChangers.indexOf(changer);
                                    if (angular.isDefined($scope.activeChangers[index - 1])) {
                                        $scope.setFocusChanger($scope.activeChangers[index - 1]);
                                        event.preventDefault();
                                    }
                                })();
                            } else {
                                (function () {
                                    var index = $scope.activeChangers.indexOf(changer);
                                    if (angular.isDefined($scope.activeChangers[index + 1])) {
                                        $scope.setFocusChanger($scope.activeChangers[index + 1]);
                                        event.preventDefault();
                                    }
                                })();
                            }
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
                            if (numeric !== false) {
                                if (!$scope.changers[changer].onWrite(numeric)) {
                                    (function () {
                                        var index = $scope.activeChangers.indexOf(changer);
                                        if (angular.isDefined($scope.activeChangers[index + 1])) {
                                            $scope.setFocusChanger($scope.activeChangers[index + 1]);
                                        } else {
                                            $scope.setFocusChanger($scope.activeChangers[index]);
                                        }
                                    })();
                                }
                            }
                            break;
                    }
                };

            }
        }
    });