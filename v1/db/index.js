/**
 * Maximum value supported by the PostgreSQL integer type.
 */
const DB_INTEGER_MAX = 2147483647;

/**
 * Test a given number if it is in the bounds of the PostgreSQL integer type.
 * 
 * @param {number} id - number to check
 */
const isValidDbInteger = (id) => id > 0 && id <= DB_INTEGER_MAX;

/**
 * Parse the given DB key value.
 * 
 * If a parse error occurs, send a 500 error message.
 * 
 * @param {*} paramName - parameter name to included in parse failure messages
 * @param {string} keyString - value of the key to parse
 * @param {*} res - Express response
 */
const parseKey = (paramName, keyString, res) => {
    let key;
    if (keyString) {
        key = parseInt(keyString, 10);

        if (isNaN(key) || !isValidDbInteger(key)) {
            res.status(500).send(`Invalid argument for ${paramName}. Expected a number between 1 and ${DB_INTEGER_MAX} but got '${keyString}'`);
            return;
        }
    }

    return key;
}

module.exports = {
    DB_INTEGER_MAX,
    isValidDbInteger,
    parseKey
};