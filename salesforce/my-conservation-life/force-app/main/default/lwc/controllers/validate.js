/**
 * Maximum value supported by the PostgreSQL integer type.
 */
const DB_INTEGER_MAX = 2147483647;

/**
 * Test a given number if it is in the bounds of the PostgreSQL integer type.
 * 
 * @param {*} id - value to check
 * @returns {boolean} true if id is a valid db integer
 */
const isValidDbInteger = (id) => typeof id === 'number' && !isNaN(id) && id > 0 && id <= DB_INTEGER_MAX;

export { isValidDbInteger };