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