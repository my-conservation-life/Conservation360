import { LightningElement } from 'lwc';

export default class CreateAssetProperty extends LightningElement {
    get options() {
        return [
            { label: 'Text', value: 'text' },
            { label: 'Boolean', value: 'boolean' },
            { label: 'Number', value: 'number' },
            { label: 'Date Time', value: 'datetime' },
            { label: 'Location', value: 'location' },
        ];
    }
}