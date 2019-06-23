import { createElement } from 'lwc';
import CreateAssetDefinitionProperty from 'c/createAssetDefinitionProperty';

describe('c-create-asset-definition-property', () => {
    let element;
    let CONSOLE_WARN;

    const attributes = {
        name: 'testname',
        data_type: 'testdatatype',
        required: true,
        is_private: true
    };

    beforeAll(() => {
        CONSOLE_WARN = console.warn;
        console.warn = () => { };
    });

    afterAll(() => {
        console.warn = CONSOLE_WARN;
    });

    beforeEach(() => {
        element = createElement('c-map-project-assets', { is: CreateAssetDefinitionProperty });
        document.body.appendChild(element);
    });

    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('gets correct attributes', () => {
        const inputs = element.shadowRoot.querySelectorAll('lightning-input, lightning-combobox');
        for (let input of inputs) {
            const value = attributes[input.name];

            if (input.type === 'checkbox') input.checked = value;
            else input.value = value;

            input.dispatchEvent(new Event('change'));
        }

        expect(element.getAttributes()).toEqual(attributes);
    });
});