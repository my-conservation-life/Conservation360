import { LightningElement, track } from 'lwc';
import { assetDefinitions } from 'c/controllers';

export default class SelectAssetType extends LightningElement {
    @track options = [];
    @track assetTypeString = '';
    @track description = '';

    connectedCallback() {
        var i = 0;

        assetDefinitions.findAssetTypes()
            .then(data => {
                const typeOptions = [];

                for (i; i < data.rows.length; i++) {
                    const assetType = data.rows[i];
                    const assetTypeString = JSON.stringify(assetType);

                    const optionLabel = `${assetType.id}: ${assetType.name}`;
                    const option = {label: optionLabel, value: assetTypeString};
                    typeOptions.push(option);
                }

                this.options = typeOptions;
            })
            .catch(e => {
                console.error(e);
            });
    }

    handleChange(event) {
        const assetTypeString = event.detail.value;
        this.assetTypeString = assetTypeString;

        const assetType = JSON.parse(assetTypeString);
        const description = assetType.description;
        if (description !== null) {
            this.description = assetType.description;
        }
        else {
            this.description = 'No description found.';
        }
    }
}