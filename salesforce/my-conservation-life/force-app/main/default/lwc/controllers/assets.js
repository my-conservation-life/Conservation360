import { API_URL } from './config';

/**
 * Find all assets, or assets of a particular project.
 * 
 * @param {number} [projectId] - Project ID. If not specified or not a positive integer, then return all assets.
 */
const find = (projectId) =>
    fetch(API_URL + 'assets' + ((typeof projectId === 'number' && projectId > 0) ? '?project_id=' + projectId : ''))
    .then((response) => response.json());

export default { find };