import { LightningElement, wire, track } from 'lwc';
//import { assets } from 'c/controllers';
import { CurrentPageReference } from 'lightning/navigation';
import { fireEvent } from 'c/pubsub';
import { assetDefinitions, sponsors, projects } from 'c/controllers';

export default class SelectAsset extends LightningElement {
    @wire(CurrentPageReference) pageRef;

    @track asset = 'Select an asset type...';
    @track assets;
    @track sponsor = 'Select a sponsor...';
    @track all_sponsors;
    @track project = 'Select a project...';
    @track all_projects;

    @track
    state = {
        title: 'Select Asset Type'
    };

    /**
     * Sets the combobox options.
     */
    connectedCallback() {
        var i, j, l;

        assetDefinitions.fetchAssetTypes()
            .then(data => {
                var temp_assets = [];
                for (i = 0; i < data.rows.length; i++) {
                    temp_assets.push({
                        'label': data.rows[i]['name'],
                        'value': data.rows[i]['id']
                    });
                }
                this.assets = temp_assets;
            })
            .catch(e => {
                console.log('Exception: ', e);
            });

        // sponsors.fetchSponsors()
        //     .then(data => {
        //         var temp_sponsors = [];
        //         for (j = 0; j < data.rows.length; j++) {
        //             temp_sponsors.push({
        //                 'label': data.rows[i]['name'] + ': ' + data.rows[i]['id'],
        //                 'value': data.rows[i]['id']
        //             });
        //         }
        //         this.all_sponsors = temp_sponsors;
        //     })
        //     .catch(e => {
        //         console.log('Exception: ', e);
        //     });

        this.all_sponsors = [
            {
                'label': 'spons 1',
                'value': '1'
            }
        ];

        this.all_projects = [
            {
                'label': 'proj 1',
                'value': '1'
            }
        ];
        
        // projects.fetchAllProjects()
        //     .then(data => {
        //         var temp_projects = [];
        //         for (l = 0; l < data.rows.length; l++) {
        //             temp_projects.push({
        //                 'label': data.rows[i]['name'] + ': ' + data.rows[i]['id'],
        //                 'value': data.rows[i]['id']
        //             });
        //         }
        //         this.all_projects = temp_projects;
        //     })
        //     .catch(e => {
        //         console.log('Exception: ', e);
        //     });
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
