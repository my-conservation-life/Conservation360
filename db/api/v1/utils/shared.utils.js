const isString = (x) => typeof x === 'string';
const isBoolean = (x) => typeof x === 'boolean';
const isUndefined = (x) => typeof x === 'undefined';

const dateStringFormat = () => 'YYYY-MM-DD';

module.exports = {
    dateStringFormat,
    isString,
    isBoolean,
    isUndefined
};
