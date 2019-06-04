import { LightningElement, track } from 'lwc';
import fetchDataHelper from './fetchDataHelper';

const columns = [
    { label: 'Asset ID', fieldName: 'assetID' },
    { label: 'Asset Type', fieldName: 'assetType'},
    { label: 'Location', fieldName: 'location', type: 'location' },
    { label: 'Funding Date', fieldName: 'fundDate', type: 'date' },
    { label: 'Planting Date', fieldName: 'plantDate', type: 'date' },
];

export default class DisplayAssets extends LightningElement {
    @track data = [];
    @track columns = columns;
    @track tableLoadingState = true;

    async connectedCallback() {
        const data = await fetchDataHelper({ amountOfRecords: 100 });
        this.data = data;
        this.tableLoadingState = false;
    }
}
