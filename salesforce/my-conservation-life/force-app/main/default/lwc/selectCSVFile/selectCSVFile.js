import { LightningElement } from 'lwc';

export default class SelectCSVFile extends LightningElement {

    getCSV(event) {
        console.log(event.target.files[0]);
    }
}