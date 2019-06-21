import { createElement } from 'lwc';
import CreateAssetDefinitionProperty from 'c/createAssetDefinitionProperty';

describe('c-create-asset-definition-property', () => {
    let element;

    beforeEach(() => {
        element = createElement('c-map-project-assets', {
            is: CreateAssetDefinitionProperty
        });

        document.body.appendChild(element);
    });

    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('appends correctly', () => {
        console.log(element.getAttributes());
    });
});