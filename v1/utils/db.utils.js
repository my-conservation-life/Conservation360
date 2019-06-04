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
 * If a parse error occurs, it sends a 500 error message.
 * 
 * @param {string} paramName - parameter name to included in parse failure messages
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
};

const beginTransaction = async (client) => {
    return client.query('BEGIN TRANSACTION');
};

const commitTransaction = async (client) => {
    return client.query('END TRANSACTION');
};

const rollbackTransaction = async (client) => {
    return client.query('ROLLBACK');
};

const createErrorMessage = (error) => {
    const errorMessage = {
        message: 'Unable to query database',
        error: error.message,
        stack: error.stack //TODO: not in prod?
    };
    return errorMessage;
};

module.exports = {
    DB_INTEGER_MAX,
    isValidDbInteger,
    parseKey,
    beginTransaction,
    commitTransaction,
    rollbackTransaction,
    createErrorMessage
};