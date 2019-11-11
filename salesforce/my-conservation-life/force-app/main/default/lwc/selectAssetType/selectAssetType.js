import { LightningElement, track } from 'lwc';
import { assetDefinitions } from 'c/controllers';

export default class SelectAssetType extends LightningElement {
    @track options = [];
    @track value = '';
    @track description = '';

    connectedCallback() {
        var i = 0;

        assetDefinitions.findAssetTypes()
            .then(data => {
                const typeOptions = [];

                for (i; i < data.rows.length; i++) {
                    const assetType = data.rows[i];
                    const optionLabel = `${assetType.id}: ${assetType.name}`;

                    const option = {label: optionLabel, value: assetType.id.toString()};
                    typeOptions.push(option);
                }
                // console.log('Callback');
                // console.log(aOptions);

                this.options = typeOptions;
                // console.log(this.options);
            })
            .catch(e => {
                console.error(e);
            });
    }

    handleChange(event) {
        this.value = event.detail.value;
        this.description = event.detail.description;
        // console.log(this.description);
    }
}