import { LightningElement } from 'lwc';

export default class CreateAsset extends LightningElement {
    
    get options() {
        return [
            { label: 'Baum', value: 'baum' },
            { label: 'Eisbär', value: 'eisbär' },
            { label: 'Eichhörnchen', value: 'eichhörnchen' },
        ];
    }

    handleChange(event) {
        this.value = event.detail.value;
    }

}