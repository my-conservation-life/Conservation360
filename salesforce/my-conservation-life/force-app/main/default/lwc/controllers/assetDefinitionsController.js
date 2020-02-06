import utils from 'c/utils';

/**
 * Finds all asset types.
 */
const fetchAssetTypes = () => {
    const url = utils.URL + 'assetTypes';
    return utils.get(url);
};

const find = () => {
    const url = utils.URL + 'assetDefinitions';
    return utils.get(url);
};

const create = (assetDefinition) => {
    const url = utils.URL + 'assetDefinitions';
    return utils.post(url, assetDefinition);
};

/**
 * Send selected CSV file to server
 * 
 * @param {Number} assetTypeId ID of the asset type selected in combobox
 * @param {File} csv CSV file whose data is to be imported
 * 
 * @returns {Promise<Object>} Promise of an object that contains whether the CSV was imported successfully. 
 *                            If not, there is also an error message. 
 */
const sendCSV = (assetTypeId, csv) => {
    const url = utils.URL + 'csv';
    return utils.putCSV(url, assetTypeId, csv);
};

export default {
    fetchAssetTypes,
    find,
    create,
    sendCSV
};
