import { LightningElement, track, wire } from 'lwc';
import { assets } from 'c/controllers';
import { createRecord } from 'lightning/uiRecordApi';
import { getListUi } from 'lightning/uiListApi';
 
import ACCESS_CODE_OBJECT from '@salesforce/schema/Access_Code__c';
import ID_FIELD from '@salesforce/schema/Access_Code__c.Asset_Id__c';

export default class GenerateAssetCode extends LightningElement {

    @track code

    @wire(getListUi, {
        objectApiName: ACCESS_CODE_OBJECT,
        listViewApiName: 'All_Access_Codes'
    })
    listView;

    get accessCodeObjects() {
        return this.listView.data.records.records;
    }

    generateCode() {
        const fields = {};
        const recordInput = { apiName: ACCESS_CODE_OBJECT.objectApiName, fields };
        this.code = 'Generating code...';

        assets.find().then( assetObjects => {
            var id = -1;
            var i;
            var map = {};

            if (!this.accessCodeObjects) throw ReferenceError;

            for (let accessCodeObject of this.accessCodeObjects) {
                i = accessCodeObject.fields.Asset_Id__c.value;
                map[i] = true;
            }

            for (let assetObject of assetObjects) {
                i = parseInt(assetObject.asset_id, 10);
                if (map[i] === undefined) {
                    id = i;
                    break;
                }
            }

            fields[ID_FIELD.fieldApiName] = id;

            createRecord(recordInput).then(assetCode => {
                this.code = assetCode.id;
            });
        }).catch(() => {
            this.code = 'Error: code not generated';
        });
    }

}
