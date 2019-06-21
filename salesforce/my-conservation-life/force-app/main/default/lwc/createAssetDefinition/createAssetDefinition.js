import { LightningElement, track } from 'lwc';
import controllers from 'c/controllers';

export default class CreateAssetDefinition extends LightningElement {
    name = '';
    description = '';

    @track hasSuccess = false;
    @track hasError = false;

    validateAssetDefinition() {
        const assetListElement = this.template.querySelector('c-create-asset-definition-list');
        const propertiesValid = assetListElement.validateProperties();
        const attributesValid = this.validateAttributes();

        // Separate so both are called everytime
        return propertiesValid && attributesValid;
    }

    saveAssetDefinition() {
        console.log('Saving asset definition');

        const formValid = this.validateAssetDefinition();
        if (formValid) {
            let assetList = this.template.querySelector('c-create-asset-definition-list');
            let properties = assetList.getCustomProperties();

            const assetDefinition = {
                assetDefinition: {
                    name: this.name,
                    description: this.description,
                    properties: properties
                }
            };

            controllers.assetDefinitions.create(assetDefinition)
                .then(json => {
                    this.hasSuccess = true;
                    console.log(json);
                })
                .catch(e => {
                    this.hasError = true;
                    console.error(e);
                });
        } else {
            console.log('Asset definition failed validation');
        }
    }

    validateAttributes() {
        const inputElements = this.template.querySelectorAll('lightning-input');
        const validities = [];
        for (let input of inputElements) {
            let validity = input.reportValidity();
            validities.push(validity);
        }

        // Return true if all attributes returned true
        return validities
            .every(validity => validity === true);
    }

    saveAttribute(e) {
        const name = e.srcElement.name;
        const value = e.srcElement.value;
        this[name] = value.toLowerCase();
    }
}