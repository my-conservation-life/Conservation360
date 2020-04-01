import { LightningElement, wire } from 'lwc';

import isGuest from '@salesforce/user/isGuest';
import Id from '@salesforce/user/Id';
import getAllDonorCodes from '@salesforce/apex/donorCodeController.getAllDonorCodes';
import getAllDonorCodesForDonor from '@salesforce/apex/donorCodeController.getAllDonorCodesForDonor';
import getUserFullName from '@salesforce/apex/donorCodeController.getUserFullName';
import getUserAssets from '@salesforce/apex/donorCodeController.getUserAssets';
import getUserId from '@salesforce/apex/donorCodeController.getUserId';

export default class DonorCodeController extends LightningElement {


    allDonorCodes;
    error;


    @wire(getAllDonorCodes)
    wiredDonorCodes({ error, data }) {
        // if (data) {
        //     this.allDonorCodes = data;
        //     this.error = undefined;
        // } else if (error) {
        //     this.error = error;
        //     this.allDonorCodes = undefined;
        // }
    
        // if (this.allDonorCodes && Array.isArray(this.allDonorCodes)) {
        //     let code;
        //     for (let i = 0; i < this.allDonorCodes.length; i++) {
        //         code = this.allDonorCodes[i];
        //         console.log(`Name: ${code.Name} Price: ${code.Price} SerialNumber: ${code.SerialNumber}`);
        //     }
        // }
    }

    printAssetsList(assets) {
        if (assets && Array.isArray(assets)) {
            if (assets.length > 0) {
                let asset;
                for (let i = 0; i < assets.length; i++) {
                    asset = assets[i];
                    console.log(`Name: ${asset.Name} Price: ${asset.Price} SerialNumber: ${asset.SerialNumber}`);
                    console.log(`Created By: ${asset.CreatedById}`);
                }
            } else {
                console.log('No Assets');
            }
        } else {
            console.log('Unexpected type');
        }
    }


    getCodesForDonor(sn) {
        getAllDonorCodesForDonor({ serialNumber: sn })
            .then(data => {
                console.log('getCodesForDonor()');
                this.printAssetsList(data);
            })
            .catch(error => {
                console.log(error);
            });
    }

    printUserFullName() {
        getUserFullName()
            .then(name => {
                if (name) {
                    console.log('The current user\'s name is ' + name);
                } else {
                    console.log('The name was undefined...');
                }
            })
            .catch(error => {
                console.log(error);
            });
    }

    printUserId() {
        getUserId()
            .then(data => {
                if (data) {
                    console.log('The current user\'s id is ' + data);
                } else {
                    console.log('The name was undefined...');
                }
            })
            .catch(error => {
                console.log(error);
            });
    }

    printUsersAssets() {
        getUserAssets()
            .then(data => {
                console.log('printUsersAssets()');
                this.printAssetsList(data);
            })
            .catch(error => {
                console.log(error);
            });
    }

    getLoggedInUserDonorCodes = () => {
        if (isGuest) {
            return [];
        }
    
    
        return [];
    };
}
