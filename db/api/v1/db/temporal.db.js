const utils = require('../utils');

const QUERY_HISTORY = `
    SELECT 
        asset.id        AS asset_id,
        asset_type.name AS asset_type,
        property.name   AS property,
        history.value   AS value,
        history.date    AS date,
        sponsor.name    AS sponsor_name,
        project.name    AS project_name,
        ST_X(asset.location) AS longitude,
        ST_Y(asset.location) AS latitude
    FROM
        asset
        JOIN history    ON asset.id = history.asset_id
        JOIN property   ON history.property_id = property.id
        JOIN asset_type ON asset.asset_type_id = asset_type.id
        JOIN project    ON asset.project_id = project.id
        JOIN sponsor    ON project.sponsor_id = sponsor.id
    WHERE
        TRUE
`;

const ORDER_BY = `
    ORDER BY
        asset.id ASC,
        history.date DESC
`;

const D_WITHIN = `
    ST_DWithin(ST_SetSRID(asset.location, 4326)::geography, 
        ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography,
        $3)
`;

const POLYGON_WITHIN = `
    ST_Within(asset.location, ST_MakePolygon(ST_GeomFromText($1)))
`;
/**
 * Searches the history table for asset properties that fall within specific search parameters
 * 
 * @param {geometry} geometry - a GeoJson geometry
 * @param {number} asset_id - A specific asset's id
 * @param {string} sponsor_name - A sponsor's id
 * @param {string} project_name - A projects's id
 * @param {string} asset_type_name - An asset type's id
 * @param {moment} start_date - A temporal lower bound of the history search
 * @param {moment} end_date - A temporal upper bound of the history search
 * 
 * Using GeoJSON as a template https://tools.ietf.org/html/rfc7946
 * @returns {FeatureCollection} GeoJson - the historic properties of assets that meet the search parameters formatted following the GeoJSON standard.
 * 
 */
const temporalSearch = async (geometry, asset_id, sponsor_name, project_name, asset_type_name, start_date, end_date) => {
    let query = QUERY_HISTORY;
    let values = [];

    switch (geometry.type) {
        case 'Circle':
            values.push(geometry.coordinates[0]);
            values.push(geometry.coordinates[1]);
            values.push(geometry.radius);
            query += ' AND ' + D_WITHIN + ' ';
            break;
        case 'Polygon':
            values.push(utils.db.makeLineStringFromGeoJsonCoordinates(geometry.coordinates));
            query += ' AND ' + POLYGON_WITHIN + ' ';
            break;
    }

    if ((typeof asset_id !== 'undefined') && (asset_id > 0)) {
        values.push(asset_id);
        query += ` AND asset.id = $${values.length}` + ' ';
    }
    if ((typeof sponsor_name !== 'undefined') && (sponsor_name !== '')) {
        values.push(sponsor_name);
        query += ` AND LOWER(sponsor.name) = LOWER($${values.length})` + ' ';
    }
    if ((typeof project_name !== 'undefined') && (project_name !== '')) {
        values.push(project_name);
        query += ` AND LOWER(project.name) = LOWER($${values.length})` + ' ';
    }
    if ((typeof asset_type_name !== 'undefined') && (asset_type_name !== '')) {
        values.push(asset_type_name);
        query += ` AND LOWER(asset_type.name) = LOWER($${values.length})` + ' ';
    }
    if ((typeof start_date !== 'undefined') || (typeof end_date !== 'undefined')) {
        const has_start_date = (typeof start_date !== 'undefined');
        const has_end_date = (typeof end_date !== 'undefined');

        if (has_start_date && has_end_date) {
            if (start_date.isValid() && end_date.isValid()) {
                values.push(start_date.format(utils.shared.dateStringFormat()));
                const idx_start = values.length;
                values.push(end_date.format(utils.shared.dateStringFormat()));
                const idx_end = values.length;
                query += ` AND history.date BETWEEN $${idx_start} AND $${idx_end}` + ' ';
            }

        } else if (has_start_date) {
            if (start_date.isValid()) {
                values.push(start_date.format(utils.shared.dateStringFormat()));
                query += ` AND history.date >= $${values.length}` + ' ';
            }
        } else if (has_end_date) {
            if (end_date.isValid()){
                values.push(end_date.format(utils.shared.dateStringFormat()));
                query += ` AND history.date <= $${values.length}` + ' ';
            }
        }
    }

    query += ORDER_BY;

    const result = await global.dbPool.query(query, values);

    var temporal_results = [];
    // Should be ordered by asset id then ordered by date
    var last_asset_id = -1;
    var last_asset_date = '';
    var row = {};
    for (var i = 0; i < result.rows.length; i++) {
        row = result.rows[i];
        // Start a new asset record
        if (last_asset_id != row.asset_id || !(last_asset_date.localeCompare(row.date.toString()) == 0)) {
            last_asset_id = row.asset_id;
            last_asset_date = row.date.toString();

            temporal_results.push({
                'type': 'Feature',
                'geometry' : {
                    'type' : 'Point',
                    'coordinates' : [row.longitude, row.latitude]
                },
                'properties': {
                    'asset_id' : row.asset_id,
                    'asset_type' : row.asset_type,
                    'asset_properties' : [],
                    'sponsor_name': row.sponsor_name,
                    'project_name': row.project_name,
                    'date': row.date,
                }});
        }

        temporal_results[temporal_results.length - 1]['properties']['asset_properties'].push({'property': row.property, 'value': row.value});
    }

    return {'type': 'FeatureCollection', 'features' : temporal_results};
};

module.exports = { 
    temporalSearch 
};
