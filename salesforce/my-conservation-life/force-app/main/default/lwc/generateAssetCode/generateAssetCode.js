import { LightningElement, track, wire } from 'lwc';
import { assets } from 'c/controllers';
import { createRecord } from 'lightning/uiRecordApi';
import { getListUi } from 'lightning/uiListApi';
 
import ACCESS_CODE_OBJECT from '@salesforce/schema/Access_Code__c';
import ID_FIELD from '@salesforce/schema/Access_Code__c.Asset_Id__c';

// A boolean used for identifying if asset generation is locked
let locked = false;

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

    // An internal list for tracking asset ids that have been assigned to an Access_Code
    assigned = {};

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

        // Disable the generate button temporarily
        this.template.querySelector('.gen-btn').disabled = true;

        // Inform the user that generation is in process
        this.code = 'Generating code...';

        // Get all assets in the database
        assets.find().then( assetObjects => {
            
            // Do not generate a code if the existing access codes have not loaded
            if (!this.accessCodeObjects) throw Error('Access_Codes failed to load.');

            // Do not generate a code if generation is locked
            if (locked) return;

            // If it is not locked, lock it
            locked = true;

            // Mark all of the asset ids currently being tracked in access codes
            let i;
            for (let accessCodeObject of this.accessCodeObjects) {
                i = accessCodeObject.fields.Asset_Id__c.value;
                this.assigned[i] = true;
            }

            // Look for an asset id that is not being tracked
            let id = 0;
            for (let assetObject of assetObjects) {
                i = parseInt(assetObject.asset_id, 10);
                if (this.assigned[i] === undefined) {
                    
                    // Use the first untracked asset id that is found
                    id = i;
                    break;
                }
            }

            // Do not generate a new code if there are no untracked assets
            if (id < 1) throw Error('There are no untracked assets.');

            // Use the found asset id to create a new access code
            const fields = {};
            const recordInput = { apiName: ACCESS_CODE_OBJECT.objectApiName, fields };
            fields[ID_FIELD.fieldApiName] = id;
            createRecord(recordInput).then(assetCode => {
            
                // Track this new asset code in the internal list
                this.assigned[id] = true;

                // Display the newly generated code
                this.code = assetCode.id;

                // Unlock generation on success
                locked = false;
                this.template.querySelector('.gen-btn').disabled = false;
            
            });
        }).catch(() => {

            // Display a simple error message if an access code was not generated
            this.code = 'Error: code not generated';

            // Unlock generation on failure
            locked = false;
            this.template.querySelector('.gen-btn').disabled = false;
        });
        // No finally statement because then a blocked call would unlock generation
    }
}
