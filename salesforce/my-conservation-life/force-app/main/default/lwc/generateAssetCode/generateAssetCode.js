import { LightningElement, track } from 'lwc';
import { createRecord } from 'lightning/uiRecordApi';
 
import ACCESS_CODE_OBJECT from '@salesforce/schema/Access_Code__c';
import ID_FIELD from '@salesforce/schema/Access_Code__c.Asset_Id__c';

function getOpenAsset() {



    return 1;
}

export default class GenerateAssetCode extends LightningElement {

    @track code

    generateCode() {
        const fields = {};
        fields[ID_FIELD.fieldApiName] = getOpenAsset();
        const recordInput = { apiName: ACCESS_CODE_OBJECT.objectApiName, fields };
        createRecord(recordInput)
            .then(assetCode => {
                this.code = assetCode.id;
            })
            .catch(() => {
                this.code = 'Error: code not generated';
            });
    }

}
