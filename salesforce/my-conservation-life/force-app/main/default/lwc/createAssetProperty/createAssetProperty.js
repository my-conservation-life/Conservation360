import { LightningElement, track, api } from 'lwc';

export default class CreateAssetProperty extends LightningElement {

    @api property
    @track value

    @api
    getPropertyId() {
        return this.property.id;
    }

    @api
    getPropertyValue() {
        return this.value;
    }

    handleChange(event) {
        this.value = event.detail.value;
    }

}
