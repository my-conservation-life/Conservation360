import { LightningElement, track } from 'lwc';

export default class ComboboxBasic extends LightningElement {
    @track value = 'tree';

    get options() {
        return [
            { label: 'Tree', value: 'tree' },
            { label: 'Monkey', value: 'monkey' },
            { label: 'Banana', value: 'banana' },
        ];
    }

    handleChange(event) {
        this.value = event.detail.value;
    }
}
