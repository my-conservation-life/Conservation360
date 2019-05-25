import { LightningElement } from 'lwc';
import * as utils from 'c/utils'

export default class CreateAsset extends LightningElement {
    name = "";
    description = "";

    saveAssetDefinition() {
        console.log("SAVING");
        let assetList = this.template.querySelector("c-create-asset-list");
        let properties = assetList.getProperties()

        const data = {
            name: this.name,
            description: this.description,
            properties: properties
        }

        console.log(data);

        utils.api.post(utils.api.URL + "createAssetDefinition", data)
            .then(json => console.log(json))
            .catch(e => {
                console.error(e)
            });
    }

    saveAttribute(e) {
        const name = e.srcElement.name;
        const value = e.srcElement.value;
        this[name] = value.toLowerCase();
    }
}