/**
 * Maps Geometry Search request parameters to the correct db query parameters.
 */

const geomDb = require('../db/geometrySearch.db');

/**
 * Finds assets within a distance of a specified point
 * center(lon, lat)
 * 
 * @param {*} req - Incoming request
 * @param {*} res - Outgoing response
 * @param {*} next - The next middleware function
 */
const distanceFind = async (req, res, next) => {
    const lat = req.valid.latitude;
    const lon = req.valid.longitude;
    const radMeters = req.valid.radiusMeters;

    try {
        const assets = await geomDb.distanceFind(lat, lon, radMeters);
        res.json(assets);
    } catch (error) {
        next(error);
    }
};

/**
 * Finds assests within a rectangle formed by two points (x,y):
 * p1(minLon, minLat) and p2(maxLon, maxLat)
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

    try {
        const assets = await geomDb.envelopeFind(minLat, minLon, maxLat, maxLon);
        res.json(assets);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    distanceFind,
    envelopeFind
};


