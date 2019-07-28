import { LightningElement } from 'lwc';
import { createRecord } from 'lightning/uiRecordApi';
 
import ACCESS_CODE_OBJECT from '@salesforce/schema/Access_Code__c';
import ID_FIELD from '@salesforce/schema/Access_Code__c.Asset_Id__c';

export default class GenerateAssetCode extends LightningElement {

    generateCode() {
        const fields = {};
        fields[ID_FIELD.fieldApiName] = 1;
        const recordInput = { apiName: ACCESS_CODE_OBJECT.objectApiName, fields };
        createRecord(recordInput)
            .then(assetCode => {
                console.log(assetCode);
            })
            .catch(error => {
                console.log(error);
            });
    }

}
