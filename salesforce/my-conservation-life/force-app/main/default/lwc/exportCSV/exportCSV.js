import { LightningElement, track } from 'lwc';
import { assetDefinitions } from 'c/controllers';

export default class ExportCSV extends LightningElement {

    @track value = 'Select an asset type...';
    @track valueID = null;
    @track placeholder = 'N/A';
    @track typeOptions;
    @track typeIdOptions;
    @track descriptionOptions;
    @track propertiesOptions;
    @track combo_options = [];
    @track CSV_data = [];

    connectedCallback() {
        var i;
        assetDefinitions.findAssetTypes()
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

    handleChange(event) {
        this.value = event.detail.value;
        this.valueID = event.detail.value.split(':')[1].trimLeft();
    }

    download() {        
        var i, j;
        var csv_data = '';
        var rows = [];
        assetDefinitions.fetchAssetPropTypes(this.valueID)
            .then(properties => {
                rows = [this.valueID, this.value.split(':')[0].trimRight()];
                for (i = 0; i < properties.rows.length; i++) {
                    rows.push(properties.rows[i]['name']);
                }
                csv_data += rows.join(',') + '\n';
                assetDefinitions.fetchAssetsByTypeID(this.valueID)
                    .then(assets => {
                        rows = [];
                        for (i = 0; i < assets.rows.length; i++) {
                            rows.push(this.valueID);
                            rows.push(assets.rows[i]['id']);
                            assetDefinitions.fetchAssetProperties(assets.rows[i]['id'])
                                .then(props => {
                                    for (j = 0; j < props.rows.length; j++) {
                                        rows.push(props.rows[i]);
                                    }
                                    csv_data += rows.join(',') + '\n';
                                    rows = [];
                                })
                                .catch(e => {
                                    console.log('sdfwf', e);
                                });
                        }
                        /////////////
                        var hiddenElement = document.createElement('a');
                        hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv_data);
                        hiddenElement.target = '_blank';
                        hiddenElement.download = this.value + '.csv';
                        hiddenElement.click();
                        ///////////////////////                    
                    })
                    .catch(e => {
                        console.log('props exception: ', e);
                    });
            })
            .catch(e => {
                console.log('Exception: ', e);
            });
        
    }
}
