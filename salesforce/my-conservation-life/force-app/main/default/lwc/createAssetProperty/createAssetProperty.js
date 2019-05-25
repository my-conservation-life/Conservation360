import { LightningElement, api } from 'lwc';

export default class CreateAssetProperty extends LightningElement {
    @api
    propertyDataTypes;

    name = "";
    data_type = "";
    required = false;
    is_private = false;

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

    @api
    getAttributes() {
        return {
            name: this.name,
            data_type: this.data_type,
            required: this.required === "true" || this.required === true,
            is_private: this.is_private === "true" || this.is_private === true
        }
    }

    saveAttribute(e) {
        const name = e.srcElement.name;
        const value = e.srcElement.value;
        this[name] = value.toLowerCase();
    }

    saveCheckboxAttribute(e) {
        const name = e.srcElement.name;
        const value = e.srcElement.checked;
        this[name] = value;
    }
}