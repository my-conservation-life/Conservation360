import { LightningElement, wire, track } from 'lwc';
import {assets, assetDefinitions} from 'c/controllers';
import{CurrentPageReference} from 'lightning/navigation';
import { registerListener, unregisterAllListeners } from 'c/pubsub';

//Columns currently in our data tables
const columns = [
    { label: 'Asset ID', fieldName: 'id', type: 'number'},
    { label: 'Project ID', fieldName: 'project_id', type: 'number'},
    { label: 'Asset Type', fieldName: 'asset_type_id', type: 'number'},
    { label: 'Latitude', fieldName: 'latitude', type: 'number' },
    { label: 'Longitude', fieldName: 'longitude', type: 'number'},
];

//Loads assets into the table through a database query, as found in the controllers
export default class DisplayAssets extends LightningElement {
    @wire(CurrentPageReference) pageRef;
    @track selectedSponsor;
    @track selectedProject;
    @track selectedAsset;
    sponsor_id = '';
    project_id = 999;
    asset_id = '';
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

    /*
    / Handle different query updates, each will update the table as needed
    /
    */

    //Handle Sponsor Update
    updateSponsor(sponsor){
        console.log(this.sponsor_id);
        this.sponsor_id = sponsor;
        this.updateTable();
    }
    //Handle Project Update
    updateProject(project){
        console.log(this.project_id);
        this.project_id = project;
        this.updateTable();
    }
    //Handle Asset Update
    updateAsset(asset){
        console.log(this.asset_id);
        this.asset_id = asset;
        this.updateTable();
    }

    /*
    / Update table with newest queries
    /
    */
    updateTable() {
        assets.find(parseInt(this.project_id, 10)).then( response => { this.data = response; } );
        //TODO: display text, numbers bad
        
        this.tableLoadingState = false;
        console.log('Updated Table');
    }

    disconnectedCallback() {
        unregisterAllListeners(this);
    }
}
