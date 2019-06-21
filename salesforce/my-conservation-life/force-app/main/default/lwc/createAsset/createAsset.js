import { LightningElement, track } from 'lwc';
import controllers from 'c/controllers';

export default class CreateAsset extends LightningElement {

    c = controllers;

    @track typeOptions;
    @track typeValue;
    @track descriptionOptions;
    @track descriptionValue;
    @track propertiesOptions;
    @track propertiesValue;
    @track lattitude = JSON.stringify({
        asset_type_id:0,
        name:'assetLattitude',
        data_type:'number',
        required:true,
        is_private:false
    });
    @track longitude = JSON.stringify({
        asset_type_id:0,
        name:'assetLongitude',
        data_type:'number',
        required:true,
        is_private:false
    });
    @track lattitudeKey = 'assetLattitude';
    @track longitudeKey = 'assetLongitude';

    // Fires when this component is inserted into the DOM
    connectedCallback() {

        this.c.assetDefinitions.find().then(assetDefinitions => {

            // Must stringify because LWC must use primitives, no support for lists/objects
            const definitionsString = JSON.stringify(assetDefinitions);

            const types = [];
            const descriptions = {};
            const propertiesCollection = {};
            if (definitionsString) {
                const definitions = JSON.parse(definitionsString);
                for (let definition of definitions) {
                    const name = definition.assetType.name;
                    const type = {
                        label: name,
                        value: name
                    };
                    types.push(type);
                    descriptions[name] = definition.assetType.description;
                    propertiesCollection[name] = definition.properties;
                }
            }
            this.typeOptions = types;
            this.descriptionOptions = descriptions;
            this.propertiesOptions = propertiesCollection;
        });
    }

    handleChange(event) {
        this.typeValue = event.detail.value;
        this.descriptionValue = this.descriptionOptions[this.typeValue];
        this.propertiesValue = this.propertiesOptions[this.typeValue];
    }

    saveAsset() {
        const myProject = {id:1};
        const myAssetType = {id:1};
        const myLocation = {lattitude:45, longitude:85};
        const myProperties = [
            {id:1, value:200},
            {id:2, value:'10-10-2010'}
        ];

        const asset = {
            project: myProject,
            type: myAssetType,
            location:myLocation,
            properties: myProperties
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