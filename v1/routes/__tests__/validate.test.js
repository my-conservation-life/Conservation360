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
