import { LightningElement, wire } from 'lwc';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';

import MCL_CONFIG_OBJECT from '@salesforce/schema/MCL_CONFIG__c';

export default class RegisterAccessCode extends LightningElement {
    @wire(getObjectInfo, { objectApiName: MCL_CONFIG_OBJECT })
    mclConfig({ error, data }) {
        if (error) console.error(error);
        if (data) console.log('===', data, data.data);
    }
}