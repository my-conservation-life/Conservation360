import { LightningElement, track } from 'lwc';
export default class GenerateAsset extends LightningElement {
    @track greeting = 'World';
    changeHandler(event) {
        this.greeting = event.target.value;
    }
}