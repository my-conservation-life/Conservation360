import { LightningElement, wire, track } from 'lwc';
import {assets} from 'c/controllers';
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
    @track selectedProject;
    project_id;
    @track title;
    @track data = [];
    @track columns = columns;
    @track tableLoadingState = true;

    connectedCallback() {
        registerListener('selectedProject', this.updateTable, this);
        //Search for assets on a per-project basis
        console.log('Listener Registered');

    } 

    updateTable(project_id) {
        this.project_id = project_id;
        assets.find(parseInt(this.project_id, 10)).then( response => { this.data = response; } );
        
        //TODO: display text, numbers bad
        
        this.tableLoadingState = false;
        console.log('Updated Table');
    }

    disconnectedCallback() {
        unregisterAllListeners(this);
    }
}
