const utils = require('../utils');

const MIN_PROJECT_NAME_LENGTH = 1;

/**
 * Constructs Express middleware that validates an optional parameter.
 * 
 * If the argument fails to parse, it sends an HTTP 400 error JSON object with a message
 * Otherwise, it saves the parsed value into the request's valid property.
 * 
 * It adds a valid property to all requests that includes
 * a mapping of parameter name to value for every successfully parsed argument.
 * 
 * @param {Function} extractParam - callback that extracts the argument for the given parameter from the request
 * @param {string} paramName - name of the parameter to parse
 * @param {Function} parser - callback that parses the argument to a value or returns a parse failure error
 * @param {boolean} required - validation will fail if a required param is not found in extractParam
 * @returns {Function} Express middleware
 */
const validate = (extractParam, paramName, parser, required = false) =>
    (req, res, next) => {
        const arg = extractParam(req, paramName);

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
            res.status(400).json({
                errors: [{
                    problem: `Required parameter "${paramName}" not found within the request"`,
                    reason: 'missing required parameter'
                }]
            });
            return;
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
     * @param {*} value - the parsed value, which may not be undefined
     * @returns {ParseResult} a successful ParseResult with the parsed value
     */
    static success(value) {
        return new ParseResult(value, undefined);
    }

    /**
     * Construct a parse failure result
     * @param {string} error - the error message to save in the ParseResult
     * @returns {ParseResult} a failed ParseResult with the error message
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
 * Extracts the parameter from the request's query.
 * 
 * @param {*} req - Express request
 * @param {string} paramName - the parameter to extract from req.query
 * @returns {*} the extracted parameter
 */
const extractQueryParam = (req, paramName) => req.query[paramName];

/**
 * Extracts the parameter from the request's body.
 * 
 * @param {*} req - Express request
 * @param {string} paramName - the parameter to extract from req.body
 * @returns {*} the extracted parameter
 */
const extractBodyParam = (req, paramName) => req.body[paramName];

/**
 * Extracts the parameter from the request's params.
 * 
 * @param {*} req - Express request
 * @param {string} paramName - the parameter to extract from req.params
 * @returns {*} the extracted parameter
 */
const extractParamsParam = (req, paramName) => req.params[paramName];

/**
 * Parse a database id value from a string.
 * @param {string} idStr - the string to parse into an id
 * @returns {ParseResult} parse success with a number value, or a parse failure
 */
const parseId = (idStr) => {
    const id = parseInt(idStr, 10);

    return (isNaN(id) || !utils.db.isValidDbInteger(id))
        ? ParseResult.failure(`Expected a number between 1 and ${utils.db.DB_INTEGER_MAX}`)
        : ParseResult.success(id);
};

/**
 *  Validates if it is a string and within min/max length
 * 
 * @param {*} name - the variable to parse
 * @param {number} [minLength=0] - the minimum length to pass.
 * @param {number} [maxLength=Number.MAX_SAFE_INTEGER] - the maximum length to pass
 * 
 * @returns {boolean} true if it is a string and within minLength-maxLength
 */
const parseString = (name, minLength = 0, maxLength = Number.MAX_SAFE_INTEGER) => {
    if (!utils.shared.isString(name)) return false;
    if (name.length < minLength) return false;
    if (name.length > maxLength) return false;

    return true;
};

/**
 * Validates a Project's name. Does not allow empty strings.
 * 
 * @param {*} name - the name of the project to parse
 * @returns {ParseResult} parse success with a valid name or a parse failure
 */
const parseProjectName = (name) => {
    return (parseString(name, MIN_PROJECT_NAME_LENGTH) 
        ? ParseResult.success(name) 
        : ParseResult.failure(`Project Names must be a at least ${MIN_PROJECT_NAME_LENGTH} character(s) long`));
};

/**
 * Validates if it is a valid my conservation life data type
 * 
 * @param {string} dataType - the string to validate
 * @returns {boolean} true if it is a valid data type
 */
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

/**
 * Validates if it is a valid my conservation life property
 * 
 * @param {object} property - a my conservation life property containing name, dataType, required, and isPrivate
 * @returns {ParseResult} a successful ParseResult if it is a valid property
 */
const parseProperty = (property) => {
    const name = property.name;
    const dataType = property.data_type;
    const required = property.required;
    const isPrivate = property.is_private;

    if (!parseString(name, 1, 50)) return ParseResult.failure('assetDefinition property name must be a string <= 50 characters long');
    if (!parseDataType(dataType)) return ParseResult.failure('assetDefinition property data_type must be a dataType string');
    if (!utils.shared.isBoolean(required)) return ParseResult.failure('assetDefinition property required must be a boolean (not a string)');
    if (!utils.shared.isBoolean(isPrivate)) return ParseResult.failure('assetDefinition property is_private must be a boolean (not a string)');

    return ParseResult.success(property);
};

/**
 * Validates if it is a valid my conservation life asset definition
 * 
 * @param {object} assetDefinition - a my conservation life asset definition containing name, description, and valid properties
 * @returns {ParseResult} a successful ParseResult if it is a valid asset definition
 */
const parseAssetDefinition = (assetDefinition) => {
    const name = assetDefinition.name;
    const description = assetDefinition.description;
    const properties = assetDefinition.properties;

    if (!parseString(name, 1, 50)) return ParseResult.failure('assetDefinition name must be a string <= 50 characters long');

    if (!utils.shared.isUndefined(description))
        if (!parseString(description)) return ParseResult.failure('assetDefinition description must be a string');

    if (!properties || !properties.length > 0) return ParseResult.failure('assetDefinition must have properties');

    for (let property of properties) {
        const parseResult = parseProperty(property);
        if (parseResult.isFailure()) return parseResult;
    }

    return ParseResult.success(assetDefinition);
};

/**
 * Validates if its a valid Project
 * 
 * @param {*} project - A My Conservation Life Project that contains a sponsor_id, a name, and optionally a description
 * @returns {ParseResult} a successful ParseResult if it is a valid Project
 */
const parseProject = (project) => {
    const sponsor_id = project.sponsor_id;
    const name = project.name;
    const description = project.description;

    // Validate the Sponsor ID
    const result_id = parseId(sponsor_id);
    if (result_id.isFailure()) 
        return result_id;

    // Validate the Project Name
    const result_name = parseProjectName(name);
    if (result_name.isFailure()) 
        return result_name;

    // Validate the Project Description if there was one provided
    if (!utils.shared.isUndefined(description)) {
        if (!parseString(description))
            return ParseResult.failure('assetDefinition description must be a string');
    }

    return ParseResult.success(project);
};

module.exports = {
    validate,

    param: {
        query: extractQueryParam,
        body: extractBodyParam,
        params: extractParamsParam
    },

    type: {
        id: parseId,
        assetDefinition: parseAssetDefinition,
        project: parseProject,
        projectName: parseProjectName
    },

    ParseResult
};