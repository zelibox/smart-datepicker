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
            template: '<div ng-focus="focus()" ng-blur="blur()" ng-keydown="keydown($event)" tabindex="0" ng-class="{\'smart-datepicker-focus\': isFocus}" class="smart-datepicker">' +
            '   <div class="smart-datepicker-changer {{ \'smart-datepicker-changer-\' + changer }}"  ' +
            '        ng-class="{\'smart-datepicker-changer-focus\' :isFocusChanger(changer)}" ' +
            '        ng-repeat="changer in activeChangers">' +
            '       <div ng-bind="changers[changer].view()"' +
            '            ng-mousedown="setFocusChanger(changer)"></div>' +
            '       <span ng-if="changers[changer].after" ng-bind="changers[changer].after"></span>' +
            '   </div>' +
            '</div>',
            link: function ($scope, $element) {
                $scope.isFocus = false;
                $scope.activeChangers = [
                    'day',
                    'month',
                    'year',
                    'hour',
                    'minute'
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
                        onWrite: function(numeric) {
                            if(!numeric && firstContact) {
                                return true;
                            }
                            if(firstContact) {
                                this.current = numeric;
                                if (numeric > 3) {
                                    return false;
                                }
                            } else {
                                if((this.current + '' + numeric) > 31) {
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
                        after: '.',
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
                        onWrite: function(numeric) {
                            if(!numeric && firstContact) {
                                return true;
                            }
                            if(firstContact) {
                                this.current = numeric;
                                if (numeric > 1) {
                                    return false;
                                }
                            } else {
                                if((this.current + '' + numeric) > 12) {
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
                        after: '.',
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
                        onWrite: function(numeric) {
                            if(!numeric && firstContact) {
                                return true;
                            }
                            if(firstContact) {
                                this.current = numeric;
                            } else {
                                if((this.current + '' + numeric) > 9999) {
                                    this.current = 9999;
                                } else {
                                    this.current = Number(this.current + '' + numeric);
                                }
                                if(this.current > 999) {
                                    return false;
                                }
                            }
                            firstContact = false;
                            return true;
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
                        onWrite: function(numeric) {
                            if(firstContact) {
                                this.current = numeric;
                                if (numeric > 2) {
                                    return false;
                                }
                            } else {
                                if((this.current + '' + numeric) > 23) {
                                    this.current = 23;
                                } else {
                                    this.current = Number(this.current + '' + numeric);
                                }
                                return false;
                            }
                            firstContact = false;
                            return true;
                        },
                        after: ':',
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
                        onWrite: function(numeric) {
                            if(firstContact) {
                                this.current = numeric;
                                if (numeric > 5) {
                                    firstContact = true;
                                    return false;
                                }
                            } else {
                                if((this.current + '' + numeric) > 59) {
                                    this.current = 59;
                                } else {
                                    this.current = Number(this.current + '' + numeric);
                                }
                                firstContact = true;
                                return false;
                            }
                            firstContact = false;
                            return true;
                        },
                        placeholder: '--',
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
                    $scope.isFocus = true;
                    if(!changer) {
                        $scope.setFocusChanger($scope.activeChangers[0]);
                    }
                };

                $scope.blur = function () {
                    $scope.isFocus = false;
                    $scope.setFocusChanger(null);
                };

                $scope.keydown = function (event) {
                    console.log('keydown: ', event.which);
                    switch (event.which) {
                        case 38: // up
                            $scope.changers[changer].onUp();
                            break;
                        case 40: // down
                            $scope.changers[changer].onDown();
                            break;
                        case 37: //left
                            (function(){
                                var index = $scope.activeChangers.indexOf(changer);
                                if(angular.isDefined($scope.activeChangers[index - 1])) {
                                    $scope.setFocusChanger($scope.activeChangers[index - 1]);
                                }
                            })();
                            break;
                        case 39: //right
                            (function(){
                                var index = $scope.activeChangers.indexOf(changer);
                                if(angular.isDefined($scope.activeChangers[index + 1])) {
                                    $scope.setFocusChanger($scope.activeChangers[index + 1]);
                                }
                            })();
                            break;
                        case 46: // delete
                        case 8: // backspace
                            $scope.changers[changer].current = null;
                            break;
                        case 9: // tab
                            if(event.shiftKey) {
                                (function(){
                                    var index = $scope.activeChangers.indexOf(changer);
                                    if(angular.isDefined($scope.activeChangers[index - 1])) {
                                        $scope.setFocusChanger($scope.activeChangers[index - 1]);
                                        event.preventDefault();
                                    }
                                })();
                            } else {
                                (function(){
                                    var index = $scope.activeChangers.indexOf(changer);
                                    if(angular.isDefined($scope.activeChangers[index + 1])) {
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
                            if(numeric !== false) {
                                if(!$scope.changers[changer].onWrite(numeric)) {
                                    (function(){
                                        var index = $scope.activeChangers.indexOf(changer);
                                        if(angular.isDefined($scope.activeChangers[index + 1])) {
                                            $scope.setFocusChanger($scope.activeChangers[index + 1]);
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