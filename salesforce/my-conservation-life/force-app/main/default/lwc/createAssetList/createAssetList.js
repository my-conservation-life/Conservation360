import { LightningElement, track } from 'lwc';

export default class CreateAssetList extends LightningElement {
    id = 1;

    @track
    properties = [this.id];

    addCustomProperty() {
        this.id++;
        this.properties.push(this.id);

        fetch("https://my-conservation-life.herokuapp.com/getDataTypes",
        {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(json => console.log(json));
    }
}