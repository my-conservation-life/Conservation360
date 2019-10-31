import { LightningElement, track } from 'lwc';
import { assetDefinitions } from 'c/controllers';

export default class SelectAssetType extends LightningElement {
    @track value;

    @track
    options = [
        {label: 'Test', value: 'test'}
    ];

    handleChange(event) {
        assetDefinitions.findAssetTypes()
            .then(data => {
                console.log(data);
            })
            .catch(e => {
                console.error(e);
            });
        this.value = event.detail.value;
    }
}