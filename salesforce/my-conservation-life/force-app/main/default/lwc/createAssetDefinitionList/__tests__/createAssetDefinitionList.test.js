/* eslint-disable no-console */
import { createElement } from 'lwc';
import CreateAssetDefinitionList from 'c/createAssetDefinitionList';
import { dataTypes } from 'c/controllers';

describe('c-create-asset-definition-list', () => {
    let element;
    let CONSOLE_WARN;

    let DATA_TYPES = ['boolean', 'number', 'datetime', 'location', 'text'];

    beforeAll(() => {
        CONSOLE_WARN = console.warn;
        console.warn = () => { };
    });

    afterAll(() => {
        console.warn = CONSOLE_WARN;
    });

    beforeEach(() => {
        dataTypes.find = () => jest.fn(async () => ['']);

        element = createElement('c-create-asset-definition-list', { is: CreateAssetDefinitionList });
        document.body.appendChild(element);
    });

    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    test('new test', () => {
        console.log(element.shadowRoot.querySelectorAll('c-create-asset-definition-property'));
    });
});