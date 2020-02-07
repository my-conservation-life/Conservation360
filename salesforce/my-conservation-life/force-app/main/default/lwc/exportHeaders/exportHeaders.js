import { LightningElement, track } from 'lwc';
import { assetDefinitions } from 'c/controllers';

export default class ExportHeaders extends LightningElement {

    @track value = 'Select an asset type...';
    @track valueID = null;
    @track placeholder = 'N/A';
    @track combo_options = [];

    /**
     * Sets the combobox options.
     */
    connectedCallback() {
        var i;
        assetDefinitions.fetchAssetTypes()
            .then(data => {
                var temp_options = [];
                for (i = 0; i < data.rows.length; i++) {
                    temp_options.push({
                        'label': data.rows[i]['name'] + ': ' + data.rows[i]['id'],
                        'value': data.rows[i]['name'] + ': ' + data.rows[i]['id']
                    });
                }
                this.combo_options = temp_options;
            })
            .catch(e => {
                console.log('Exception: ', e);
            });
    }

    /**
     * Event handler for when something is selected from the combobox.
     * @param {*} event - the event object
     */
    handleChange(event) {
        this.value = event.detail.value;
        this.valueID = event.detail.value.split(':')[1].trimLeft();
    }

    /**
     * Event handler for when the download button is pressed.
     */
    download() {
        var i;
        var csv_data = '';
        var rows = [];
        var hiddenElement;

        assetDefinitions.fetchAssetPropTypes(this.valueID)
            .then(properties => {
                rows = ['asset_id'];
                for (i = 0; i < properties.rows.length; i++) {
                    rows.push(properties.rows[i]['name']);
                }
                csv_data += rows.join(',') + '\n';

                // Creates the CSV file and downloads it.
                hiddenElement = document.createElement('a');
                hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv_data);
                hiddenElement.target = '_blank';
                hiddenElement.download = this.value + '_template.csv';
                hiddenElement.click();
            })
            .catch(e => {
                console.log('Exception: ', e);
            });
    }
}
