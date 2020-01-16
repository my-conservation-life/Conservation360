/**
 * Finds assets that are geospacially related.
 */

// Limit on how many rows may be returned on a find
const QUERY_LIMIT = 50;

/**
 * Finds assets within a rectangular area. The parameters are 
 * xmin, ymin, xmax, ymax where x is the longitude of the asset and  
 * y is the latitude of the asset.
 */
const ENVELOPE_FIND = `
    SELECT
        a.id,
        s.name AS sponsor_name,
        p.name AS project_name,
        at.name AS asset_type,
        at.description AS asset_description,
        ST_Y(a.location) AS lat,
        ST_X(a.location) AS lon
    FROM
        asset a
        JOIN project p ON a.project_id = p.id
        JOIN sponsor s ON p.sponsor_id = s.id
        JOIN asset_type at ON a.asset_type_id = at.id
    WHERE
        ST_Within(a.location, ST_MakeEnvelope($1, $2, $3, $4))
    LIMIT
        $5;
`;

/**
 * Finds assets with in a radius of a specified center point (x,y).
 * The parameters are longitude, latitude, and radius in meters where
 * x is the longitude and y is the latitude.
 */
const DISTANCE_FIND = `
    SELECT 
        a.id,
        s.name AS sponsor_name,
        p.name AS project_name,
        at.name AS asset_type,
        at.description AS asset_description,
        ST_Y(a.location) AS lat,
        ST_X(a.location) AS lon
    FROM
        asset a
        JOIN project p ON a.project_id = p.id
        JOIN sponsor s ON p.sponsor_id = s.id
        JOIN asset_type at ON a.asset_type_id = at.id
    WHERE
        ST_DWithin(ST_SetSRID(a.location, 4326)::geography, 
                   ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography,
                   $3)
    LIMIT 
        $4;
`;

/**
 * Finds assets within a specified radius of a center longitude, latitude point.
 * 
 * @param {number} lat - the center latitude
 * @param {number} lon - the center longitude
 * @param {number} radMeters - the distance from the center point
 */
const distanceFind = async (lat, lon, radMeters) => {
    const params = [lon, lat, radMeters, QUERY_LIMIT];
    const result = await global.dbPool.query(DISTANCE_FIND, params);
    return result.rows;
};

/**
 * Finds assets within a rectangular area using the bottom left and top
 * right points of the rectangle.
 * 
 * @param {number} latMin - the minimum latitude (y coordinate) of the bounding box
 * @param {number} lonMin - the minimum longitude (x coordinate) of the bounding box
 * @param {number} latMax - the maximum latitude of the bounding box
 * @param {number} lonMax - the maximum latitude of the bounding box
 */
const envelopeFind = async (latMin, lonMin, latMax, lonMax) => {
    const params = [lonMin, latMin, lonMax, latMax, QUERY_LIMIT];
    const result = await global.dbPool.query(ENVELOPE_FIND, params);
    return result.rows;
};

module.exports = {
    distanceFind,
    envelopeFind
};
