const utils = require('../utils');
const moment = require('moment');


const QUERY_HISTORY = `
    SELECT 
        asset.id as asset_id,
        property.name  as property,
        history.value  as value,
        history.date   as date
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

const temporalSearch = async (asset_id, sponsor_id, project_id, asset_type_id, start_date, end_date) => {
    return '';
};

module.exports = { 
    temporalSearch 
};
