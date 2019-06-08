const utils = require('../utils');

/**
 * Constructs Express middleware that validates an optional parameter.
 * 
 * If the argument fails to parse, it sends an HTTP 400 error JSON object with a message
 * Otherwise, it saves the parsed value into the request's valid property.
 * 
 * It adds a valid property to all requests that includes
 * a mapping of parameter name to value for every successfully parsed argument.
 * 
 * @param {*} extractParam - callback that extracts the argument for the given parameter from the request
 * @param {string} paramName - name of the parameter to parse
 * @param {*} parser - callback that parses the argument to a value or returns a parse failure error
 * @returns Express middleware
 */
const validate = (extractParam, paramName, parser) =>
    (req, res, next) => {
        const arg = extractParam(req, paramName);

        if (arg !== undefined && typeof arg !== 'string') {
            throw new Error(`validate: Parameter extracter returned a value with type '${typeof arg}'. Parameter extracters may only return values with the type 'string'.`);
        }

        if (!req.valid) {
            req.valid = {};
        }

        if (arg) {
            const parseResult = parser(arg);

            if (parseResult.isFailure()) {
                res.status(400).json({
                    errors: [{
                        problem: `Failed to validate the argument '${arg}' for the parameter '${paramName}'`,
                        reason: parseResult.error
                    }]
                });
                return;
            }

            req.valid[paramName] = parseResult.value;
        }

        next();
    }
;

/**
 * Result of calling a parser
 * 
 * For a successful parse, it stores the parsed value.
 * For an unsuccessful parse, is stores the parse error.
 */
class ParseResult {
    constructor(value, error) {
        this.value = value;
        this.error = error;
    }

    /**
     * Construct a successful parse result
     * 
     * @param {*} value the parsed value, which may not be undefined
     */
    static success(value) {
        return new ParseResult(value, undefined);
    }

    /**
     * Construct a parse failure result
     * @param {string} error 
     */
    static failure(error) {
        return new ParseResult(undefined, error);
    }

    isSuccess() {
        return this.value !== undefined;
    }

    isFailure() {
        return !this.isSuccess();
    }
}

/**
 * Extract the query string from a request
 * 
 * @param {*} req Express request
 */
const extractQueryParam = (req, paramName) => req.query[paramName];

/**
 * Parse a database ID value
 * @param {string} idStr
 * @returns parse success with a number value, or a parse failure
 */
const parseId = (idStr) => {
    const id = parseInt(idStr, 10);

    return (isNaN(id) || !utils.db.isValidDbInteger(id))
        ? ParseResult.failure(`Expected a number between 1 and ${utils.db.DB_INTEGER_MAX}`)
        : ParseResult.success(id);
};

module.exports = {
    validate,
    
    param: {
        query: extractQueryParam
    },

    type: {
        id: parseId
    },

    ParseResult
};
