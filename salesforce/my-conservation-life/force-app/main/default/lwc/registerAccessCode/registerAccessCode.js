import { LightningElement, wire } from 'lwc';
import { getRecord, updateRecord } from 'lightning/uiRecordApi';

// import ACCESS_CODE_OBJECT from '@salesforce/schema/Access_Code__c';
import ID_FIELD from '@salesforce/schema/Access_Code__c.Id';
// import DONOR_FIELD from '@salesforce/schema/Access_Code__c.Donor__c';
import ASSET_ID_FIELD from '@salesforce/schema/Access_Code__c.Asset_Id__c';


export default class RegisterAccessCode extends LightningElement {
    renderedCallback() {
        const fields = {};
        // fields[DONOR_FIELD.fieldApiName] = this.contactId;
        fields[ID_FIELD.fieldApiName] = 'a003i000001Tkx3AAC';
        fields[ASSET_ID_FIELD.fieldApiName] = 555;

        const recordInput = { fields };

        updateRecord(recordInput)
            .then((response) => {
                console.log(response);
            })
            .catch(error => {
                console.log(error);
            });
    }
}