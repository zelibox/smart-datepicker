angular.module('smartDatepicker', [])
    .provider('smartDatepickerLocalization', function () {
        var localization = {
            changers: {
                day: {
                    placeholder: 'dd',
                    before: ''
                },
                month: {
                    placeholder: 'mm',
                    before: '.'
                },
                year: {
                    placeholder: 'yyyy',
                    before: '.'
                },
                hour: {
                    placeholder: '--',
                    before: ''
                },
                minute: {
                    placeholder: '--',
                    before: ':'
                },
                second: {
                    placeholder: '--',
                    before: ':'
                },
                millisecond: {
                    placeholder: '---',
                    before: ','
                }
            },
            months: [
                {
                    name: 'January',
                    shortName: 'Jan'
                },
                {
                    name: 'February',
                    shortName: 'Feb'
                },
                {
                    name: 'March',
                    shortName: 'Mar'
                },
                {
                    name: 'April',
                    shortName: 'Apr'
                },
                {
                    name: 'May',
                    shortName: 'May '
                },
                {
                    name: 'June',
                    shortName: 'June'
                },
                {
                    name: 'July',
                    shortName: 'July'
                },
                {
                    name: 'August',
                    shortName: 'Aug'
                },
                {
                    name: 'September',
                    shortName: 'Sept'
                },
                {
                    name: 'October',
                    shortName: 'Oct'
                },
                {
                    name: 'November',
                    shortName: 'Nov'
                },
                {
                    name: 'December',
                    shortName: 'Dec'
                }
            ]
        };
        this.$get = function () {
            return {
                getChanger: function (typeChanger) {
                    return localization.changers[typeChanger];
                }
            }
        }
    })
    .directive('smartDatepicker', function ($interval, $document, $compile, $filter, smartDatepickerLocalization) {
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
            '        ng-class="{\'smart-datepicker-changer-focus\': isFocusChanger(changer)}" ' +
            '        ng-repeat="changer in activeChangers">' +
            '       <span ng-if="changers[changer].before" ng-bind="changers[changer].before"></span>' +
            '       <div ng-bind="changers[changer].view()"' +
            '            ng-mousedown="setFocusChanger(changer)"></div>' +
            '   </div>' +
            '   <div class="smart-datepicker-tools">' +
            '      <div ng-click="toggleCalendar()" class="smart-datepicker-toggle-calendar"></div>' +
            '      <div class="smart-datepicker-switch">' +
            '          <div ng-mousedown="increment()" ng-mouseleave="stopIncrement()" ng-mouseup="stopIncrement()" class="smart-datepicker-increment"></div>' +
            '          <div ng-mousedown="decrement()" ng-mouseleave="stopDecrement()" ng-mouseup="stopDecrement()" class="smart-datepicker-decrement"></div>' +
            '      </div>' +
            '      <div ng-click="clear()" class="smart-datepicker-clear"></div>' +
            '   </div>' +
            '</div>',
            link: function ($scope, $element) {
                var step = 86400;
                var isFocus = false;
                var changer = null;
                var firstContact = true;
                $scope.activeChangers = [];
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
                        before: smartDatepickerLocalization.getChanger('day').before,
                        placeholder: smartDatepickerLocalization.getChanger('day').placeholder,
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
                        before: smartDatepickerLocalization.getChanger('month').before,
                        placeholder: smartDatepickerLocalization.getChanger('month').placeholder,
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
                        before: smartDatepickerLocalization.getChanger('year').before,
                        placeholder: smartDatepickerLocalization.getChanger('year').placeholder,
                        current: null
                    },
                    hour: {
                        onUp: function () {
                            if (((this.current + this.step()) > 23) || (this.current === null)) {
                                this.current = 0;
                            } else {
                                this.current += this.step();
                            }
                        },
                        onDown: function () {
                            if (((this.current - this.step()) < 0) || (this.current === null)) {
                                this.current = 24 - this.step();
                            } else {
                                this.current -= this.step();
                            }
                        },
                        step: function () {
                            var currentStep = Math.floor(step);
                            return (!currentStep || (86400 % currentStep) || (currentStep % 3600) || ((86400 / currentStep) < 2)) ? 1 : currentStep / 3600;
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
                        before: smartDatepickerLocalization.getChanger('hour').before,
                        placeholder: smartDatepickerLocalization.getChanger('hour').placeholder,
                        current: null
                    },
                    minute: {
                        onUp: function () {
                            if (((this.current + this.step()) > 59) || (this.current === null)) {
                                this.current = 0;
                            } else {
                                this.current += this.step();
                            }
                        },
                        onDown: function () {
                            if (((this.current - this.step()) < 0) || (this.current === null)) {
                                this.current = 60 - this.step();
                            } else {
                                this.current -= this.step();
                            }
                        },
                        step: function () {
                            var currentStep = Math.floor(step);
                            return (!currentStep || (3600 % currentStep) || (currentStep % 60) || ((3600 / currentStep) < 2)) ? 1 : currentStep / 60;
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
                        before: smartDatepickerLocalization.getChanger('minute').before,
                        placeholder: smartDatepickerLocalization.getChanger('minute').placeholder,
                        current: null
                    },
                    second: {
                        onUp: function () {
                            if (((this.current + this.step()) > 59) || (this.current === null)) {
                                this.current = 0;
                            } else {
                                this.current += this.step();
                            }
                        },
                        onDown: function () {
                            if (((this.current - this.step()) < 0) || (this.current === null)) {
                                this.current = 60 - this.step();
                            } else {
                                this.current -= this.step();
                            }
                        },
                        step: function () {
                            var currentStep = Math.floor(step);
                            return (!currentStep || (60 % currentStep) || ((60 / currentStep) < 2)) ? 1 : currentStep;
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
                        before: smartDatepickerLocalization.getChanger('second').before,
                        placeholder: smartDatepickerLocalization.getChanger('second').placeholder,
                        current: null
                    },
                    millisecond: {
                        onUp: function () {
                            if (((this.current + this.step()) > 999) || (this.current === null)) {
                                this.current = 0;
                            } else {
                                this.current += this.step();
                            }
                        },
                        onDown: function () {
                            if (((this.current - this.step()) < 0) || (this.current === null)) {
                                this.current = 1000 - this.step();
                            } else {
                                this.current -= this.step();
                            }
                        },
                        step: function () {
                            var currentStep = Number(
                                    (Number((step).toFixed(3)) - Math.floor(step))
                                        .toFixed(3)) * 1000;
                            return (!currentStep || (1000 % currentStep) || ((1000 / currentStep) < 2)) ? 1 : currentStep;
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
                        before: smartDatepickerLocalization.getChanger('millisecond').before,
                        placeholder: smartDatepickerLocalization.getChanger('millisecond').placeholder,
                        current: null
                    }
                };
                $scope.$watch(function () {

                    //yyyy-MM-dd HH:mm:ss sss
                    return $scope.changers['year'].view()+
                        '-' + $scope.changers['month'].view()+
                        '-' + $scope.changers['day'].view()+
                        ' ' + $scope.changers['hour'].view()+
                        ':' + $scope.changers['minute'].view()+
                        ':' + $scope.changers['second'].view()+
                        ' ' + $scope.changers['millisecond'].view();
                }, function () {
                    if($scope.model instanceof Date) {
                        //todo
                        $scope.model.setFullYear($scope.changers['year'].current);
                        $scope.model.setDate($scope.changers['day'].current);
                        $scope.model.setMonth($scope.changers['month'].current);
                        $scope.model.setHours($scope.changers['hour'].current);
                        $scope.model.setMinutes($scope.changers['minute'].current);
                        $scope.model.setSeconds($scope.changers['second'].current);
                        $scope.model.setMilliseconds($scope.changers['millisecond'].current);
                    }

                    //console.log($filter('date')(date, 'yyyy-MM-dd HH:mm:ss sss'));
                });

                $scope.$watch('step', function (newStep) {
                    $scope.activeChangers = ['day', 'month', 'year'];
                    step = angular.isNumber(newStep) ? newStep : 86400;
                    if (Math.floor(step) !== step) {
                        $scope.activeChangers.push('hour');
                        $scope.activeChangers.push('minute');
                        $scope.activeChangers.push('second');
                        $scope.activeChangers.push('millisecond')
                    } else if (step % 60) {
                        $scope.activeChangers.push('hour');
                        $scope.activeChangers.push('minute');
                        $scope.activeChangers.push('second');
                    } else if ((step % 3600) || (step % 86400)) {
                        $scope.activeChangers.push('hour');
                        $scope.activeChangers.push('minute');
                    }
                });

                $scope.setFocusChanger = function (typeChanger) {
                    firstContact = true;
                    changer = typeChanger;
                };

                $scope.isFocusChanger = function (typeChanger) {
                    return changer === typeChanger;
                };


                $scope.focus = function () {
                    console.log('focus');
                    isFocus = true;
                    if (!changer) {
                        $scope.setFocusChanger($scope.activeChangers[0]);
                    }
                };

                $scope.blur = function () {
                    console.log('blur');
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

                var calendarElement = null;
                $scope.closeCalendar = function () {
                    if (calendarElement) {
                        calendarElement.remove();
                    }
                };
                $scope.toggleCalendar = function () {
                    var body = $document.find('body').eq(0);
                    var offset = $element.offset();
                    var posY = offset.top;
                    var posX = offset.left;
                    console.log(posY, posX);

                    var template = '<div ng-blur="closeCalendar()" tabindex="0" style="top: ' + (posY + $element.height()) + 'px; left: ' + posX + 'px" class="smart-datepicker-calendar">' +
                        '    <div class="smart-datepicker-calendar-header">' +
                        '        <div class="smart-datepicker-calendar-change-month">Январь 2015</div>' +
                        '        <div class="smart-datepicker-calendar-tools">' +
                        '            <div class="smart-datepicker-calendar-prev-month"></div>' +
                        '            <div class="smart-datepicker-calendar-current"></div>' +
                        '            <div class="smart-datepicker-calendar-prev-next"></div>' +
                        '        </div>' +
                        '    </div>' +
                        '    <div class="smart-datepicker-wrap-month">            ' +
                        '        <div class="smart-datepicker-weekday" ng-bind="weekday" ng-repeat="weekday in [\'Пн\', \'Вт\', \'Ср\', \'Чт\', \'Пт\', \'Сб\', \'Вс\']"></div>' +
                        '        <div class="smart-datepicker-day"' +
                        '             ng-bind="day"' +
                        '             ng-repeat="day in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 31]"></div>' +
                        '        <div class="smart-datepicker-day smart-datepicker-no-current-month"' +
                        '             ng-bind="day"' +
                        '             ng-repeat="day in [1, 2, 3, 4, 5]"></div>' +
                        '    </div>' +
                        '</div>';
                    calendarElement = angular.element(template);
                    $compile(calendarElement)($scope);
                    body.append(calendarElement);
                    calendarElement.focus();
                };
            }
        }
    });