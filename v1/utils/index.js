function isObject(x) {
    return typeof(x) === "object";
}

function hasProperties(x) {
    return isObject(x) && Object.keys(x).length > 0;
}

function isNull (x) {
    return x === null;
    }
    
function isUndefined (x) {
    return typeof(x) === 'undefined';
}

// Returns string with n characters chopped off the end
function trimString(str, n) {
    return str.substring(0, str.length - n);
}

function createDBErrorMessage(error) {
    const errorMessage = {
        message: "Unable to query database",
        error: error.message,
        stack: error.stack //TODO: not in prod?
    };
    return errorMessage;
}

// TODO: explore other options to AND
function createWhereClause(predicates) {
    let whereClause = "";
    let values = [];
    if (hasProperties(predicates)) {
        whereClause += " WHERE ";

        let id = 1;
        for (let parameter in predicates) {
            const value = predicates[parameter];

            // TODO: Susceptible to SQL injection
            whereClause += `${parameter} = $${id++}`;
            whereClause += " AND "

            values.push(value);
        }

        whereClause = trimString(whereClause, 5) //remove last " AND " from whereClause
    }

    return {
        whereClause,
        values
    }
}

// TODO: may want to separate into each folder if it gets large
module.exports = {
    isObject,
    hasProperties,
    isNull,
    isUndefined,
    db: {
        createErrorMessage: createDBErrorMessage, //rename because it's already prefixed
        createWhereClause
    }
}