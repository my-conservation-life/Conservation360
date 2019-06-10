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
const validate = (extractParam, paramName, parser, required = false) =>
    (req, res, next) => {
        const arg = extractParam(req, paramName);

        if (req.valid) throw new Error('The request parameter "valid" is reserved for validation middleware. Please change your request.');
        if (!req.valid) req.valid = {};

        if (arg) {
            const parseResult = parser(arg);

            if (parseResult.isFailure()) {
                res.status(400).json({
                    errors: [{
                        problem: `Failed to validate the argument "${arg}" for the parameter "${paramName}"`,
                        reason: parseResult.error
                    }]
                });
                return;
            }

            req.valid[paramName] = parseResult.value;
        } else if (required) {
            throw new Error(`Required parameter "${paramName}" not found within the request"`);
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

const extractBodyParam = (req, paramName) => req.body[paramName];

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

const parseString = (name, minLength = 0, maxLength = Number.MAX_SAFE_INTEGER) => {
    if (!utils.shared.isString(name)) return false;
    if (name.length < minLength) return false;
    if (name.length > maxLength) return false;

    return true;
};

const parseBoolean = (bool) => {
    if (!utils.shared.isBoolean(bool)) return false;

    return true;
};

const parseDataType = (dataType) => {
    // TODO: hardcoded
    const dataTypes = [
        'boolean',
        'number',
        'datetime',
        'location',
        'text'
    ];

    if (!parseString(dataType, 0, 50)) return false;
    if (!dataTypes.includes(dataType)) return false;

    return true;
};

const parseProperty = (property) => {
    const name = property.name;
    const dataType = property.data_type;
    const required = property.required;
    const isPrivate = property.is_private;

    if (!parseString(name, 0, 50)) return ParseResult.failure('assetDefinition property name must be a string <= 50 characters long');
    if (!parseDataType(dataType)) return ParseResult.failure('assetDefinition property data_type must be a dataType string');
    if (!parseBoolean(required)) return ParseResult.failure('assetDefinition property required must be a boolean (not a string)');
    if (!parseBoolean(isPrivate)) return ParseResult.failure('assetDefinition property is_private must be a boolean (not a string)');

    return ParseResult.success(property);
};

const parseAssetDefinition = (assetDefinition) => {
    const name = assetDefinition.name;
    const description = assetDefinition.description;
    const properties = assetDefinition.properties;

    if (!parseString(name, 0, 50)) return ParseResult.failure('assetDefinition name must be a string <= 50 characters long');
    if (!parseString(description)) return ParseResult.failure('assetDefinition description must be a string');
    if (!properties.length > 0) return ParseResult.failure('assetDefinition must have properties');

    for (let property of properties) {
        const parseResult = parseProperty(property);
        if (parseResult.isFailure()) return parseResult;
    }

    return ParseResult.success(assetDefinition);
};

module.exports = {
    validate,

    param: {
        query: extractQueryParam,
        body: extractBodyParam
    },

    type: {
        id: parseId,
        assetDefinition: parseAssetDefinition
    },

    ParseResult
};
