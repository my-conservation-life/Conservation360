import { LightningElement, track, api } from 'lwc';
import controllers from 'c/controllers';

export default class CreateAssetDefinitionList extends LightningElement {
    id = 1;
    @track properties = [];
    @track propertyDataTypes; //names starting with data are reserved :(
    @track requiredPropertyLocation;

    // Fires when this component is inserted into the DOM
    connectedCallback() {
        this.addCustomProperty();

        // TODO: this is hardcoded; May need to be grabbed form DB later on
        const locationProperty = {
            name: 'location',
            description: 'the location of this asset',
            data_type: 'location',
            required: false,
            is_private: false
        };

        this.requiredPropertyLocation = JSON.stringify(locationProperty);

        controllers.dataTypes.find()
            .then(dataTypes => {
                // Must stringify because LWC must use primitives, no support for lists/objects
                this.propertyDataTypes = JSON.stringify(dataTypes);
            })
            .catch(e => {
                console.error('createAssetDefinitionList.js');
                console.error(e);
            });
    }

    // Takes advantage of template's for:each by appending new createAssetDefinitionProperty per value in list
    addCustomProperty() {
        this.properties.push(this.id);
        this.id++;
    }

    handleRemoveProperty(e) {
        const id = e.detail;
        const idx = this.properties.indexOf(id);
        if (idx > -1) {
            this.properties.splice(idx, 1);
        }
    }

    @api
    validateProperties() {
        const propertyElements = this.template.querySelectorAll('c-create-asset-definition-property');
        const validities = [];
        for (let property of propertyElements) {
            let validity = property.validateAttributes();
            validities.push(validity);
        }

        // Return true if all properties returned true
        return validities
            .every(validity => validity === true);
    }

    @api
    getProperties() {
        const propertyElements = this.template.querySelectorAll('c-create-asset-definition-property');
        const properties = [];
        for (let property of propertyElements) {
            const attributes = property.getAttributes();
            if (attributes) properties.push(attributes);
        }

        return properties;
    }
}