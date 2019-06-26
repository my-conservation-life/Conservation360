import { LightningElement, api } from 'lwc';

export default class CreateAssetList extends LightningElement {

    @api properties

    @api
    getProperties() {
        return this.template.querySelectorAll('.asset-property');
    }

}
