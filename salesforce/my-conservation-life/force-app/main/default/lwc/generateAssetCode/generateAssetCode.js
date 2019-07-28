import { LightningElement, track } from 'lwc';
import { assets } from 'c/controllers';
import { createRecord } from 'lightning/uiRecordApi';
 
import ACCESS_CODE_OBJECT from '@salesforce/schema/Access_Code__c';
import ID_FIELD from '@salesforce/schema/Access_Code__c.Asset_Id__c';

export default class GenerateAssetCode extends LightningElement {

    @track code

    generateCode() {
        const fields = {};
        const recordInput = { apiName: ACCESS_CODE_OBJECT.objectApiName, fields };
        this.code = 'Generating code...';
        
        assets.find().then( assetObjects => {
            var assetId = -1;
            var i;
            var map = {};

            assetObjects.forEach( assetObject => {
                i = parseInt(assetObject.asset_id, 10);
                map[i] = 1;
            });

            for (i = 1; i <= (2^63)*2 ; i++) {
                if (map[i] === undefined) {
                    assetId = i;
                    break;
                }
            }

            fields[ID_FIELD.fieldApiName] = assetId;

            createRecord(recordInput).then(assetCode => {
                this.code = assetCode.id;
            });
        }).catch(() => {
            this.code = 'Error: code not generated';
        });
    }

}
