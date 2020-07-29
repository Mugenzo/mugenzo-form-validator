module.exports = {
    settings: {
        min: undefined,
        max: undefined,
        pattern: undefined,
        name: undefined,
        errorClass: undefined
    },
    validateInput: (el) => {
        if (typeof el !== 'HTMLElement') {
            return `Переданный елемент не является частью DOM дерева!`;
        }

        let
            inputOptions = Object.assign({
                _fieldName: el.getAttribute('data-name'),
                /**
                 * определяем тип валидируемого поля
                 * @type {number}
                 * @private
                 */
                _type: el.getAttribute('type'),
                /**
                 * число минимальных символов в строке
                 * @type {number}
                 * @private
                 */
                _min: el.getAttribute('min'),
                /**
                 * число максимальных символов в строке
                 * @type {number}
                 * @private
                 */
                _max: el.getAttribute('max'),
                /**
                 * строка для сравнения
                 * @type {string}
                 * @private
                 */
                _pattern: el.getAttribute('data-pattern'),
                /**
                 * значение в инпуте
                 * @type {string}
                 * @private
                 */
                _val: el.value,
                /**
                 * длинна значения в инпуте
                 * @type {string}
                 * @private
                 */
                _valLength: _val.length,
                /**
                 * класс для поиска wrapper на который вешается invalid при валидации
                 * @type {string}
                 * @private
                 */
                _wrapper: el.getAttribute('val-class'),
            }, this.settings),
            /**
             * обьект ответа
             * @type {string}
             * @private
             */
            response = {
                status: true,
                message: 'Валидация пройдена'
            };

        switch (inputOptions._type) {
            case 'text':
                if (!_valLength) {
                    response = {
                        status: false,
                        message: `Необходимо заполнить поле ${_fieldName}`
                    }
                    break;
                }
                if (inputOptions._min && inputOptions._valLength < inputOptions._min) {
                    response = {
                        status: false,
                        message: `Поле ${inputOptions._fieldName} должно быть больше ${inputOptions._min} симоволов`
                    }
                    break;
                }
                if (inputOptions._max && inputOptions._valLength > inputOptions._max) {
                    response = {
                        status: false,
                        message: `Поле ${inputOptions._fieldName} должно быть меньше ${inputOptions._max} симоволов`
                    }
                    break;
                }
                if (inputOptions._pattern && !inputOptions._val.match(inputOptions._pattern)) {
                    response = {
                        status: false,
                        message: `Поле ${inputOptions._fieldName} не соответствует формату`
                    }
                }
                break;
            case 'tel':
                if (!inputOptions._valLength) {
                    response = {
                        status: false,
                        message: `Необходимо заполнить поле ${inputOptions._fieldName}`
                    }
                    break;
                }
                if (inputOptions._pattern && !_val.match(inputOptions._pattern)) {
                    response = {
                        status: false,
                        message: `Поле ${inputOptions._fieldName} не соответствует формату`
                    }
                }
                break;
            case 'date':
                if (!inputOptions._valLength) {
                    response = {
                        status: false,
                        message: `Необходимо заполнить поле ${inputOptions._fieldName}`
                    }
                    break;
                }
                if (this.underAgeValidate(inputOptions._val)) {
                    response = {
                        status: false,
                        message: `Ваш возраст должен быть больше 18`
                    }
                }
                break;
            case 'checkbox':
                if (!el.checked) {
                    response = {
                        status: false,
                        message: `Поле ${inputOptions._fieldName} обязательно для заполнения`
                    }
                }
                break;
            case 'file':
                if (!el.files.length) {
                    response = {
                        status: false,
                        message: `Необходимо выбрать файл: ${inputOptions._fieldName}`
                    }
                }
                break;
            default:
                break;

                if (!response.status) {
                    if (inputOptions._wrapper) {
                        el.closest(`.${inputOptions._wrapper}`).classList.add = 'validation-error'
                    }

                    return response;
                }

                if (inputOptions._wrapper) {
                    el.closest(`.${inputOptions._wrapper}`).classList.remove = 'validation-error'
                }

                return response;
        }
    },
    underAgeValidate: (birthday) => {
        // it will accept two types of format yyyy-mm-dd and yyyy/mm/dd
        let optimizedBirthday = birthday.replace(/-/g, "/"),

            //set date based on birthday at 01:00:00 hours GMT+0100 (CET)
            myBirthday = new Date(optimizedBirthday),

            // set current day on 01:00:00 hours GMT+0100 (CET)
            currentDate = new Date().toJSON().slice(0, 10) + ' 01:00:00',

            // calculate age comparing current date and borthday
            myAge = ~~((Date.now(currentDate) - myBirthday) / (31557600000));

        return myAge < 18;
    }
}