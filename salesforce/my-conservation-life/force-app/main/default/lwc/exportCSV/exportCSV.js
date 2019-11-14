import { LightningElement, track } from 'lwc';
import assetDefinitionsController from 'c/controllers';

export default class ExportCSV extends LightningElement {

    @track value = 'default';
    @track typeOptions;
    @track typeIdOptions;
    @track descriptionOptions;
    @track propertiesOptions;
    // @track options = [ { label: 'First', value: '1' }, { label: 'Second', value: '2' }];

    // Controller object used to access the database
    c = controllers;

    get options() {
        let assetTypes = assetDefinitionsController.getAssetTypes();
        console.log('<' + assetTypes + '>');
        // return this.c.assetDefinitions.find().then(assetDefinitions => {
        //     // Must stringify because LWC must use primitives, no support for lists/objects
        //     const definitionsString = JSON.stringify(assetDefinitions);

        //     // Generate empty values for the @track arrays
        //     const types = [];
        //     const ids = {};
        //     const descriptions = {};
        //     const propertiesCollection = {};

        //     // Use the query results to populate the @track arrays
        //     if (definitionsString) {
        //         const definitions = JSON.parse(definitionsString);
        //         for (let definition of definitions) {
        //             const name = definition.assetType.name;
        //             const type = {
        //                 label: name,
        //                 value: name,
        //             };
        //             types.push(type);
        //             ids[name] = definition.assetType.id;
        //             descriptions[name] = definition.assetType.description;
        //             propertiesCollection[name] = definition.properties;
        //         }
        //     }

        //     // Set the values of the @track arrays
        //     this.typeOptions = types;
        //     this.typeIdOptions = ids;
        //     this.descriptionOptions = descriptions;
        //     this.propertiesOptions = propertiesCollection;
        // }).then(() => {
        //     return this.typeIdOptions;
        // });
        console.log(assetTypes);
        return [
            { label: 'First', value: '1' },
            { label: 'Second', value: '2' }
        ];
    }

    handleChange(event) {
        this.value = event.detail.value;
    }

    downloadTest() {
        console.log(this.value);
    }
}
