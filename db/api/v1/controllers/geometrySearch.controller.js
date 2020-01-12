/**
 * Maps Geometry Search request parameters to the correct db query parameters.
 */

const geomDb = require('../db/geometrySearch.db');

/**
 * Finds assests within a rectangle formed by two points (x,y):
 * p1(minLat, minLon) and p2(maxLat, maxLon)
 * 
 * @param {*} req - Incoming request
 * @param {*} res - Outgoing response
 * @param {*} next - The next middleware function
 */
const envelopeFind = async (req, res, next) => {
    const minLat = req.valid.minimumLatitude;
    const minLon = req.valid.minimumLongitude;
    const maxLat = req.valid.maximumLatitude;
    const maxLon = req.valid.maximumLongitude;

    // TODO: Make sure min <= max

    try {
        const assets = await geomDb.envelopeFind(minLat, minLon, maxLat, maxLon);
        res.json(assets);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    envelopeFind
};
