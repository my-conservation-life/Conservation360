import { LightningElement, track } from 'lwc';
import { assetDefinitions } from 'c/controllers';

/**
 * ImportCSV sends a .csv file selected by the user to Heroku
 */
export default class ImportCSV extends LightningElement {

    // Combobox variables
    @track options = [];
    @track assetTypeString = '';
    @track description = '';

    // CSV selection variables
    @track csv = null;
    @track fileName = '';
    
    // Import response message variables
    @track importing = false;
    @track hasSuccess = false;
    @track hasError = false;
    @track fileSent = '';
    @track errorMessage = '';

    connectedCallback() {
        assetDefinitions.findAssetTypes()
            .then(assetTypes => {
                // populate combobox with asset types
                const typeOptions = [];

                var i;
                for (i = 0; i < assetTypes.length; i++) {
                    const assetType = assetTypes[i];
                    const assetTypeString = JSON.stringify(assetType);

                    const optionLabel = `${assetType.id}: ${assetType.name}`;
                    const option = {label: optionLabel, value: assetTypeString};
                    typeOptions.push(option);
                }

                this.options = typeOptions;
            })
            .catch(e => {
                console.error(e);
            });
    }

    // Handler for when an asset type is selected
    handleChange(event) {
        // Set asset type selected
        const assetTypeString = event.detail.value;
        this.assetTypeString = assetTypeString;

        // Show description of selected asset type
        const assetType = JSON.parse(assetTypeString);
        const description = assetType.description;
        if (description !== null) {
            this.description = assetType.description;
        }
        else {
            this.description = 'No description found.';
        }

        // Enable 'Import' button if an asset type and a CSV file have been selected
        if (this.assetTypeString !== '' && this.csv !== null) {
            let button = this.template.querySelector('lightning-button');
            button.disabled = false;
        }
    }

    setCSV(event) {
        this.csv = event.target.files[0];
        this.fileName = this.csv.name;

        // Enable 'Import' button if an asset type and a CSV file have been selected
        if (this.assetTypeString !== '' && this.csv !== null) {
            let button = this.template.querySelector('lightning-button');
            button.disabled = false;
        }

        // Remove focus from file input element
        let fileInput = this.template.querySelector('lightning-input');
        fileInput.blur();
    }

    // Send CSV file to the server
    sendCSVFile() {
        // Disable 'Import' button while waiting for CSV to be processed
        let button = this.template.querySelector('lightning-button');
        button.disabled = true;

        // Show importing CSV message
        this.importing = true;

        // Hide any success or error messages
        this.hasSuccess = false;
        this.hasError = false;

        const assetType = JSON.parse(this.assetTypeString);
        if (this.csv !== null) {
            assetDefinitions.sendCSV(assetType.id, this.csv)
                .then(response => {
                    this.importing = false;

                    // Show message based on whether if CSV import is successful or not
                    if (response.result.success === true) {
                        this.hasSuccess = true;
                        this.hasError = false;
                    }
                    else {
                        this.hasSuccess = false;
                        this.hasError = true;
                        this.errorMessage = response.result.error;
                    }

                    this.fileSent = this.csv.name;
                    button.disabled = false;
                })
                .catch(e => {
                    this.importing = false;
                    this.hasSuccess = false;
                    this.hasError = true;
                    this.errorMessage = 'An issue has occurred while processing the CSV. This could be due to the CSV file containing too many rows to be handled at once or a weak wi-fi connection.';
                    console.log('Exception: ', e);

                    this.fileSent = this.csv.name;
                    button.disabled = false;
                });
        }
    }
}
