import { LightningElement, wire, track } from 'lwc';
//import { assets } from 'c/controllers';
import { CurrentPageReference } from 'lightning/navigation';
import { fireEvent } from 'c/pubsub';
import { assetDefinitions, sponsors } from 'c/controllers';

export default class SelectAsset extends LightningElement {
    @wire(CurrentPageReference) pageRef;

    @track asset
    @track assets;
    @track sponsor;
    @track all_sponsors;

    @track
    state = {
        title: 'Select Asset Type'
    };

    get sponsors() {
        var ret = [];

        ret.push({
            label: 'Default: Any',
            value: '0'
        });

        ret.push({
            label: 'Seneca Park Zoo',
            value: '1'
        });
    
        if (ret.sizeOf === 0) {
            return [
                {
                    label: 'Default: Any',
                    value: '0'
                }
            ];
        }
    
        return ret;
    }

    /**
     * Sets the combobox options.
     */
    connectedCallback() {
        var i, j;
        assetDefinitions.fetchAssetTypes()
            .then(data => {
                var temp_options = [];
                for (i = 0; i < data.rows.length; i++) {
                    temp_options.push({
                        'label': data.rows[i]['name'] + ': ' + data.rows[i]['id'],
                        'value': data.rows[i]['id']
                    });
                }
                this.assets = temp_options;
            })
            .catch(e => {
                console.log('Exception: ', e);
            });
        sponsors.fetchSponsors()
            .then(data => {
                var temp_sponsors = [];
                for (j = 0; j < data.rows.length; j++) {
                    temp_sponsors.push({
                        'label': data.rows[i]['name'] + ': ' + data.rows[i]['id'],
                        'value': data.rows[i]['id']
                    });
                }
                this.all_sponsors = temp_sponsors;
            })
            .catch(e => {
                console.log('Exception: ', e);
            });
    }

    @track
    project;
    get projects() {
        var ret = []; //Set Up Return

        //Push all projects to return
        ret.push({
            label: 'Default: Any',
            value: '0'
        });
        ret.push({
            label: 'Madagascar Lemur Conservation',
            value: '1'
        });
        ret.push({
            label: 'Madagascar Reforesting',
            value: '2'
        });
        ret.push({
            label: 'African Elephant Conservation',
            value: '3'
        });
        if (ret.sizeOf === 0) {
            return [
                {
                    label: 'Default: Any',
                    value: '0'
                }
            ];
        }
        return ret;
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
