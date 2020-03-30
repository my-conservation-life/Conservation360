import { LightningElement, track } from 'lwc';
import controllers from 'c/controllers';

/**
 * CreateAsset is used to display the different types of assets
 * that can be created, and allow a user to create instances
 * of those assets
 */
export default class CreateAsset extends LightningElement {
    
    // Controller object used to access the database
    c = controllers;

    // An array of all available asset definitions
    @track typeOptions;
    // The selected asset definition
    @track typeValue;

    // An array of all asset definition ids
    @track typeIdOptions;
    // The selceted asset definition's id
    @track typeIdValue;

    // An array of all asset definition descriptions
    @track descriptionOptions;
    // The selected asset defenition's description
    @track descriptionValue;

    // An array of all asset definition property definitions
    @track propertiesOptions;
    // The selected asset definition's property definitions
    @track propertiesValue;

    // A manually created property for the required latitude property
    @track latitude = {
        asset_type_id:0,
        name:'location-latitude',
        data_type:'number',
        required:true,
        is_private:false
    };

    // A manually created property for the required longitude property
    @track longitude = {
        asset_type_id:0,
        name:'location-longitude',
        data_type:'number',
        required:true,
        is_private:false
    };

    /**
     * connectedCallBack is executed when this component is inserted into the DOM
     */
    connectedCallback() {

        // Query the database for all existing asset definitions
        this.c.assetDefinitions.find().then(assetDefinitions => {

            // Must stringify because LWC must use primitives, no support for lists/objects
            const definitionsString = JSON.stringify(assetDefinitions);

            // Generate empty values for the @track arrays
            const types = [];
            const ids = {};
            const descriptions = {};
            const propertiesCollection = {};

            // Use the query results to populate the @track arrays
            if (definitionsString) {
                const definitions = JSON.parse(definitionsString);
                for (let definition of definitions) {
                    const name = definition.assetType.name;
                    const type = {
                        label: name,
                        value: name,
                    };
                    types.push(type);
                    ids[name] = definition.assetType.id;
                    descriptions[name] = definition.assetType.description;
                    propertiesCollection[name] = definition.properties;
                }
            }

            // Set the values of the @track arrays
            this.typeOptions = types;
            this.typeIdOptions = ids;
            this.descriptionOptions = descriptions;
            this.propertiesOptions = propertiesCollection;
        });
    }

    /**
     * handleChange updates the asset definition and it's properties
     * whenever this lwc(lightning-web-component) is modified
     * @param {*} event The user generated event affecting this lwc
     */
    handleChange(event) {
        this.typeValue = event.detail.value;
        this.type = event.detail;
        this.typeIdValue = this.typeIdOptions[this.typeValue];
        this.descriptionValue = this.descriptionOptions[this.typeValue];
        this.propertiesValue = this.propertiesOptions[this.typeValue];
    }

    /**
     * saveAsset is used to commit the current lwc
     * configuration to the database
     */
    saveAsset() {

        // Display to the user that this task is in progress
        this.template.querySelector('.status-text').value = 'Saving...';

        // Get the latitude and longitude CreateAssetProperty objects
        const latt = this.template.querySelector('.location-latitude').getPropertyValue();
        const long = this.template.querySelector('.location-longitude').getPropertyValue();

        // Get the custom CreateAssetProperty objects
        const properties = this.template.querySelector('.property-list').getProperties();
        
        // Compile the properties and their values into an api-readable object
        const props = [];
        for (let property of properties) {
            props.push({
                id:property.getPropertyId(),
                value:property.getPropertyValue()
            });
        }

        // Compile the asset and its properties into an api-readable object
        const asset = {
            project: {id:1},
            type: {id:this.typeIdValue},
            location:{latitude:latt, longitude:long},
            properties: props
        };

        this.c.assets.create(asset).then(json => {
            // Let the user know the asset was successfully saved
            this.template.querySelector('.status-text').value = 'Saved Successfully';
            console.log(json);
        }).catch(e => {
            // Let the user know the asset was not saved
            this.template.querySelector('.status-text').value = 'Error Encountered';
            console.log(e);
        });
    }

}
