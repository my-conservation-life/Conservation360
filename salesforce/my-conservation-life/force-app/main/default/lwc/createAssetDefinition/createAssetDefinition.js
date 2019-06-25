import { LightningElement, track, api } from 'lwc';
import { assetDefinitions } from 'c/controllers';

export default class CreateAssetDefinition extends LightningElement {
    name = '';
    description = '';

    @track hasSuccess = false;
    @track hasError = false;

    /**
     * Calls all components validate method to check if the form is valid.
     * 
     * @returns {boolean} true if whole form is valid
     */
    validateAssetDefinition() {
        const assetListElement = this.template.querySelector('c-create-asset-definition-list');
        const propertiesValid = assetListElement.validateProperties();
        const attributesValid = this.validateAttributes();

        // Separate so both are called everytime
        return propertiesValid && attributesValid;
    }

    /**
     * Validates the whole asset definition form.
     */
    saveAssetDefinition() {
        const formValid = this.validateAssetDefinition();
        if (formValid) {
            this.sendAssetDefinition();
        } else {
            console.log('Asset definition failed validation');
        }
    }

    /**
     * Gathers all data required for a assetDefinition and sends it to the db/api.
     * Exposed through api for testing.
     */
    @api
    sendAssetDefinition() {
        let assetList = this.template.querySelector('c-create-asset-definition-list');
        let properties = assetList.getCustomProperties();

        const assetDefinition = {
            assetDefinition: {
                name: this.name,
                description: this.description,
                properties: properties
            }
        };

        assetDefinitions.create(assetDefinition)
            .then(data => {
                this.hasSuccess = true;
            })
            .catch(e => {
                this.hasError = true;
                console.error(e);
            });
    }


    /**
     * Validates inputs by using lwc reportValidity function.
     * 
     * @returns {boolean} true if all inputs considered valid
     */
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

    /**
     * Event handler to save the user inputted value to this attributes.
     * 
     * @param {Event} e - a change event dispatched by each input
     */
    saveAttribute(e) {
        const name = e.srcElement.name;
        const value = e.srcElement.value;
        this[name] = value.toLowerCase();
    }
}