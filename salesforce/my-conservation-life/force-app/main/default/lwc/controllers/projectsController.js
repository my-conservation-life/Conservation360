import utils from 'c/utils';

const PROJECTS_URL = new URL(utils.URL);
PROJECTS_URL.pathname += '/projects';

/**
 * Find projects matching the provided filters
 *
 * @param {Object} [filters] - Mapping of parameter name to value to filter by
 * @param {number} [filters.id] - ID of the project to filter by
 * @param {number} [filters.sponsor_id] - ID of the Sponsor to filter by
 * @param {number} [filters.name] - Name of the Project to filter by
 *
 * @returns {Promise<Array>} promise of an array of Projects
 */
const find = (filters = {}) => {
    const { id, sponsor_id, name } = filters;
    const findURL = new URL(PROJECTS_URL.href);

    if ((typeof id !== 'undefined') && (id > 0)) {
        findURL.searchParams.append('id', id);
    }
    if ((typeof sponsor_id !== 'undefined') && (sponsor_id > 0)) {
        findURL.searchParams.append('sponsor_id', sponsor_id);
    }
    if ((typeof name !== 'undefined') && (name.length > 0)) {
        findURL.searchParams.append('name', name);
    }

    return utils.get(findURL.href);
};

/**
 * Creates a project in the open source database.
 * 
 * @param {Object} [project] - An api-readble object representing a project
 * @param {string} [project.sponsor_id] - the ID of the project's sponsor
 * @param {string} [project.name] - the name of the project
 * @param {string} [project.description] - the description of the project
 * 
 * @returns {Promise<number>} promise the ID of the newly created project
 */
const create = (project) => {
    const createURL = new URL(PROJECTS_URL.href);
    return utils.post(createURL.href, project);
};

/**
 * Updates an existing Project in the open source database. This does a full replace
 * of the project.
 * 
 * @param {number} id - The ID of the project to update
 * @param {Object} project - An api-readable object representing a project
 * @param {string} [project.id] - The ID of the project. This should match the other id parameter.
 * @param {string} [project.sponsor_id] - the ID of the project's sponsor
 * @param {string} [project.name] - the name of the project
 * @param {string} [project.description] - the description of the project
 * 
 * @return {Promise<number>} promise the ID of the updated project
 */
const update = (id, project) => {
    const updateURL = new URL(PROJECTS_URL.href);
    updateURL.pathname += `/${id}`;
    return utils.put(updateURL.href, {'project': project});
};
    
export default {
    find,
    create,
    update
};