import { LightningElement, wire, track } from 'lwc';
import {CurrentPageReference} from 'lightning/navigation';
import { fireEvent } from 'c/pubsub';

export default class App extends LightningElement {
    @wire(CurrentPageReference) pageRef;
    @track
    state = {
        title: 'Select Asset Type',
    };
    @track
    sponsor;
    get sponsors() {
        return [
            {
                label: '(none)',
                value: '0',
            },
            {
                label: 'Seneca Park Zoo',
                value: '1',
            },
            {
                label: 'Franklin Park Zoo',
                value: '2',
            },
        ];
    }
    @track
    project;
    get projects() {
        return [
            {
                label: '(none)',
                value: '0',
            },
            {
                label: 'Madagascar Reforesting Project',
                value: '1',
            },
            {
                label: 'Save The Great Barrier Reef',
                value: '2',
            },
        ];
    }
    @track
    asset;
    get assets() {
        return [
            {
                label: '(none)',
                value: '0',
            },
            {
                label: 'Tree',
                value: '1',
            },
            {
                label: 'Gray-headed Lemur',
                value: '2',
            },
        ];
    }
    handleSponsorChange(event) {
        this.sponsor = event.detail.value;
        fireEvent(this.pageRef, 'selectedSponsor', this.sponsor);
    }
    handleProjectChange(event) {
        this.project = event.detail.value;
        fireEvent(this.pageRef, 'selectedProject', this.project);
    }
    handleAssetChange(event) {
        this.asset = event.detail.value;
        fireEvent(this.pageRef, 'selectedAsset', this.asset);
    }
}
