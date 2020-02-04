import { LightningElement, track } from 'lwc';
import { assetDefinitions } from 'c/controllers';

export default class ExportCSV extends LightningElement {

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
        var i, j;
        var csv_data = '';
        var rows = [];
        var props = {};
        var keys;
        var hiddenElement;

        assetDefinitions.fetchAssetPropTypes(this.valueID)
            .then(properties => {
                // [asset_type_id],[asset_type_name]
                rows = ['asset_type_id', this.value.split(':')[0].trimRight()];
                for (i = 0; i < properties.rows.length; i++) {
                    rows.push(properties.rows[i]['name']);
                }
                csv_data += rows.join(',') + '\n';

                assetDefinitions.fetchAssetPropsByTypeID(this.valueID)
                    .then(data => {
                        for (i = 0; i < data.rows.length; i++) {
                            if (!props[data.rows[i]['id']]) {
                                props[data.rows[i]['id']] = [];
                            }
                            props[data.rows[i]['id']].push(data.rows[i]['value']);
                        }

                        keys = Object.keys(props);                            
                        for (i = 0; i < keys.length; i++) {
                            rows = [];
                            rows.push(this.valueID);
                            rows.push(keys[i]);
                            for (j = 0; j < props[keys[i]].length; j++) {
                                rows.push(props[keys[i]][j]);
                            }
                            csv_data += rows.join(',') + '\n';
                        }

                        // Creates the CSV file and downloads it.
                        hiddenElement = document.createElement('a');
                        hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv_data);
                        hiddenElement.target = '_blank';
                        hiddenElement.download = this.value + '.csv';
                        hiddenElement.click();
                    })
                    .catch(e => {
                        console.log("Exception: ", e);
                    });
            })
            .catch(e => {
                console.log('Exception: ', e);
            });
    }
}
