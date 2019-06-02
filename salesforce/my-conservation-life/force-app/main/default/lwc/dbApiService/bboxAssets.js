import { API_URL } from './config';

/**
 * Get the bounding box of assets.
 * 
 * @param {number} [projectId] - Project ID. If not specified or not a positive integer, then consider all assets.
 */
const get = (projectId) =>
    fetch(API_URL + 'bbox-assets' + ((typeof projectId === 'number' && projectId > 0) ? '?project_id=' + projectId : ''))
    .then((response) => response.json());

export default { get };