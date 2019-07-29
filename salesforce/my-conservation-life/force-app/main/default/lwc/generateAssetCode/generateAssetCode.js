import { LightningElement, track, wire } from 'lwc';
import { assets } from 'c/controllers';
import { createRecord } from 'lightning/uiRecordApi';
import { getListUi } from 'lightning/uiListApi';
 
import ACCESS_CODE_OBJECT from '@salesforce/schema/Access_Code__c';
import ID_FIELD from '@salesforce/schema/Access_Code__c.Asset_Id__c';

/**
 * GenerateAssetCode is used to generate a new asset code for use
 * in a donatable product. The code is written down, and sold with
 * the product so that the purchaser can assign themselves to an
 * asset.
 */
export default class GenerateAssetCode extends LightningElement {

    // The code to be written down
    // Also used for displaying messages in the input box
    @track code;

    // A list of all Access_Code records in salesforce
    @wire(getListUi, {
        objectApiName: ACCESS_CODE_OBJECT,
        listViewApiName: 'All_Access_Codes'
    })
    listView;

    /**
     * acceessCodeObjects returns an array of all
     * Access_Code objects stored in salesforce
     */
    get accessCodeObjects() {
        return this.listView.data.records.records;
    }

    /**
     * generateCode is executed when a user presses the
     * generate button. It generates a new access code
     */
    generateCode() {

        // Initialize the access code object
        const fields = {};
        const recordInput = { apiName: ACCESS_CODE_OBJECT.objectApiName, fields };
        
        // Inform the user that generation is in process
        this.code = 'Generating code...';

        // Get all assets in the database
        assets.find().then( assetObjects => {
            let id = 0;
            let i;
            let map = {};

            // Do not generate a new code if the existing access codes have not loaded
            if (!this.accessCodeObjects) throw Error('Access_Codes failed to load.');

            // Map all of the asset ids currently being tracked in access codes
            for (let accessCodeObject of this.accessCodeObjects) {
                i = accessCodeObject.fields.Asset_Id__c.value;
                map[i] = true;
            }

            // Look for an asset that is not being tracked
            for (let assetObject of assetObjects) {
                i = parseInt(assetObject.asset_id, 10);
                if (map[i] === undefined) {
                    
                    // Use the id of the first untracked asset that is found
                    id = i;
                    break;
                }
            }

            // Do not generate a new code if there are no untracked assets
            if (id < 1) throw Error('There are no untracked assets.');

            // Use the found asset id to create a new access code
            fields[ID_FIELD.fieldApiName] = id;
            createRecord(recordInput).then(assetCode => {
            
                // Display the newly generated code
                this.code = assetCode.id;
            
            });
        }).catch(() => {

            // Display a simple error message if an access code was not generated
            this.code = 'Error: code not generated';
        
        });
    }
}
