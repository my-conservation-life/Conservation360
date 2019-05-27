import { LightningElement, track } from 'lwc';

export default class ComboboxBasic extends LightningElement {
    @track value = 'baum';

    get options() {
        return [
            { label: 'Baum', value: 'baum' },
            { label: 'Bär', value: 'bär' },
            { label: 'Eichhörnchen', value: 'eichhörnchen' },
        ];
    }

    handleChange(event) {
        this.value = event.detail.value;
    }
}
