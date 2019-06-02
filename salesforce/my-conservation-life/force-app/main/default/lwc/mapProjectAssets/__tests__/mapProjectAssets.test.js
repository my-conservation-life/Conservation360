/* eslint-disable @lwc/lwc/no-async-operation */
import { createElement } from 'lwc';
import MapProjectAssets from 'c/mapProjectAssets';
import { assets, bboxAssets } from 'c/dbApiService';

describe('c-map-project-assets', () => {
    let element;
    let featureGroupAddTo = jest.fn();
    const CONSOLE_ERROR = global.console.error;

    beforeAll(() => {
        assets.find = jest.fn(() => Promise.resolve([]));
        bboxAssets.get = jest.fn(() => Promise.resolve({}));

        // Suppress irrelevant console error log caused by a LWC error
        // on the title attribute of the lightning-card in this component's HTML
        global.console.error = jest.fn();
    });

    afterAll(() => {
        // Restore the original console error function
        global.console.error = CONSOLE_ERROR;
    });

    beforeEach(() => {
        global.L = {
            map: jest.fn(() => ({
                type: 'map',
                fitBounds: jest.fn()
            })),
            tileLayer: jest.fn(() => ({
                addTo: jest.fn()
            })),
            featureGroup: jest.fn(() => ({ addTo: featureGroupAddTo }))
        };

        element = createElement('c-map-project-assets', {
            is: MapProjectAssets
        });
        element.projectId = 2;

        document.body.appendChild(element);
    });

    afterEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('retrieves assets and bounding box for project 2', () => {
        expect(assets.find).toHaveBeenCalledWith(2);
        expect(bboxAssets.get).toHaveBeenCalledWith(2);
    });

    it('loads without crashing', (done) => {
        setTimeout(done, 1000);
    });

    it('adds a feature group to the map', () => {
        expect(global.L.featureGroup).toHaveBeenCalledWith([]);
        expect(featureGroupAddTo).toHaveBeenCalled();
    });
});
