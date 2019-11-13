import { LightningElement, track } from 'lwc';
import { assetDefinitions } from 'c/controllers';

export default class SelectAssetType extends LightningElement {
    @track options = [];
    @track value = '';
    @track description = '';
    descriptions = new Map();

    connectedCallback() {
        var i = 0;

        assetDefinitions.findAssetTypes()
            .then(data => {
                const typeOptions = [];

                for (i; i < data.rows.length; i++) {
                    const assetType = data.rows[i];
                    const optionLabel = `${assetType.id}: ${assetType.name}`;
                    const id = assetType.id.toString();

                    this.descriptions.set(id, assetType.description);
                    const option = {label: optionLabel, value: id};
                    typeOptions.push(option);
                }
                console.log('Callback');
                console.log(typeOptions);

                this.options = typeOptions;
                console.log(this.options);
            })
            .catch(e => {
                console.error(e);
            });
    }

    handleChange(event) {
        this.value = event.detail.value;
        this.description = this.descriptions.get(this.value);
    }
}