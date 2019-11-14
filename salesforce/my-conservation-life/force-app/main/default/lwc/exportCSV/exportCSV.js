import { LightningElement, track } from 'lwc';
import { controllers, assetTypes } from 'c/controllers';

export default class ExportCSV extends LightningElement {

    @track value = 'default';
    @track typeOptions;
    @track typeIdOptions;
    @track descriptionOptions;
    @track propertiesOptions;
    // @track options = [ { label: 'First', value: '1' }, { label: 'Second', value: '2' }];

    // Controller object used to access the database
    c = controllers;

    get options() {
        let asset_types = assetTypes.getAssetTypes();

        console.log(asset_types);

        return [
            { label: 'First', value: '1' },
            { label: 'Second', value: '2' }
        ];
    }

    handleChange(event) {
        this.value = event.detail.value;
    }

    downloadTest() {
        console.log(this.value);
    }
}
