import { LightningElement, api } from 'lwc';

/**
 * CreateAssetList is used to display all of the properties
 * contained by a single asset
 */
export default class CreateAssetList extends LightningElement {

    // The properties array is passed in from the HTML creating this object
    @api properties

    /**
     * getProperties can be called by parent classes to
     * get all of the CreateAssetProperty objects generated
     * in the HTML
     */
    @api
    getProperties() {
        return this.template.querySelectorAll('.asset-property');
    }

}
