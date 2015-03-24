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
                },
                getMonth: function (number) {
                    return localization.months[number]
                }
            }
        }
    })
    .directive('smartDatepicker', function ($interval, $timeout, $document, $compile, $filter, smartDatepickerLocalization) {
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

                (function () {
                    if ($scope.model instanceof Date) {
                        $scope.changers['year'].current = $scope.model.getFullYear();
                        $scope.changers['day'].current = $scope.model.getDate();
                        $scope.changers['month'].current = $scope.model.getMonth() + 1;
                        $scope.changers['hour'].current = $scope.model.getHours();
                        $scope.changers['minute'].current = $scope.model.getMinutes();
                        $scope.changers['second'].current = $scope.model.getSeconds();
                        $scope.changers['millisecond'].current = $scope.model.getMilliseconds();
                    }
                })();
                $scope.$watch(function () {
                    //yyyy-MM-dd HH:mm:ss sss
                    return $scope.changers['year'].view() +
                        '-' + $scope.changers['month'].view() +
                        '-' + $scope.changers['day'].view() +
                        ' ' + $scope.changers['hour'].view() +
                        ':' + $scope.changers['minute'].view() +
                        ':' + $scope.changers['second'].view() +
                        ' ' + $scope.changers['millisecond'].view();
                }, function () {
                    if (!($scope.model instanceof Date)) {
                        $scope.model = new Date();
                    }
                    $scope.model.setFullYear($scope.changers['year'].current);
                    $scope.model.setDate($scope.changers['day'].current);
                    $scope.model.setMonth($scope.changers['month'].current - 1);
                    $scope.model.setHours($scope.changers['hour'].current);
                    $scope.model.setMinutes($scope.changers['minute'].current);
                    $scope.model.setSeconds($scope.changers['second'].current);
                    $scope.model.setMilliseconds($scope.changers['millisecond'].current);
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
                            event.preventDefault();
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
                $scope.calendarYears = [
                    {
                        number: 2013
                    },
                    {
                        number: 2014
                    },
                    {
                        number: 2015
                    },
                    {
                        number: 2016
                    },
                    {
                        number: 2017
                    }
                ];
                $scope.calendarMonth = {
                    calc: function (year, month) {
                        this.year = year;
                        this.month = {
                            number: month,
                            name: smartDatepickerLocalization.getMonth(month).name
                        };

                        var countDays = new Date(this.year, this.month.number + 1, 0).getDate();
                        var startWeekday = new Date(this.year, this.month.number, 1).getDay();
                        var countPrevDays = ((startWeekday - 1) >= 0) ? (startWeekday - 1) : 6;
                        var days = [];
                        for (var i = 0; i < countPrevDays; i++) {
                            days.push({
                                number: new Date(this.year, this.month.number + 1, ((countDays + (countPrevDays - i) - 1) * -1)).getDate(),
                                currentMonth: false,
                                active: false
                            })
                        }
                        for (i = 1; i <= countDays; i++) {
                            days.push({
                                number: i,
                                currentMonth: true,
                                currentDay: false, //todo
                                active: ($scope.changers['day'].current === i)  //todo
                            });
                        }
                        var endWeekday = new Date(this.year, this.month.number, countDays).getDay();
                        var countNextDays = ((7 - endWeekday) < 7) ? (7 - endWeekday) : 0;
                        for (i = 0; i < countNextDays; i++) {
                            days.push({
                                number: i + 1,
                                currentMonth: false,
                                active: false
                            })
                        }
                        this.days = days;
                    }
                };
                $scope.closeCalendar = function () {
                    if (calendarElement) {
                        //calendarElement.remove();
                        //calendarElement = null;
                    }
                };
                var startY = 0;
                var startPr = 0;
                var pr = 0;
                var isScroll = false;
                var timeout = null;
                function scroll() {
                    if (isScroll) {
                        if (pr > 50) {
                            angular.forEach($scope.calendarYears, function (year) {
                                year.number += 1;
                            });
                        } else {
                            angular.forEach($scope.calendarYears, function (year) {
                                year.number -= 1;
                            });
                        }
                        $timeout(scroll, (function (prr) {
                            prr = Math.floor(prr);
                            prr = (prr === 50) ? 51 : prr;
                            return (600 / ((prr > 50) ? (prr - 50) : (50 - prr)))
                        })(pr));
                    }
                }

                $scope.scrollYear = function (event) {
                    event.preventDefault();
                    startY = event.screenY;
                    pr = startPr = (event.offsetY / (128 / 100));
                    isScroll = true;
                    calendarElement.find('.smart-datepicker-calendar-container-year-scroll-holder').css('top', startPr + '%');
                    timeout = $timeout(scroll, (function (prr) {
                        prr = Math.floor(prr);
                        prr = (prr === 50) ? 51 : prr;
                        return (600 / ((prr > 50) ? (prr - 50) : (50 - prr)));
                    })(pr));
                    $document.on('mousemove', mousemoveResize);
                    $document.on('mouseup', mouseupResize);
                };
                function mousemoveResize(event) {
                    var y = event.screenY - startY;
                    if (y > 0) {
                        pr = (((y / (128 / 100)) + startPr) <= 100) ? ((y / (128 / 100)) + startPr) : 100;
                    } else {
                        pr = ((startPr - (Math.abs(y) / (128 / 100))) >= 0) ? (startPr - (Math.abs(y) / (128 / 100))) : 0;
                    }
                    calendarElement.find('.smart-datepicker-calendar-container-year-scroll-holder').css('top', pr + '%');
                    $scope.$apply();
                }
                function mouseupResize() {
                    if(timeout) {
                        $timeout.cancel(timeout);
                    }
                    pr = 0;
                    isScroll = false;
                    $document.off('mousemove', mousemoveResize);
                    $document.off('mouseup', mouseupResize);
                    calendarElement.find('.smart-datepicker-calendar-container-year-scroll-holder').attr('style', '');
                    $scope.$apply();
                }
                $scope.isYear = function (year) {
                    if($scope.model instanceof Date) {
                        return ($scope.model.getFullYear() === year)
                    }
                    return false;
                };
                $scope.toggleCalendar = function () {
                    if (calendarElement) {
                        $scope.closeCalendar();
                        return;
                    }
                    var body = $document.find('body').eq(0);
                    var offset = $element.offset();
                    var posY = offset.top;
                    var posX = offset.left;
                    $scope.calendarMonth.calc($scope.model.getFullYear(), $scope.model.getMonth());
                    var template = '<div ng-blur="closeCalendar()" tabindex="0" style="top: ' + (posY + $element.height()) + 'px; left: ' + posX + 'px" class="smart-datepicker-calendar">' +
                        '    <div class="smart-datepicker-calendar-header">' +
                        '        <div class="smart-datepicker-calendar-change-month" ng-bind="calendarMonth.month.name + \' \' + calendarMonth.year"></div>' +
                        '        <div class="smart-datepicker-calendar-tools">' +
                        '            <div class="smart-datepicker-calendar-prev-month"></div>' +
                        '            <div class="smart-datepicker-calendar-current"></div>' +
                        '            <div class="smart-datepicker-calendar-prev-next"></div>' +
                        '        </div>' +
                        '    </div>' +
                        '    <div class="smart-datepicker-calendar-container-year">' +
                        '        <div ng-class="{\'smart-datepicker-calendar-year-active\': isYear(year.number)}" class="smart-datepicker-calendar-year" ng-repeat="year in calendarYears">' +
                        '            <div class="smart-datepicker-calendar-year-header" ng-bind="year.number"></div>' +
                        '            <div ng-if="isYear(year.number)" class="smart-datepicker-calendar-year-months">' +
                        '                <div ng-bind="yearMonth" ng-repeat="yearMonth in [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]" class="smart-datepicker-calendar-year-month"></div>' +
                        '            </div>' +
                        '        </div>' +
                        '        <div class="smart-datepicker-calendar-container-year-scroll-holder"></div>' +
                        '        <div ng-mousedown="scrollYear($event)" class="smart-datepicker-calendar-container-year-scroll"></div>' +
                        '    </div>' +
                        '    <div class="smart-datepicker-calendar-container-month">' +
                        '        <div class="smart-datepicker-calendar-wrap-month">' +
                        '            <div class="smart-datepicker-calendar-weekday" ng-bind="weekday" ng-repeat="weekday in [\'Пн\', \'Вт\', \'Ср\', \'Чт\', \'Пт\', \'Сб\', \'Вс\']"></div>' +
                        '            <div ng-repeat="day in calendarMonth.days"' +
                        '                 class="smart-datepicker-calendar-day"' +
                        '                 ng-class="{\'smart-datepicker-calendar-day-no-current-month\': !day.currentMonth, \'smart-datepicker-calendar-day-active\': day.active}"' +
                        '                 ng-bind="day.number"></div>' +
                        '        </div>' +
                        '    </div>' +
                        '</div>';
                    calendarElement = angular.element(template);
                    calendarElement.find('.smart-datepicker-calendar-container-year').on('mousewheel DOMMouseScroll', function (event) {
                        event.preventDefault();
                        if (event.originalEvent.wheelDelta > 0 || event.originalEvent.detail < 0) {
                            console.log('up');
                            angular.forEach($scope.calendarYears, function (year) {
                                year.number -= 1;
                            })
                        }
                        else {
                            console.log('down');
                            angular.forEach($scope.calendarYears, function (year) {
                                year.number += 1;
                            })
                        }
                        $scope.$apply();
                    });
                    $compile(calendarElement)($scope);
                    body.append(calendarElement);
                    calendarElement.focus();
                };
            }
        }
    });