import utils from 'c/utils';

/**
 * Find all assets, or assets of a particular project.
 *
 * @param {number} [projectId] - Project ID. If not specified or not a positive integer, then return all assets.
 */
const find = (sponsorId, projectId, assetId) =>
    utils.get(
        utils.URL +
      'assets?sponsor_id=' +
      sponsorId +
      '&project_id=' +
      projectId +
      '&asset_type_id=' +
      assetId
    );

export default { find };
