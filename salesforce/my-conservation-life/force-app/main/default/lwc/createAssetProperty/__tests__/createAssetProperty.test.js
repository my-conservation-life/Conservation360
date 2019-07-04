/* eslint-disable no-console */
import { createElement } from 'lwc';
import CreateAssetProperty from 'c/createAssetDefinitionProperty';

describe('c-create-asset-property', () => {
    let element;
    let CONSOLE_WARN;

    const ATTRIBUTES = {
        name: 'testname',
        data_type: 'testdatatype',
        required: true,
        is_private: true,
        value: 'testvalue'
    };

    const OPTIONS = ['boolean', 'number', 'datetime', 'location', 'text'];

    const getInputs = (ele) => ele.shadowRoot.querySelectorAll('lightning-input, lightning-combobox');

    const removeComponents = () => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    };

    beforeAll(() => {
        CONSOLE_WARN = console.warn;
        console.warn = () => { };
    });

    afterAll(() => {
        console.warn = CONSOLE_WARN;
    });

    beforeEach(() => {
        element = createElement('c-create-asset-property', { is: CreateAssetProperty });
        element.propertyDataTypes = JSON.stringify(OPTIONS);
        document.body.appendChild(element);
    });

    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        removeComponents();
    });

    it('saves and gets correct attributes', () => {
        // set all inputs' values to the values in attributes
        const inputs = getInputs(element);
        for (let input of inputs) {
            const value = ATTRIBUTES[input.name];

            if (input.type === 'checkbox') input.checked = value;
            else input.value = value;

            input.dispatchEvent(new Event('change'));
        }

        expect(element.getAttributes()).toEqual(ATTRIBUTES);
    });

    it('creates custom event when remove button is clicked', (done) => {
        element.propertyKey = 1;

        element.addEventListener('removeproperty', (event) => {
            const receivedKey = event.detail;
            expect(receivedKey).toBe(element.propertyKey);
            done();
        });

        const removeButton = element.shadowRoot.querySelector('lightning-button');
        removeButton.dispatchEvent(new Event('click'));
    });

    it('gets correct combobox options', () => {
        const comboboxElement = element.shadowRoot.querySelector('lightning-combobox');
        const receivedOptions = comboboxElement.options;

        for (let option of receivedOptions)
            expect(OPTIONS).toContain(option.value);
    });

    it('correctly sets for prefilled properties', () => {
        // Remount component to the DOM so we can set propertyData and have renderedCallback called
        removeComponents();
        element.propertyData = JSON.stringify(ATTRIBUTES);
        document.body.appendChild(element);

        const inputs = getInputs(element);
        for (let input of inputs) expect(input.disabled).toBe(true);
        expect(element.getIsCustomProperty()).toBe(false);
        expect(element.getAttributes()).toEqual(ATTRIBUTES);
    });
});