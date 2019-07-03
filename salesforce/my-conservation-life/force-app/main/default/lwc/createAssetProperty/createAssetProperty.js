import { LightningElement, track, api } from 'lwc';

/**
 * CreateAssetPrpoerty is used to dispay the contents of
 * a single property of an asset
 */
export default class CreateAssetProperty extends LightningElement {

    // The property object is passed in from the HTML creating this object
    @api property

    // The propertie's value is modified by a user in the displayed HTML
    @track value

    /**
     * getPropertyId can be called by parent classes to
     * get the id of the contained property
     */
    @api
    getPropertyId() {
        return this.property.id;
    }

    /**
     * getPropertyValue can be called by parent classes to
     * get the value of the contained property
     */
    @api
    getPropertyValue() {
        return this.value;
    }

    /**
     * handleChange updates the property's value whenever
     * this property's HTML is modified
     * @param {*} event The user generated event affecting this property
     */
    handleChange(event) {
        this.value = event.detail.value;
    }

}
