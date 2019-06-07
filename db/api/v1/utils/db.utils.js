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
    beginTransaction,
    commitTransaction,
    rollbackTransaction,
    createErrorMessage
};