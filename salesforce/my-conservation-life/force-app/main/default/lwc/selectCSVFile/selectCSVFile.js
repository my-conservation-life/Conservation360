import { LightningElement, track } from 'lwc';
// import { assets } from 'c/controllers';

export default class SelectCSVFile extends LightningElement {

    @track csv = null;

    setCSV(event) {
        this.csv = event.target.files[0];
        console.log(this.csv);
    }

    sendCSV() {
        console.log(this.csv);
        // if (!this.csv === null) {
        //     assets.sendCSV(this.csv).then(something => {
        //         console.log('Do I need this?');
        //     });
        // }
    }
}