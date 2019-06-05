import { LightningElement, track } from 'lwc';

export default class App extends LightningElement {
    @track
    state = {
        title: 'Select Asset Type',
    };
    @track
    sponsor;
    get sponsors() {
        return [
            {
                label: 'Seneca Park Zoo',
                value: 'sponsor_01',
            },
            {
                label: 'Franklin Park Zoo',
                value: 'sponsor_02',
            },
        ];
    }
    @track
    project;
    get projects() {
        return [
            {
                label: 'Madagascar Reforesting Project',
                value: 'project_01',
            },
            {
                label: 'Save The Great Barrier Reef',
                value: 'project_02',
            },
        ];
    }
    @track
    asset;
    get assets() {
        return [
            {
                label: 'Tree',
                value: 'asset_01',
            },
            {
                label: 'Gray-headed Lemur',
                value: 'asset_02',
            },
        ];
    }
    handleSponsorChange(event) {
        this.sponsor = event.detail.value;
    }
    handleProjectChange(event) {
        this.project = event.detail.value;
    }
    handleAssetChange(event) {
        this.asset = event.detail.value;
    }
}
