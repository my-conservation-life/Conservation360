import { LightningElement, track } from 'lwc';
import { assets } from 'c/controllers';

const columns = [
    { label: 'Asset ID', fieldName: 'id' },
    { label: 'Project ID', fieldName: 'project_id' },
    { label: 'Asset Type', fieldName: 'asset_type_id' },
    { label: 'Latitude', fieldName: 'latitude', type: Number },
    { label: 'Longitude', fieldName: 'longitude', typie: Number },
    //{ label: 'Funding Date', fieldName: 'fundDate', type: 'date' },
    //{ label: 'Planting Date', fieldName: 'plantDate', type: 'date' },
];

export default class DisplayAssets extends LightningElement {
    @track data = [];
    @track columns = columns;
    @track tableLoadingState = true;

    async connectedCallback() {
        assets.find('').then(response => { this.data = response; });
        this.tableLoadingState = false;
    }
}
