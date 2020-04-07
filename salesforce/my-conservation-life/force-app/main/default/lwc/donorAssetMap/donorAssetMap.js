import { LightningElement } from 'lwc';

import getCurrentUsersDonations from '@salesforce/apex/DonorCodeController.getCurrentUsersDonations';
import utils from 'c/utils';

const DONOR_CODE_URL = utils.URL + 'assets/donor';

/* L is the Leaflet object constructed by the leaflet.js script */
/*global L*/
export default class DonorAssetMap extends LightningElement {

    assetsPromise;
    map;

    /**
     * Starts the download for asset details and bounding box early.
     */
    connectedCallback() {
        getCurrentUsersDonations()
            .then(codes => {
                this.donorCodes = codes;
                this.getMCLAssetsForDonorCodes(codes);
            })
            .catch(error => {
                this.error = error;
            });
    }

    /**
     * Event handler for the ready event of the child map component.
     * 
     * When the API call for the bounding box of the assets completes,
     * modify the view of the map to fit all assets within view.
     * 
     * When the API call for the asset data completes,
     * convert each asset into a marker that is displayed on the map
     * all at once.
     * 
     * @param {CustomEvent} event the map loading event
     * @param {Map} event.details - Leaflet Map of the child component
     */
    onMapInitialized(event) {
        this.map = event.detail;

        // Set the initial view of the map to Madagascar
        this.map.fitBounds([
            [-13.517837674890671, 38.73764416972347], 
            [-26.096254906968515, 56.41992848829009]]);

        // Locks the map region to one earth (prevents dragging)
        this.map.setMaxBounds([[-90,-180],[90,180]]);
    }

    /**
     * Creates a Leaflet Map Marker from an asset
     * 
     * @param {*} asset an asset with a location
     * @returns {Marker} a leaflet marker
     */
    markerFromAsset(asset) {
        return L.marker(L.latLng(asset.latitude, asset.longitude));
    }

    /**
     * Requests assets from a list of donor codes
     * 
     * @param {*} codes a list of donor codes
     */
    getMCLAssetsForDonorCodes(codes) {
        if (codes && Array.isArray(codes)) {
            if (codes.length > 0) {
                // Build a list of donor codes to search the database with
                let body = { donor_code: this.parseDonorCodeListFromDonations(codes) };

                // Request the assets with the donor codes
                utils.post(DONOR_CODE_URL, body)
                    .then(assets => {
                        L.featureGroup(assets.map(this.markerFromAsset)).addTo(this.map);
                    });

            } else {
                console.log('No Donations');
            }
        } else {
            console.log('Unexpected type');
        }
    }

    /**
     * Creates a list of donor codes from donation objects
     * 
     * @param {Array<Donation_c>} donations a list of SQbject Donations
     * @returns {Array} a list of donor codes
     */
    parseDonorCodeListFromDonations(donations) {
        let donor_codes = [];
        for (let i = 0; i < donations.length; i++) {
            donor_codes.push(`${donations[i].Donation_Code__c}`);
        }
        return donor_codes;
    }

    /**
     * Prints a donation SObject
     * 
     * @param {Array<Donation_c>} donations a list of donation SObjects
     */
    printDonations(donations) {
        if (donations && Array.isArray(donations)) {
            if (donations.length > 0) {
                let donation;
                for (let i = 0; i < donations.length; i++) {
                    donation = donations[i];
                    console.log(` Donor__r.Name: ${donation.Donor__r.Name} Donation_Code__c: ${donation.Donation_Code__c} Amount__c: ${donation.Amount__c}`);
                }
            } else {
                console.log('No Donations');
            }
        } else {
            console.log('Unexpected type');
        }
    }
}
