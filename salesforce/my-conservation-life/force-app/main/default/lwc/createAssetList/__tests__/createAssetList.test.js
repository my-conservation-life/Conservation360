/* eslint-disable @lwc/lwc/no-async-operation */
/* eslint-disable no-console */
import { createElement } from 'lwc';
import CreateAssetList from 'c/createAssetDefinitionList';
import { dataTypes } from 'c/controllers';

describe('c-create-asset-list', () => {
    let element;

    let CONSOLE_WARN;
    const LWC_STARTUP_WAIT = 10;
    const DATA_TYPES = ['boolean', 'number', 'datetime', 'location', 'text'];

    const wait = (ms = LWC_STARTUP_WAIT) => new Promise((r) => setTimeout(r, ms));

    beforeAll(() => {
        CONSOLE_WARN = console.warn;
        console.warn = () => { };
    });

    afterAll(() => {
        console.warn = CONSOLE_WARN;
    });

    beforeEach(() => {
        dataTypes.find = jest.fn(async () => DATA_TYPES);

        element = createElement('c-create-asset-definition-list', { is: CreateAssetDefinitionList });
        document.body.appendChild(element);
    });

    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('creates a list with one prefilled property and one custom property', () => {
        const propertyElements = element.shadowRoot.querySelectorAll('c-create-asset-definition-property');
        const customProperties = element.getCustomProperties();

        // We have 2 properties
        expect(propertyElements.length).toBe(2);

        // We have only 1 custom property
        expect(customProperties.length).toBe(1);
        // A truthy value returns for the custom property
        // We don't care about what it contains
        expect(customProperties[0]).toBeTruthy();
    });

    it('calls controller to get dataTypes', () => {
        expect(dataTypes.find.mock.calls.length).toBe(1);
    });

    it('adds custom properties', async () => {
        const addPropertyButton = element.shadowRoot.querySelector('lightning-button');
        addPropertyButton.dispatchEvent(new Event('click'));
        await wait();

        expect(element.getCustomProperties().length).toBe(2);

    });

    it('handles CustomEvent removeproperty', async () => {
        const customProperties = element.shadowRoot.querySelectorAll('c-create-asset-definition-property');
        let customProperty;
        for (let property of customProperties) {
            if (property.getIsCustomProperty()) {
                customProperty = property;
                break;
            }
        }

        const removeEvent = new CustomEvent('removeproperty', { detail: 1 });
        customProperty.dispatchEvent(removeEvent);
        await wait();

        expect(element.getCustomProperties().length).toBe(0);
    });
});