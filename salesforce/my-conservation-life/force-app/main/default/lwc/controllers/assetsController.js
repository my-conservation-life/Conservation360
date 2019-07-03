import utils from 'c/utils';
import { isValidDbInteger } from './validate';

/**
 * Find all assets, or assets of a particular project.
 *
 * @param {Object} [filters] - Mapping of parameter name to value to filter by
 * @param {number} [filters.sponsorId] - Sponsor ID to filter with
 * @param {number} [filters.projectId] - Project ID to filter with
 * @param {number} [filters.assetTypeId] - Asset Type ID to filter with
 *
 * @returns {Promise<Array>} promise of an array of assets
 */
const find = (filters = {}) => {
    const { sponsorId, projectId, assetTypeId } = filters;

    const paramList = [].concat(
        isValidDbInteger(sponsorId) ? [`sponsor_id=${sponsorId}`] : [],
        isValidDbInteger(projectId) ? [`project_id=${projectId}`] : [],
        isValidDbInteger(assetTypeId) ? [`asset_type_id=${assetTypeId}`] : []
    );

    const paramString = paramList.length > 0 ? '?' + paramList.join('&') : '';

    return utils.get(utils.URL + 'assets' + paramString);
};

/**
 * create is used to generate an asset instance in the database
 * @param {*} asset An api-readble object representing an asset
 */
const create = (asset) => {
    const url = utils.URL + 'assets';
    return utils.post(url, asset);
};
    
export default {
    find,
    create
};
