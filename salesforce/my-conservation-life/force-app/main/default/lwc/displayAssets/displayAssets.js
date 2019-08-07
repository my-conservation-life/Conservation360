import { LightningElement, wire, track } from 'lwc';
import { assets } from 'c/controllers';
import { CurrentPageReference } from 'lightning/navigation';
import { registerListener, unregisterAllListeners } from 'c/pubsub';

//Columns currently in our data tables
const columns = [
    {
        label: 'Sponsor',
        fieldName: 'sponsor_name',
        type: 'string'
    },
    {
        label: 'Project Name',
        fieldName: 'project_name',
        type: 'string'
    },
    {
        label: 'Asset ID',
        fieldName: 'asset_id',
        type: 'number'
    },
    {
        label: 'Asset Type',
        fieldName: 'asset_type',
        type: 'string'
    },
    {
        label: 'Asset Description',
        fieldName: 'asset_description',
        type: 'string'
    },
    {
        label: 'Latitude',
        fieldName: 'latitude',
        type: 'number'
    },
    {
        label: 'Longitude',
        fieldName: 'longitude',
        type: 'number'
    }
];

//Loads assets into the table through a database query, as found in the controllers
export default class DisplayAssets extends LightningElement {
  @wire(CurrentPageReference) pageRef;
  @track selectedSponsor;
  @track selectedProject;
  @track selectedAsset;
  sponsor_id = 0;
  project_id = 0;
  asset_id = 0;
  @track data = [];
  @track columns = columns;
  @track tableLoadingState = true;

  connectedCallback() {
      registerListener('selectedSponsor', this.updateSponsor, this);
      registerListener('selectedProject', this.updateProject, this);
      registerListener('selectedAsset', this.updateAsset, this);
      //Search for assets on a per-project basis
      console.log('Listeners Registered');
  }
  /**
   *
   * Update Sponsor, Project, and Asset
   *
   * @param {number} sponsor
   * @param {number} project
   * @param {number} asset
   */

  //Handle Sponsor Update
  updateSponsor(sponsor) {
      this.sponsor_id = sponsor;
      console.log(this.sponsor_id);
      this.updateTable();
  }
  //Handle Project Update
  updateProject(project) {
      this.project_id = project;
      console.log(this.project_id);
      this.updateTable();
  }
  //Handle Asset Update
  updateAsset(asset) {
      this.asset_id = asset;
      console.log(this.asset_id);
      this.updateTable();
  }

  /**
   * Update table with latest queries
   */
  updateTable() {
      assets
          .find({
              sponsorId: parseInt(this.sponsor_id, 10),
              projectId: parseInt(this.project_id, 10),
              assetTypeId: parseInt(this.asset_id, 10)
          })
          .then(response => {
              this.data = response;
          });

      this.tableLoadingState = false;
      console.log('Updated Table');
  }

  disconnectedCallback() {
      unregisterAllListeners(this);
  }
}
