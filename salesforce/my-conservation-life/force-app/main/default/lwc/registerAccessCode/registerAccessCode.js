import { LightningElement, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';

import API_URL_FIELD from '@salesforce/schema/MCL_CONFIG__mdt.API_URL__c';

export default class RegisterAccessCode extends LightningElement {
    @wire(getRecord, { recordId: 'MCL_Config', fields: [API_URL_FIELD] })
    mclConfig({ error, data }) {
        if (error) console.error(error.body);
        if (data) console.log('===', data);
    }
}