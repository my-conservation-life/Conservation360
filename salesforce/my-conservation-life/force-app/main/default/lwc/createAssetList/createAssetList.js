import { LightningElement, track, api } from 'lwc';
import controllers from 'c/controllers';

export default class CreateAssetList extends LightningElement {

    id = 1;
    @track properties = [];
    @track propertyDataTypes; //names starting with data are reserved :(
    @track requiredPropertyLocation;

    // Fires when this component is inserted into the DOM
    connectedCallback() {
        this.addCustomProperty();

        // Hardcoded; May need to be grabbed form DB later on
        const locationProperty = {
            name: 'location',
            description: 'the location of this asset',
            data_type: 'location',
            required: false,
            is_private: false
        };

        this.requiredPropertyLocation = JSON.stringify(locationProperty);

        controllers.assetDefinitions.getAll().then(assetDefinitions => {

            console.log(assetDefinitions)

            // Must stringify because LWC must use primitives, no support for lists/objects
            this.propertyDataTypes = JSON.stringify(assetDefinitions);

            const optionList = [];
            if (this.propertyDataTypes) {
                const propertyDataTypes = JSON.parse(this.propertyDataTypes);
                for(let type of propertyDataTypes) {
                    const option = {
                        label: type,
                        value: type
                    };
                    optionList.push(option);
                }
            }
            this.options = optionList
        })
    }

    // Takes advantage of template's for:each by appending new createAssetDefinitionProperty per value in list
    addCustomProperty() {
        this.properties.push(this.id);
        this.id++;
    }

}
