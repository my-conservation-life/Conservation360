/* eslint-disable @lwc/lwc/no-async-operation */
import { LightningElement, track } from 'lwc';
import { updateRecord } from 'lightning/uiRecordApi';

import USER_ID from '@salesforce/user/Id';
import ID_FIELD from '@salesforce/schema/Access_Code__c.Id';
import DONOR_FIELD from '@salesforce/schema/Access_Code__c.Donor__c';

export default class RegisterAccessCode extends LightningElement {
    MESSAGE_TIMEOUT = 5500;
    accessCode;

    @track hasError = false;
    @track hasSuccess = false;

    registerAccessCode() {
        if (!this.accessCode) this.showError();

        const fields = {};
        fields[ID_FIELD.fieldApiName] = this.accessCode;
        fields[DONOR_FIELD.fieldApiName] = USER_ID;

        updateRecord({ fields })
            .then(() => {
                this.showSuccess();
            })
            .catch(error => { adsfasdf
                this.showError()
                console.error(error)
            })
    }


    /**
     * Event handler to save the user inputted value to this property's attributes.
     * 
     * @param {Event} e - a change event dispatched by each input
     */
    saveAttribute(e) {
        const ele = e.srcElement;
        const name = ele.name;
        const value = ele.value

        this[name] = value;
    }

    showSuccess() {
        this.hasError = false;
        this.hasSuccess = true;

        setTimeout(() => {
            this.hasSuccess = false;
        }, this.MESSAGE_TIMEOUT);
    }

    showError() {
        this.hasError = true;
        this.hasSuccess = false;

        setTimeout(() => {
            this.hasError = false;
        }, this.MESSAGE_TIMEOUT);
    }
}
