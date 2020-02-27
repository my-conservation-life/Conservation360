const utils = require('../utils');
const moment = require('moment');

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
 * Validates that a number is within the bounds of valid latitudes
 * 
 * @param {number} latitude - the latitude to validate
 * @return {boolean} true if the latitude is a valid value.
 */
const validLatitude = (latitude) => {
    return (latitude >= -90 && latitude <= 90);
};

/**
 * Validates that a number is within the bounds of valid longitudes
 *  
 * @param {number} longitude - the longitude to validate
 * @returns {boolean} true if the longitude is a valid value.
 */
const validLongitude = (longitude) => {
    return (longitude >= -180 && longitude <= 180);
};

/**
 * Parses a list of latitude and longitude points.
 * @param {Array} coordinateList - a list of latitude and longitude points.
 * @returns {ParseResult} parse success if a valid list of latitude and longitude points of at least length 3
 */
const parseCoordinates = (coordinateList) => {
   
    // There needs to be at least 3 
    if (coordinateList.length < 3) {
        return ParseResult.failure('Expected at least 3 points in the coordinates list');
    }

    let lat = 0;
    let lon = 0;

    const coordinates = [];

    var i;
    var point;
    for (i = 0; i < coordinateList.length; i++) {
        point = coordinateList[i];
        lon = parseFloat(point.longitude);
        lat = parseFloat(point.latitude);

        if (!isNaN(lon) && validLongitude(lon) 
            && !isNaN(lat) && validLatitude(lat)) {
            coordinates.push({latitude: lat, longitude: lon});
        } else {
            return ParseResult.failure('Unable to parse coordinate. Please format points like {coordinates: [{"latitude": "-14.342", "longitude": "33.123"},...]}');
        }
    }

    return ParseResult.success(coordinates);
};

/**
 * Parses and validates a Geometry Object.
 * Using GeoJSON as a template https://tools.ietf.org/html/rfc7946
 * 
 * @param {geometry} geometry - An object that contains a type and a set of coordinates.
 * @returns {ParseResult} success if a valid geometry object. Otherwise a parse failure.
 */
const parseGeometry = (geometry) => {
    if (typeof geometry === 'undefined' || !geometry) {
        return ParseResult.failure('"geometry" was undefined');
    }

    if (typeof geometry.type === 'undefined' || !geometry.type) {
        return ParseResult.failure('geometry "type" was undefined');
    }

    if (!Array.isArray(geometry.coordinates)) {
        return ParseResult.failure('geometry must have "coordinates" with at least one [lon, lat] or [[lon, lat], ...]');
    }

    // Types are case sensitive
    switch (geometry.type) {
        case 'Circle': 
            return parseCircleGeometry(geometry);
        case 'Polygon': 
            return parsePolygonGeometry(geometry);
        default:
            return ParseResult.failure('geometry "type" is case sensitive and can be ("Circle", "Polygon")');
    }
};

/**
 * Parses and validates a Circle Geometry Object
 * 
 * @param {CircleGeometry} geometry - A Geometry object that has the type "Circle" and a "radius" property
 * @returns {ParseResult} success if a valid geometry object. Otherwise a parse failure.
 */
const parseCircleGeometry = (geometry) => {
    if (geometry.coordinates.length != 2) {
        return ParseResult.failure('Circle geometry "coordinates" is formatted [lon, lat]');
    }
    
    if (typeof geometry.radius === 'undefined' || !geometry.radius) {
        return ParseResult.failure('Circle geometry must have a "radius"');
    }

    const lon = parseFloat(geometry.coordinates[0]);
    const lat = parseFloat(geometry.coordinates[1]);

    if (isNaN(lon) || isNaN(lat)) {
        return ParseResult.failure('error parsing coordinate values');
    }

    const radius = parseFloat(geometry.radius);

    if (isNaN(radius)) {
        return ParseResult.failure('error parsing radius');
    }

    geometry.radius = radius;
    geometry.coordinates = [lon, lat];

    return ParseResult.success(geometry);
};

/**
 * Parses and validates a Polygon Geometry Object
 * 
 * @param {PolygonGeometry} geometry - A Geometry object that has the type "Polygon"
 * @returns {ParseResult} success if a valid geometry object. Otherwise a parse failure.
 */
const parsePolygonGeometry = (geometry) => {
    if (geometry.coordinates.length < 4) {
        return ParseResult.failure('For type "Polygon", the "coordinates" member MUST be an array of 4 or more coordinate arrays.');
    }

    let lat = 0;
    let lon = 0;

    var i;
    var coordArray;
    var parsedCoordinates = [];
    for (i = 0; i < geometry.coordinates.length; i++) {
        coordArray = geometry.coordinates[i];

        if (coordArray.length != 2) {
            return ParseResult.failure('A coordinate in the "coordinates" array is formatted [lon, lat]');
        }

        lon = parseFloat(coordArray[0]);
        lat = parseFloat(coordArray[1]);

        if (!isNaN(lon) && validLongitude(lon)
            && !isNaN(lat) && validLatitude(lat)) {
            parsedCoordinates.push([lon, lat]);
        }
        else {
            return ParseResult.failure('Unable to parse coordinate. Please format coordinate arrays like [lon, lat]');
        }
    }

    if (parsedCoordinates[0].toString().localeCompare(parsedCoordinates[parsedCoordinates.length - 1].toString()) !== 0) {
        return ParseResult.failure('A "Polygon" must be closed. The first and last "coordinates" are equivalent and must be identical.');
    }

    geometry.coordinates = parsedCoordinates;

    return ParseResult.success(geometry);
};

/**
 * Parses a date from a string
 * 
 * @param {string} dateString - a date string in the form YYYY-MM-DD
 * @returns {ParseResult} - returns Prase success with a moment object, or a parse failure
 */
const parseDate = (dateString) => {
    // Strictly parse the date
    const dateFmt = utils.shared.dateStringFormat();
    const m = moment(dateString, dateFmt, true);
    
    if (!m.isValid()) {
        return ParseResult.failure(`Unable to parse date from ${dateString}. The following date format(s) are supported [${dateFmt}]`);
    }

    return ParseResult.success(m);
};

/**
 * Parse a database id value from a string.
 * @param {string} idStr - the string to parse into an id
 * @returns {ParseResult} parse success with a number value, or a parse failure
 */
const parseId = (idStr) => {
    const id = parseInt(idStr, 10);

    return (isNaN(id) || !utils.db.isValidDbInteger(id)) ? 
        ParseResult.failure(`Expected a number between 1 and ${utils.db.DB_INTEGER_MAX}`) : 
        ParseResult.success(id);
};

/**
 * Parse a latitude value from a string
 * 
 * @param {string} latStr - A string that is parsable into a floating point number
 * @returns {ParseResult} - Parse success with a float value that is a latitude, or a failure message
 */
const parseLatitude = (latStr) => {
    const lat = parseFloat(latStr);
    const isValid = (!isNaN(lat) && validLatitude(lat));

    return isValid ?
        ParseResult.success(lat) :
        ParseResult.failure('Latitudes must be numbers between -90 and 90');
};

/**
 * Parse a longitude value from a string
 * 
 * @param {string} lonStr - A string that is parsable into a floating point number
 * @returns {ParseResult} - Parse success with a float value that is a longitude, or a failure message
 */
const parseLongitude = (lonStr) => {
    const lon = parseFloat(lonStr);
    const isValid = (!isNaN(lon) && validLongitude(lon));

    return isValid ?
        ParseResult.success(lon) :
        ParseResult.failure('Longitudes must be numbers between -180 and 180');
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
        : ParseResult.failure(`Project Names must be at least ${MIN_PROJECT_NAME_LENGTH} character(s) long`));
};

/**
 * Validates a Sponsors's name. Does not allow empty strings.
 * 
 * @param {*} name - the name of the sponsor to parse
 * @returns {ParseResult} parse success with a valid name or a parse failure
 */
const parseSponsorName = (name) => {
    return (parseString(name, MIN_PROJECT_NAME_LENGTH) 
        ? ParseResult.success(name) 
        : ParseResult.failure(`Sponsor names must be at least ${MIN_PROJECT_NAME_LENGTH} character(s) long`));
};

/**
 * Validates an Asset type's name. Does not allow empty strings.
 * 
 * @param {*} name - the name of the asset type to parse
 * @returns {ParseResult} parse success with a valid name or a parse failure
 */
const parseAssetTypeName = (name) => {
    return (parseString(name, MIN_PROJECT_NAME_LENGTH) 
        ? ParseResult.success(name) 
        : ParseResult.failure(`Asset type names must be at least ${MIN_PROJECT_NAME_LENGTH} character(s) long`));
};

/**
 * Validates if a radius string is a valid intenger.
 * 
 * @param {string} radiusString - the string to validate
 * @returns {number} - the radius as an integer.
 */
const parseRadius = (radiusString) => {
    const radius = parseInt(radiusString, 10);
    return (isNaN(radius) || !utils.db.isValidDbInteger(radius))
        ? ParseResult.failure(`Expected a number between 1 and ${utils.db.DB_INTEGER_MAX}`)
        : ParseResult.success(radius);
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
        assetTypeName: parseAssetTypeName,
        coordinates: parseCoordinates,
        date: parseDate,
        geometry: parseGeometry,
        latitude: parseLatitude,
        longitude: parseLongitude,
        project: parseProject,
        projectName: parseProjectName,
        sponsorName: parseSponsorName,
        radius: parseRadius
    },

    ParseResult
};
