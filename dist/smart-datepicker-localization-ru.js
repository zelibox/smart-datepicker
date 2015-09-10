angular.module('smartDatepicker').config(function (smartDatepickerLocalizationProvider) {
    smartDatepickerLocalizationProvider.setLocalization({
        changers: {
            month: {
                placeholder: 'мм',
                before: '.',
                sort: 2
            },
            day: {
                placeholder: 'дд',
                before: '',
                sort: 1
            },
            year: {
                placeholder: 'гггг',
                before: '.',
                sort: 3
            },
            hour: {
                placeholder: '--',
                before: '',
                sort: 4
            },
            minute: {
                placeholder: '--',
                before: ':',
                sort: 5
            },
            second: {
                placeholder: '--',
                before: ':',
                sort: 6
            },
            millisecond: {
                placeholder: '---',
                before: ',',
                sort: 7
            }
        },
        months: [
            {
                name: 'Январь',
                shortName: 'Янв'
            },
            {
                name: 'Февраль',
                shortName: 'Фев'
            },
            {
                name: 'Март',
                shortName: 'Мар'
            },
            {
                name: 'Апрель',
                shortName: 'Апр'
            },
            {
                name: 'Май',
                shortName: 'Май'
            },
            {
                name: 'Июнь',
                shortName: 'Июн'
            },
            {
                name: 'Июль',
                shortName: 'Июл'
            },
            {
                name: 'Август',
                shortName: 'Авг'
            },
            {
                name: 'Сентябрь',
                shortName: 'Сен'
            },
            {
                name: 'Октябрь',
                shortName: 'Окт'
            },
            {
                name: 'Ноябрь',
                shortName: 'Ноя'
            },
            {
                name: 'Декабрь',
                shortName: 'Дек'
            }
        ],
        days: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
    });
});