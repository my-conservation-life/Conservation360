import { LightningElement, track } from 'lwc';

export default class CreateAssetList extends LightningElement {
    id = 1;

    @track
    properties = [this.id];

    addCustomProperty() {
        this.id++;
        this.properties.push(this.id);
    }
}