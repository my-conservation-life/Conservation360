import { LightningElement, wire, track } from 'lwc';

import isGuest from '@salesforce/user/isGuest';
// import Id from '@salesforce/user/Id';
import getCurrentUsersDonations from '@salesforce/apex/DonorCodeController.getCurrentUsersDonations';

import utils from 'c/utils';
const DONOR_CODE_URL = utils.URL + 'assets/donor';

export default class ListDonorCodes extends LightningElement {

    @track
    donorCodes;
    @track
    error;

    // connectedCallback() {
    // }

    handleLoad() {
        getCurrentUsersDonations()
            .then(codes => {
                this.donorCodes = codes;
                this.printDonorCodes(codes);
                this.getMCLAssetsForByDonorCodes(codes);
            })
            .catch(error => {
                this.error = error;
            });
    }

    getMCLAssetsForByDonorCodes(codes) {
        console.log('getMCLAssetsForByDonorCodes()');
        if (codes && Array.isArray(codes)) {
            if (codes.length > 0) {

                // Build a list of donor codes to search the database with
                let body = { donor_code: this.parseDonorCodeListFromDonations(codes) };
                console.log(`Posting ${JSON.stringify(body)} to url: ${DONOR_CODE_URL}`);

                // Request the assets with the donor codes
                utils.post(DONOR_CODE_URL, body)
                    .then(assets => {
                        console.log('Got Response');
                        console.log(JSON.stringify(assets, null, 4));
                    })
                    .catch(error => {
                        console.log(error);
                    });

            } else {
                console.log('No Donations');
            }
        } else {
            console.log('Unexpected type');
        }
    }

    parseDonorCodeListFromDonations(donations) {
        console.log('parseDonorCodeListFromDonations(donations)');

        let donor_codes = [];
        for (let i = 0; i < donations.length; i++) {
            donor_codes.push(`${donations[i].Donation_Code__c}`);
        }
        console.log(`donor_codes = ${JSON.stringify(donor_codes)}`);
        return donor_codes;
    }

    // @wire(getAllDonorCodes)
    wiredDonorCodes({ error, data }) {
        // if (data) {
        //     this.donorCodes = data;
        //     this.error = undefined;
        // } else if (error) {
        //     this.error = error;
        //     this.donorCodes = undefined;
        // }
    
        // if (this.donorCodes && Array.isArray(this.donorCodes)) {
        //     let code;
        //     for (let i = 0; i < this.donorCodes.length; i++) {
        //         code = this.donorCodes[i];
        //         console.log(`Name: ${code.Name} Price: ${code.Price} SerialNumber: ${code.SerialNumber}`);
        //     }
        // }
    }

    printDonorCodes(codes) {
        if (codes && Array.isArray(codes)) {
            if (codes.length > 0) {
                let code;
                for (let i = 0; i < codes.length; i++) {
                    code = codes[i];
                    console.log(` Donor__r.Name: ${code.Donor__r.Name} Donation_Code__c: ${code.Donation_Code__c} Amount__c: ${code.Amount__c} Donor__r.Owner.Name: ${code.Donor__r.Owner.Name}`);
                }
            } else {
                console.log('No Donations');
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
