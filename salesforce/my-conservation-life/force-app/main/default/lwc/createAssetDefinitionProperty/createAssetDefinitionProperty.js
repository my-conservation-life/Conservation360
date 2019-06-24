import { LightningElement, track, api } from 'lwc';

export default class CreateAssetDefinitionProperty extends LightningElement {
    // Passed in for pre-filled properties (Such as the required location property)
    @api propertyData;
    @track isCustomProperty = true;

    // Handles the option list for the combobox and remove property button
    @api propertyDataTypes;
    @api propertyKey;

    // The property's attributes
    name = '';
    data_type = '';
    required = false;
    is_private = false;

    /**
     * Called everytime this component is rendered, but hasRendered flag prevents code from running twice.
     * 
     * If propertyData is sent in, this property is not custom.
     * Set inputs' values to values in propertyData and disables the input.
     */
    renderedCallback() {
        if (this.propertyData && !this.hasRendered) {
            this.hasRendered = true; //prevent re-rendering

            this.isCustomProperty = false; //hide remove property button
            const propertyData = JSON.parse(this.propertyData);

            const inputs = this.template.querySelectorAll('lightning-input, lightning-combobox');
            for (let input of inputs) {
                const name = input.name;
                const value = propertyData[name];
                this[name] = value;

                if (input.type === 'checkbox') input.checked = value;
                else input.value = value;

                input.disabled = true;
            }
        }
    }

    /**
     * Getter that converts the stringified propertyDataTypes received from parent lwc into an option list.
     * 
     * @returns {object[]} a list of objects containing label and value
     */
    get options() {
        const optionList = [];
        if (this.propertyDataTypes) {
            const propertyDataTypes = JSON.parse(this.propertyDataTypes);
            for (let type of propertyDataTypes) {
                const option = {
                    label: type,
                    value: type
                };
                optionList.push(option);
            }
        }

        return optionList;
    }

    /**
     * Validates inputs by using lwc reportValidity function.
     * 
     * @returns {boolean} true if all inputs considered valid
     */
    @api
    validateAttributes() {
        const inputElements = this.template.querySelectorAll('lightning-input, lightning-combobox');
        const validities = [];
        for (let input of inputElements) {
            let validity = input.reportValidity();
            validities.push(validity);
        }

        // Return true if all attributes returned true
        return validities
            .every(validity => validity === true);
    }

    @api
    getIsCustomProperty() {
        return this.isCustomProperty;
    }

    /**
     * Gets the attributes of this property.
     * Converts required and is_private strings to booleans.
     * 
     * @returns {object} attributes of this property
     */
    @api
    getAttributes() {
        return {
            name: this.name,
            data_type: this.data_type,
            required: this.required === 'true' || this.required === true,
            is_private: this.is_private === 'true' || this.is_private === true
        };
    }


    /**
     * Event handler to save the user inputted value to this property's attributes.
     * 
     * @param {Event} e - a change event dispatched by each input
     */
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

    /**
     * Event handler to dispatch a custom event to be handled by the parent component.
     * The custom event contains the property's propertyKey so it can be removed.
     */
    handleRemoveProperty() {
        const event = new CustomEvent('removeproperty', { detail: this.propertyKey });
        this.dispatchEvent(event);
    }
}