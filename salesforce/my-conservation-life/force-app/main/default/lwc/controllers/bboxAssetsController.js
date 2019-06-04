import utils from 'c/utils';

/**
 * Get the bounding box of assets.
 * 
 * @param {number} [projectId] - Project ID. If not specified or not a positive integer, then consider all assets.
 */
const get = (projectId) =>
    utils.get(utils.URL + 'bbox-assets' + ((typeof projectId === 'number' && projectId > 0) ? '?project_id=' + projectId : ''));

export default { get };
