import { LightningElement, track } from 'lwc';
import controllers from 'c/controllers';

export default class CreateAsset extends LightningElement {

    c = controllers;

    @track typeOptions;
    @track typeValue;
    @track typeIdOptions;
    @track typeIdValue;
    @track descriptionOptions;
    @track descriptionValue;
    @track propertiesOptions;
    @track propertiesValue;
    @track lattitude = {
        asset_type_id:0,
        name:'location-lattitude',
        data_type:'number',
        required:true,
        is_private:false
    };
    @track longitude = {
        asset_type_id:0,
        name:'location-longitude',
        data_type:'number',
        required:true,
        is_private:false
    };

    // Fires when this component is inserted into the DOM
    connectedCallback() {

        this.c.assetDefinitions.find().then(assetDefinitions => {

            // Must stringify because LWC must use primitives, no support for lists/objects
            const definitionsString = JSON.stringify(assetDefinitions);

            const types = [];
            const ids = {};
            const descriptions = {};
            const propertiesCollection = {};
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
            this.typeOptions = types;
            this.typeIdOptions = ids;
            this.descriptionOptions = descriptions;
            this.propertiesOptions = propertiesCollection;
        });
    }

    handleChange(event) {
        this.typeValue = event.detail.value;
        this.type = event.detail;
        this.typeIdValue = this.typeIdOptions[this.typeValue];
        this.descriptionValue = this.descriptionOptions[this.typeValue];
        this.propertiesValue = this.propertiesOptions[this.typeValue];
    }

    saveAsset() {

        const latt = this.template.querySelector('.location-lattitude').getPropertyValue();
        const long = this.template.querySelector('.location-longitude').getPropertyValue();

        const properties = this.template.querySelector('.property-list').getProperties();
        const props = [];
        for (let property of properties) {
            props.push({
                id:property.getPropertyId(),
                value:property.getPropertyValue()
            });
        }

        const asset = {
            project: {id:1},
            type: {id:this.typeIdValue},
            location:{lattitude:latt, longitude:long},
            properties: props
        };

        this.c.assets.create(asset).then(json => {
            this.hasSuccess = true;
            console.log(json);
        }).catch(e => {
            this.hasError = true;
            console.log(e);
        });
    }

}