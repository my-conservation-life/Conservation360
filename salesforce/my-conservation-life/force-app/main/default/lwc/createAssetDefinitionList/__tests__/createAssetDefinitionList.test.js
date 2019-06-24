import { createElement } from 'lwc';
import createAssetDefinitionList from 'c/createAssetDefinitionList';

describe('c-create-asset-definition-list', () => {
    let element;

    beforeEach(() => {
        element = createElement('c-create-asset-definition-list', { is: createAssetDefinitionList });
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