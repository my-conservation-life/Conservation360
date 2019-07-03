/* eslint-disable @lwc/lwc/no-async-operation */
/* eslint-disable no-console */
import { createElement } from 'lwc';
import CreateAssetDefinition from 'c/createAssetDefinition';
import { assetDefinitions, dataTypes } from 'c/controllers';

describe('c-create-asset-definition', () => {
    let element;

    let CONSOLE_WARN;
    const LWC_STARTUP_WAIT = 10;
    const DATA_TYPES = ['boolean', 'number', 'datetime', 'location', 'text'];

    const ATTRIBUTES = {
        name: 'testname',
        description: 'testdescription'
    };

    const PROPERTY_ATTRIBUTES = {
        name: '',
        data_type: '',
        required: false,
        is_private: false
    };

    const ASSET_DEFINITION = {
        assetDefinition: {
            ...ATTRIBUTES,
            properties: [
                PROPERTY_ATTRIBUTES
            ]
        }
    };

    const wait = (ms = LWC_STARTUP_WAIT) => new Promise((r) => setTimeout(r, ms));

    beforeAll(() => {
        CONSOLE_WARN = console.warn;
        console.warn = () => { };
    });

    afterAll(() => {
        console.warn = CONSOLE_WARN;
    });

    beforeEach(() => {
        assetDefinitions.create = jest.fn(async () => 1);
        dataTypes.find = jest.fn(async () => DATA_TYPES);

        element = createElement('c-create-asset-definition', { is: CreateAssetDefinition });
        document.body.appendChild(element);
    });

    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('creates a component with 2 inputs and 1 list component', () => {
        const inputElements = element.shadowRoot.querySelectorAll('lightning-input');
        const listElements = element.shadowRoot.querySelectorAll('c-create-asset-definition-list');

        expect(inputElements.length).toBe(2);
        expect(listElements.length).toBe(1);
    });

    it('saves and gets correct attributes', async () => {

        const inputElements = element.shadowRoot.querySelectorAll('lightning-input');
        for (let input of inputElements) {
            input.value = ATTRIBUTES[input.name];
            input.dispatchEvent(new Event('change'));
        }

        await wait();

        element.sendAssetDefinition();
        expect(assetDefinitions.create.mock.calls.length).toBe(1);
        expect(assetDefinitions.create.mock.calls[0][0]).toEqual(ASSET_DEFINITION);
    });
});

