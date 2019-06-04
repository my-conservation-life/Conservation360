import utils from 'c/utils';

/**
 * Find all assets, or assets of a particular project.
 * 
 * @param {number} [projectId] - Project ID. If not specified or not a positive integer, then return all assets.
 */
const find = (projectId) =>
    utils.get(utils.URL + 'assets' + ((typeof projectId === 'number' && projectId > 0) ? '?project_id=' + projectId : ''));

export default { find };
