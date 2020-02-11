const utils = require('../utils');
const moment = require('moment');

const QUERY_HISTORY = `
    SELECT 
        asset.id        as asset_id,
        asset_type.name as asset_type
        property.name   as property,
        history.value   as value,
        history.date    as date,
        sponsor.name    as sponsor_name,
        project.name    as project_name
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
    ST_DWithin(ST_SetSRID(a.location, 4326)::geography, 
        ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography,
        $3)
`;

const POLYGON_WITHIN = `
    ST_Within(a.location, ST_MakePolygon(ST_GeomFromText($1)))
`;
/**
 * Searches the history table for asset properties that fall within specific search parameters
 * 
 * @param {geometry} geometry - a GeoJson geometry
 * @param {number} asset_id - A specific asset's id
 * @param {number} sponsor_id - A sponsor's id
 * @param {number} project_id - A projects's id
 * @param {number} asset_type_id - An asset type's id
 * @param {moment} start_date - A temporal lower bound of the history search
 * @param {moment} end_date - A temporal upper bound of the history search
 * 
 * @returns {*} rows - the historic properties that meet the serach parameters
 */
const temporalSearch = async (geometry, asset_id, sponsor_id, project_id, asset_type_id, start_date, end_date) => {
    let query = QUERY_HISTORY;
    let values = [];

    switch (geometry.type) {
    case 'Cirlce':
        values.push(geometry.coordinates[0]);
        values.push(geometry.coordinates[1]);
        values.push(geometry.radius);
        query += 'AND ' + D_WITHIN + ' ';
        break;
    case 'Polygon':
        values.push(utils.db.makeLineStringFromGeoJsonCoordinates(geometry.coordinates));
        query += 'AND ' + POLYGON_WITHIN + ' ';
        break;
    }

    if ((typeof asset_id !== 'undefined') && (asset_id > 0)) {
        values.push(asset_id);
        query += `AND asset.id = $${values.length}` + ' ';
    }
    if ((typeof sponsor_id !== 'undefined') && (sponsor_id > 0)) {
        values.push(sponsor_id);
        query += query + `AND sponsor.id = $${values.length}` + ' ';
    }
    if ((typeof project_id !== 'undefined') && (project_id > 0)) {
        values.push(project_id);
        query += `AND project.id = $${values.length}` + ' ';
    }
    if ((typeof asset_type_id !== 'undefined') && (asset_type_id > 0)) {
        values.push(asset_type_id);
        query += `AND asset_type.id = $${values.length}` + ' ';
    }
    if((typeof start_date !== 'undefined') || (typeof end_date !== 'undefined')) {
        const has_start_date = (typeof start_date !== 'undefined');
        const has_end_date = (typeof end_date !== 'undefined');

        if (has_start_date && has_end_date) {
            if(start_date.isValid() && end_date.isValid()) {
                values.push(start_date.format(utils.shared.dateStringFormat()));
                const idx_start = values.length;
                values.push(end_date.format(utils.shared.dateStringFormat()));
                const idx_end = values.length;
                query += `AND history.date BETWEEN $${idx_start} AND $${idx_end}` + ' ';
            }

        } else if (has_start_date) {
            if(start_date.isValid()) {
                values.push(start_date.format(utils.shared.dateStringFormat()));
                query += `AND history.date >= $${values.length}` + ' ';
            }
        } else if (has_end_date) {
            if(end_date.isValid()){
                values.push(end_date.format(utils.shared.dateStringFormat()));
                query += `AND history.date <= $${values.length}` + ' ';
            }
        }
    }

    query += ORDER_BY;

    const result = await global.dbPool.query(query, values);

    var temporal_results = [];
    var temporal_property = {'property' : '', 'value': ''};
    var temporal_asset = {
        'asset_id' : -1,
        'asset_type' : '',
        'properties' : [],
        'sponsor_name': '',
        'project_name': '',
        'date': ''
    };

    // Should be ordered by asset id then ordered by date
    var row = {};
    for (var i = 0; i < result.rows; i++) {
        row = result.rows[i];
        // Start a new asset record
        if (row.asset_id != temporal_asset['asset_id'] || row.date != temporal_asset['date']) {
            if (i != 0)
                temporal_results.push(temporal_asset);

            temporal_asset['asset_id']     = row.asset_id;
            temporal_asset['asset_type']   = row.asset_type;
            temporal_asset['properties']   = [];
            temporal_asset['sponsor_name'] = row.sponsor_name;
            temporal_asset['project_name'] = row.project_name;
            temporal_asset['date']         = row.date;
        }

        temporal_property['property'] = row.property;
        temporal_property['value']    = row.value;
        temporal_asset['properties'].push(temporal_property);
    }

    return temporal_results;
};

module.exports = { 
    temporalSearch 
};
