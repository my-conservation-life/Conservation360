import { LightningElement, track, api } from 'lwc';

export default class CreateAssetDefinitionProperty extends LightningElement {
    // Passed in for pre-filled properties (Such as the required location property)
    @api propertyData; 
    @track isCustomProperty = true;

    // Handles option list and remove property button
    @api propertyDataTypes;
    @api propertyKey;

    // Property attributes
    name = '';
    data_type = '';
    required = false;
    is_private = false;

    renderedCallback() {
        if (this.propertyData && !this.hasRendered) {
            this.hasRendered = true; //prevent re-rendering

            this.isCustomProperty = false; //hide remove property button
            const propertyData = JSON.parse(this.propertyData)

            const inputs = this.template.querySelectorAll('lightning-input, lightning-combobox');
            for (let input of inputs) {
                const name = input.name;
                const value = propertyData[name];

                if (input.type === 'checkbox') {
                    input.checked = value;
                } else {
                    input.value = value;
                }

                input.disabled = true;
            }
        }
    }

    // Getter that converts the stringified propertyDataTypes received from parent lwc into an option list
    get options() {
        const optionList = []
        if (this.propertyDataTypes) {
            const propertyDataTypes = JSON.parse(this.propertyDataTypes);
            for(let type of propertyDataTypes) {
                const option = {
                    label: type,
                    value: type
                }
                optionList.push(option)
            }
        }

        return optionList;
    }

    // TODO: Extract to shared
    @api
    validateAttributes() {
        const inputElements = this.template.querySelectorAll('lightning-input, lightning-combobox');
        const validities = [];
        for (let input of inputElements) {
            let validity = input.reportValidity();
            validities.push(validity)
        }

        // Return true if all attributes returned true
        return validities
            .every(validity => validity === true);
    }

    @api
    getAttributes() {
        if (this.isCustomProperty) {
            return {
                name: this.name,
                data_type: this.data_type,
                required: this.required === 'true' || this.required === true,
                is_private: this.is_private === 'true' || this.is_private === true
            }
        }
    }

    saveAttribute(e) {
        const ele = e.srcElement;

        const type = ele.type;
        const name = ele.name;

        let value;
        if (type === 'checkbox') {
            value = ele.checked;
        } else {
            value = ele.value.toLowerCase();
        }

        this[name] = value;
    }

    handleRemoveProperty() {
        const event = new CustomEvent('removeproperty', {detail: this.propertyKey});
        this.dispatchEvent(event);
    }
}