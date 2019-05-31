const isObject = (x) => {
    return typeof(x) === 'object';
}

const hasProperties = (x) => {
    return isObject(x) && Object.keys(x).length > 0;
}

const isNull = (x) => {
    return x === null;
    }
    
const isUndefined = (x) => {
    return typeof(x) === 'undefined';
}

// Returns string with n characters chopped off the end
const trimString = (str, n) => {
    return str.substring(0, str.length - n);
}

const createDBErrorMessage = (error) => {
    const errorMessage = {
        message: 'Unable to query database',
        error: error.message,
        stack: error.stack //TODO: not in prod?
    };
    return errorMessage;
}

// TODO: explore other options to AND
const createWhereClause = (predicates) => {
    let whereClause = '';
    let values = [];
    if (hasProperties(predicates)) {
        whereClause += ' WHERE ';

        let id = 1;
        for (let parameter in predicates) {
            const value = predicates[parameter];

            // TODO: Susceptible to SQL injection
            whereClause += `${parameter} = $${id++}`;
            whereClause += ' AND '

            values.push(value);
        }

        whereClause = trimString(whereClause, 5) //remove last ' AND ' from whereClause
    }

    return {
        whereClause,
        values
    }
}

const beginTransaction = async (client) => {
    return client.query('BEGIN TRANSACTION');
}

const commitTransaction = async (client) => {
    return client.query('END TRANSACTION');
}

const rollbackTransaction = async (client) => {
    return client.query('ROLLBACK');
}

// TODO: may want to separate into each's folder if this index.js gets too large
module.exports = {
    isObject,
    hasProperties,
    isNull,
    isUndefined,
    db: {
        createErrorMessage: createDBErrorMessage, //rename because it's already prefixed
        createWhereClause,
        beginTransaction,
        commitTransaction,
        rollbackTransaction
    }
}