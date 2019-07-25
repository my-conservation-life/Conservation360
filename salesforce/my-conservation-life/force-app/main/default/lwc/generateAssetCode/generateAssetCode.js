import { LightningElement, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
 
//import CONTACT_OBJECT from '@salesforce/schema/Contact';
import NAME_FIELD from '@salesforce/schema/Access_Code__c.Asset_Id__c';
 
export default class GenerateAssetCode extends LightningElement {
    @wire(getRecord, {
        recordId: "a003i000001TkwtAAC",
        fields: [NAME_FIELD]
    })
    listView({ error, data }) {
        console.log(error, data);
    }
    
}
