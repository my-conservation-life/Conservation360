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
 * Parse the given string as a DB integer key
 * 
 * @param {string} str - String to parse
 * @returns result - Parse result
 */
const dbKeyParser = (str) => {
    const id = Number.parseInt(str, 10);
    return (id && isValidDbInteger(id)) ? { value: id } : { error: 'Not a positive integer' };
};

const queryDB = async (res, query, values) => {
    try {
        const db = await global.dbPool.query(query, values);
        const data = db.rows;

        res.send(JSON.stringify(data));
    } catch (e) {
        const msg = {
            message: "Unable to query database",
            error: e.message
        };
        console.error(e.stack);
        res.status(500).send(msg);
    }
}

/**
 * Execute the query.
 * 
 * If successful, call onSuccess with the Result.
 * Otherwise, send a 500 error response.
 * 
 * @param {Response} res
 * @param {string} query Database query to execute
 * @param {string[]} values Substitution parameters for the query
 * @param {*} onSuccess
 */
const queryDbResult = async (res, query, values, onSuccess) => {
    try {
        const result = await global.dbPool.query(query, values);
        onSuccess(result);
    } catch (e) {
        const msg = {
            message: "Unable to query database",
            error: e.message
        };
        console.error(e.stack);
        res.status(500).send(msg);
    }
}


module.exports = {
    isValidDbInteger,
    dbKeyParser,
    queryDB,
    queryDbResult
};