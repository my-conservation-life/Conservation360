import { LightningElement, api } from 'lwc';

export default class CreateAssetProperty extends LightningElement {
    @api
    propertyDataTypes;

    // Getter that converts the stringified propertyDataTypes received from parent lwc into an option list
    get options() {
        const optionList = []
        if (this.propertyDataTypes) {
            const dataTypes = JSON.parse(this.propertyDataTypes);
            for(let type of dataTypes) {
                const option = {
                    "label": type,
                    "value": type
                }
                optionList.push(option)
            }
        }

        return optionList;
    }
}