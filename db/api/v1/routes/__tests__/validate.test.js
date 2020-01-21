const { validate, ParseResult, type, param } = require('../validate');

describe('validate', () => {
    let extractQueryParam;
    let succeedingParser;
    let failingParser;

    let req;
    let res;
    let next;

    const SUCCEEDING_PARSER_VALUE = 'mock success';
    const FAILING_PARSER_ERROR = 'mock failure';

    beforeEach(() => {
        extractQueryParam = jest.fn((req, paramName) => req.query[paramName]);
        succeedingParser = jest.fn(() => ParseResult.success(SUCCEEDING_PARSER_VALUE));
        failingParser = jest.fn(() => ParseResult.failure(FAILING_PARSER_ERROR));

        req = {
            query: {}
        };

        res = {
            json: jest.fn(),
            status: jest.fn(() => res)
        };

        next = jest.fn();
    });

    it('returns a function', () => {
        const ret = validate(extractQueryParam, 'test', failingParser);
        expect(typeof ret === 'function').toBe(true);
    });

    it('sends HTTP 400 with a JSON response when the parse fails', () => {
        req.query.test = 'a';
        const validator = validate(extractQueryParam, 'test', failingParser);
        validator(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalled();
    });

    it('sends HTTP 400 with a JSON response when missing required param', () => {
        const validator = validate(param.query, 'id', type.id, true);
        validator(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalled();
    });

    it('adds parsed value to req.valid when parse succeeds', () => {
        req.query.test = '2';
        const validator = validate(extractQueryParam, 'test', succeedingParser);
        validator(req, res, next);
        expect(req).toEqual(expect.objectContaining({
            valid: {
                test: SUCCEEDING_PARSER_VALUE
            }
        }));
    });

    it('allows requests when the given parameter is not specified', () => {
        const validator = validate(extractQueryParam, 'test', failingParser);
        validator(req, res, next);
        expect(next).toHaveBeenCalledWith();
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });

    it('does not delete any existing req.valid entries', () => {
        const ALREADY_VALID_VALUE = 'do not delete';
        req.valid = {
            already_valid: ALREADY_VALID_VALUE
        };
        const validator = validate(extractQueryParam, 'test', succeedingParser);
        validator(req, res, next);
        expect(req).toEqual(expect.objectContaining({
            valid: {
                already_valid: ALREADY_VALID_VALUE
            }
        }));
    });
});

describe('validate.type.coordinates', () => {

    // Temp function to create point objects
    let pack = (lon, lat) => {
        return {latitude: lat, longitude:lon};
    };

    it('rejects empty coordinates array', () => {
        const emptyCoords = [];
        const result = type.coordinates(emptyCoords);
        expect(result.isFailure).toBeTruthy();
    });

    it('rejects coordinates array with only 2 points', () => {
        const twoCoords = [pack('1.1', '3.3'), pack('22', '-23')];
        const result = type.coordinates(twoCoords);
        expect(result.isFailure).toBeTruthy();
        expect(result.error).toEqual(
            expect.stringContaining('Expected at least 3 points in the coordinates list')
        );
    });

    it('rejects coordinates that are malformed', () => {
        const badCoords = [pack('word', '3.3'), pack('22', '-23'), pack('a', '23')];
        const result = type.coordinates(badCoords);
        expect(result.isFailure).toBeTruthy();
        expect(result.error).toEqual(
            expect.stringContaining('Unable to parse coordinate. Please format')
        );
    });

    it('rejects malformed requests', () => {
        const badCoords = [{somethingelse: 403}, pack('22', '-23'), pack('3', '23')];
        const result = type.coordinates(badCoords);
        expect(result.isFailure).toBeTruthy();
        expect(result.error).toEqual(
            expect.stringContaining('Unable to parse coordinate. Please format')
        );
    });

    it('rejects malformed latitudes that are too big', () => {
        const badCoords = [pack('22', '200'), pack('22', '-23'), pack('3', '23')];
        const result = type.coordinates(badCoords);
        expect(result.isFailure).toBeTruthy();
        expect(result.error).toEqual(
            expect.stringContaining('Unable to parse coordinate. Please format')
        );
    });

    it('rejects malformed latitudes that are too small', () => {
        const badCoords = [pack('22', '2'), pack('22', '-23'), pack('3', '-200')];
        const result = type.coordinates(badCoords);
        expect(result.isFailure).toBeTruthy();
        expect(result.error).toEqual(
            expect.stringContaining('Unable to parse coordinate. Please format')
        );
    });

    it('rejects malformed longitudes that are too big', () => {
        const badCoords = [pack('12', '-10.30'), pack('181', '-23'), pack('10', '23')];
        const result = type.coordinates(badCoords);
        expect(result.isFailure).toBeTruthy();
        expect(result.error).toEqual(
            expect.stringContaining('Unable to parse coordinate. Please format')
        );
    });

    it('rejects malformed longitudes that are too small', () => {
        const badCoords = [pack('22', '20'), pack('22.3', '-23'), pack('-181', '23')];
        const result = type.coordinates(badCoords);
        expect(result.isFailure).toBeTruthy();
        expect(result.error).toEqual(
            expect.stringContaining('Unable to parse coordinate. Please format')
        );
    });

    it('accepts a well formed request', () => {
        const goodCoords = [pack('22.4', '20'), pack('22.3', '-23.1111'), pack('-20', '23')];
        const expected = [pack(22.4, 20), pack(22.3, -23.1111), pack(-20, 23)];
        const result = type.coordinates(goodCoords);
        expect(result.isSuccess).toBeTruthy();
        expect(result.value).toEqual(
            expect.arrayContaining(expected)
        );
    });
});

describe('validate.type.id', () => {
    it('rejects 0', () => {
        const result = type.id('0');
        expect(result.isFailure()).toBe(true);
    });

    it('accepts 1', () => {
        const result = type.id('1');
        expect(result.isSuccess()).toBe(true);
        expect(result.value).toBe(1);
    });

    it('rejects negative numbers', () => {
        const result = type.id('-1');
        expect(result.isFailure()).toBe(true);
    });

    it('rejects the empty string', () => {
        const result = type.id('');
        expect(result.isFailure()).toBe(true);
    });

    it('rejects alphabetic characters', () => {
        const result = type.id('b');
        expect(result.isFailure()).toBe(true);
    });
});

describe('validate.type.latitude', () => {
    it('rejects strings', () => {
        const result = type.latitude('hello world');
        expect(result.isFailure()).toBe(true);
    });

    it('rejects empty strings', () => {
        const result = type.latitude('');
        expect(result.isFailure()).toBe(true);
    });

    it('accepts 90.0', () => {
        const result = type.latitude('90.0');
        expect(result.isSuccess()).toBe(true);
        expect(result.value).toBe(90.0);
    });

    it('accepts -90.0', () => {
        const result = type.latitude('-90.0');
        expect(result.isSuccess()).toBe(true);
        expect(result.value).toBe(-90.0);
    });

    it('accepts 80.78373163637', () => {
        const result = type.latitude('80.78373163637');
        expect(result.isSuccess()).toBe(true);
        expect(result.value).toBe(80.78373163637);
    });

    it('rejects 90.000391', () => {
        const result = type.latitude('90.000391');
        expect(result.isFailure()).toBe(true);
    });

    it('rejects -90.000391', () => {
        const result = type.latitude('-90.000391');
        expect(result.isFailure()).toBe(true);
    });
});

describe('validate.type.longitude', () => {
    it('rejects strings', () => {
        const result = type.longitude('hello world');
        expect(result.isFailure()).toBe(true);
    });

    it('rejects empty strings', () => {
        const result = type.longitude('');
        expect(result.isFailure()).toBe(true);
    });

    it('accepts 180.0', () => {
        const result = type.longitude('180.0');
        expect(result.isSuccess()).toBe(true);
        expect(result.value).toBe(180.0);
    });

    it('accepts -180.0', () => {
        const result = type.longitude('-180.0');
        expect(result.isSuccess()).toBe(true);
        expect(result.value).toBe(-180.0);
    });

    it('accepts 80.78373163637', () => {
        const result = type.longitude('80.78373163637');
        expect(result.isSuccess()).toBe(true);
        expect(result.value).toBe(80.78373163637);
    });

    it('rejects 180.042391', () => {
        const result = type.longitude('180.042391');
        expect(result.isFailure()).toBe(true);
    });

    it('rejects -180.042391', () => {
        const result = type.longitude('-180.042391');
        expect(result.isFailure()).toBe(true);
    });
});

describe('validate.type.projectName', () => {
    it('rejects null', () => {
        const result = type.projectName(null);
        expect(result.isFailure()).toBeTruthy();
    });

    it('rejects the empty string', () => {
        const result = type.projectName('');
        expect(result.isFailure()).toBeTruthy();
    });

    it('accepts "a"', () => {
        const result = type.projectName('a');
        expect(result.isSuccess()).toBeTruthy();
        expect(result.value).toBe('a');
    });

    it('accepts "Madagascar Reforestation"', () => {
        const result = type.projectName('Madagascar Reforestation');
        expect(result.isSuccess()).toBeTruthy();
        expect(result.value).toBe('Madagascar Reforestation');
    });
});

describe('validate.type.radius', () => {
    it('rejects 0', () => {
        const result = type.radius('0');
        expect(result.isFailure()).toBe(true);
    });

    it('accepts 1', () => {
        const result = type.radius('1000');
        expect(result.isSuccess()).toBe(true);
        expect(result.value).toBe(1000);
    });

    it('rejects negative numbers', () => {
        const result = type.radius('-1000');
        expect(result.isFailure()).toBe(true);
    });

    it('rejects the empty string', () => {
        const result = type.radius('');
        expect(result.isFailure()).toBe(true);
    });

    it('rejects alphabetic characters', () => {
        const result = type.radius('abc');
        expect(result.isFailure()).toBe(true);
    });
});

describe('validate.type.assetDefinition', () => {
    let assetDefinition;

    beforeEach(() => {
        assetDefinition = {
            'name': 'tname',
            'description': 'tdesc',
            'properties': [
                {
                    'name': 'tprop1',
                    'data_type': 'number',
                    'required': true,
                    'is_private': false
                },
                {
                    'name': 'tprop2',
                    'data_type': 'boolean',
                    'required': false,
                    'is_private': true
                }
            ]
        };
    });

    // Test Asset Definition Type
    it('accepts valid assetDefinition', () => {
        const result = type.assetDefinition(assetDefinition);
        expect(result.isSuccess()).toBe(true);
    });

    it('rejects empty name', () => {
        assetDefinition.name = '';
        const result = type.assetDefinition(assetDefinition);
        expect(result.isFailure()).toBe(true);
    });

    it('rejects name > 50 characters', () => {
        assetDefinition.name = 'x'.repeat(51);
        const result = type.assetDefinition(assetDefinition);
        expect(result.isFailure()).toBe(true);
    });

    it('rejects incorrect type for description', () => {
        assetDefinition.description = 5;
        const result = type.assetDefinition(assetDefinition);
        expect(result.isFailure()).toBe(true);
    });

    it('accepts undefined description', () => {
        assetDefinition.description = undefined;
        const result = type.assetDefinition(assetDefinition);
        expect(result.isSuccess()).toBe(true);
    });

    // Test Properties
    it('rejects undefined properties', () => {
        assetDefinition.properties = undefined;
        const result = type.assetDefinition(assetDefinition);
        expect(result.isFailure()).toBe(true);
    });

    it('rejects empty properties', () => {
        assetDefinition.properties = [];
        const result = type.assetDefinition(assetDefinition);
        expect(result.isFailure()).toBe(true);
    });

    it('rejects empty property name', () => {
        assetDefinition.properties[0].name = '';
        const result = type.assetDefinition(assetDefinition);
        expect(result.isFailure()).toBe(true);
    });

    it('rejects property name > 50 characters', () => {
        assetDefinition.properties[0].name = 'x'.repeat(51);
        const result = type.assetDefinition(assetDefinition);
        expect(result.isFailure()).toBe(true);
    });

    it('rejects incorrect property dataType', () => {
        assetDefinition.properties[0].data_type = 'coordinate';
        const result = type.assetDefinition(assetDefinition);
        expect(result.isFailure()).toBe(true);
    });

    it('rejects incorrect type for property dataType', () => {
        assetDefinition.properties[0].data_type = { 'coordinate': 123 };
        const result = type.assetDefinition(assetDefinition);
        expect(result.isFailure()).toBe(true);
    });

    it('rejects string property required', () => {
        assetDefinition.properties[0].required = 'true';
        const result = type.assetDefinition(assetDefinition);
        expect(result.isFailure()).toBe(true);
    });

    it('rejects string property isPrivate', () => {
        assetDefinition.properties[0].is_private = 'true';
        const result = type.assetDefinition(assetDefinition);
        expect(result.isFailure()).toBe(true);
    });
});

describe('validate.type.project', () => {
    let project;

    beforeEach(() => {
        project = {
            'sponsor_id': '1',
            'name': 'tname1',
            'description': 'tdesc1'
        };
    });

    it('accepts a valid project', () => {
        const result = type.project(project);
        expect(result.isSuccess()).toBeTruthy();
    });

    it('accepts an empty description', () => {
        project.description = '';
        const result = type.project(project);
        expect(result.isSuccess()).toBeTruthy();
    });

    it('accepts an undefined description', () => {
        project.description = undefined;
        const result = type.project(project);
        expect(result.isSuccess()).toBeTruthy();
    });

    it('accepts a missing description', () => {
        delete project.description;
        const result = type.project(project);
        expect(result.isSuccess()).toBeTruthy();
    });

    it('rejects empty name', () => {
        project.name = '';
        const result = type.project(project);
        expect(result.isFailure()).toBeTruthy();
        expect(result.error).toEqual(
            expect.stringContaining('Project Names must be at least')
        );
    });

    it('rejects "a" as a sponsor_id', () => {
        project.sponsor_id = 'a';
        const result = type.project(project);
        expect(result.isFailure()).toBeTruthy();
        expect(result.error).toEqual(
            expect.stringContaining('Expected a number between 1 and')
        );
    });

    it('rejects "0" as a sponsor_id', () => {
        project.sponsor_id = '0';
        const result = type.project(project);
        expect(result.isFailure()).toBeTruthy();
        expect(result.error).toEqual(
            expect.stringContaining('Expected a number between 1 and')
        );
    });
});

describe('validate.param.query', () => {
    it('extracts 2 from query string', () => {
        const req = {
            query: {
                test: '2'
            }
        };

        const result = param.query(req, 'test');
        expect(result).toBe('2');
    });

    it('returns undefined when extracting a parameter that does not exist', () => {
        const req = {
            query: {}
        };

        const result = param.query(req, 'test');
        expect(result).toBe(undefined);
    });
});

describe('validate.param.body', () => {
    it('extracts 2 from body string', () => {
        const req = {
            body: {
                test: '2'
            }
        };

        const result = param.body(req, 'test');
        expect(result).toBe('2');
    });

    it('returns undefined when extracting a parameter from body that does not exist', () => {
        const req = {
            body: {}
        };

        const result = param.body(req, 'test');
        expect(result).toBe(undefined);
    });
});

describe('validate.param.params', () => {
    it('extracts 7 from params string', () => {
        const req = {
            body: {
                test: 'Not in Here'
            },
            params: {
                test: '7'
            }
        };

        const result = param.params(req, 'test');
        expect(result).toBe('7');
    });

    it('returns undefined when extracting a parameter from params that does not exist', () => {
        const req = {
            body: {},
            params: {}
        };

        const result = param.params(req, 'test');
        expect(result).toBe(undefined);
    });
});
