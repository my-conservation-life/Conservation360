import { LightningElement, track } from 'lwc';
//Assets will depend on who is sponsoring the selected project.
import {assets} from 'c/controllers';

const columns = [
    { label: 'Asset ID', fieldName: 'id', type: 'number'},
    { label: 'Project ID', fieldName: 'project_id', type: 'number'},
    { label: 'Asset Type', fieldName: 'asset_type_id', type: 'number'},
    { label: 'Latitude', fieldName: 'latitude', type: 'number' },
    { label: 'Longitude', fieldName: 'longitude', type: 'number'},
    //{ label: 'Funding Date', fieldName: 'fundDate', type: 'date' },
    //{ label: 'Planting Date', fieldName: 'plantDate', type: 'date' },
];

export default class DisplayAssets extends LightningElement {
    @track data = [];
    @track columns = columns;
    @track tableLoadingState = true;

    async connectedCallback() {
        assets.getAll('').then( response => { this.data = response; } );
        this.tableLoadingState = false;
    }
}
