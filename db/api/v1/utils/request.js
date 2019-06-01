/**
 * Call the callback if the value of the given query string parameter can be parsed by parser.
 * Otherwise, send an error response.
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @param {string} param Name of the required parameter in the query string
 * @param {*} parser 
 * @param {*} onSuccess 
 * @param {*} [onNotSpecified]
 */
const withQueryParam = (req, res, param, parser, onSuccess, onNotSpecified = (() => {})) => {
    const paramValue = req.query[param];

    if (typeof paramValue !== 'string') {
        onNotSpecified();
        return;
    }

    const parseResult = parser(paramValue);

    if (parseResult.error) {
        res.status(500).send({ error: `Invalid argument for the ${param} parameter. Error: ` + parseResult.error })
    } else {
        onSuccess(parseResult.value);
    }
};

module.exports = {
    withQueryParam
};