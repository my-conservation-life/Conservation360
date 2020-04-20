import utils from 'c/utils';

const PROJECTS_URL = utils.URL + 'projects';

/**
 * Find projects matching the provided filters
 *
 * @param {Object} [filters] - Mapping of parameter name to value to filter by
 * @param {Number} [filters.id] - ID of the project to filter by
 * @param {Number} [filters.sponsor_id] - ID of the Sponsor to filter by
 * @param {Number} [filters.name] - Name of the Project to filter by
 *
 * @returns {Promise<Array>} promise of an array of Projects
 */
const find = (filters = {}) => {
    const { id, sponsor_id, name } = filters;
    const findURL = new URL(PROJECTS_URL);

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
 * @returns {Promise<Number>} promise the ID of the newly created project
 */
const create = (project) => {
    const createURL = new URL(PROJECTS_URL);
    return utils.post(createURL.href, project);
};

/**
 * Updates an existing Project in the open source database. This does a full replace
 * of the project.
 * 
 * @param {Number} id - The ID of the project to update
 * @param {Object} project - An api-readable object representing a project
 * @param {string} [project.id] - The ID of the project. This should match the other id parameter.
 * @param {string} [project.sponsor_id] - the ID of the project's sponsor
 * @param {string} [project.name] - the name of the project
 * @param {string} [project.description] - the description of the project
 * 
 * @return {Promise<Number>} promise the ID of the updated project
 */
const update = (id, project) => {
    const updateURL = new URL(PROJECTS_URL + `/${id}`);
    return utils.put(updateURL.href, {'project': project});
};

/**
 * Finds all projects.
 */
const fetchAllProjects = () => {
    const url = utils.URL + 'all_projects';
    return utils.get(url);
};
    
export default {
    find,
    create,
    update,
    fetchAllProjects
};
