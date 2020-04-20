const db = require('../db');

/**
 * Gets all the sponsors from the database.
 * @param {*} req - the request
 * @param {*} res - the response
 * @param {*} next - the next middleware function
 */
const getSponsors = async (req, res, next) => {
    const predicates = req.query;

    try {
        const sponsors = await db.sponsors.findSponsors(predicates);
        res.json(sponsors);
    } catch (e) {
        next(e);
    }
};

module.exports = {
    getSponsors
};
