import { LightningElement, track } from 'lwc';

export default class SelectAsset extends LightningElement {
    @track
    state = {
        title: 'Select Asset Type',
    };
    get sponsor() {
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
    
    get project() {
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
}
