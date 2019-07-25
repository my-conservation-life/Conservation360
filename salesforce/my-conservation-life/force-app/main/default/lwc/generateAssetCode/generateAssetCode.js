import { LightningElement, wire } from 'lwc';
import { getListUi } from 'lightning/uiListApi';
 
import ACCESS_CODE_OBJECT from '@salesforce/schema/Access_Code__c';
import NAME_FIELD from '@salesforce/schema/Access_Code__c.Asset_Id__c';
 
export default class GenerateAssetCode extends LightningElement {
    @wire(getListUi, {
        objectApiName: ACCESS_CODE_OBJECT,
        listViewApiName: 'All_Access_Codes',
        sortBy: NAME_FIELD,
        pageSize: 100
    })
    listView;
 
    get asset_codes() {
        return this.listView.data.records.records;
    }
}
