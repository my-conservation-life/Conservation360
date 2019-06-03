/* eslint-disable @lwc/lwc/no-async-operation */
import { createElement } from 'lwc';
import MapProjectAssets from 'c/mapProjectAssets';
import { assets, bboxAssets } from 'c/dbApiService';

const LWC_STARTUP_WAIT = 10; // milliseconds to wait the LWC to finish loading

describe('c-map-project-assets', () => {
    let element;
    let featureGroupAddTo;
    const CONSOLE_ERROR = global.console.error;

    /**
     * Load the LWC with the given attribute values.
     * 
     * This returns a promise that waits until the LWC has likely finished starting.
     * 
     * @param {*} projectId 
     */
    const load = (projectId) => {
        element.projectId = projectId;
        document.body.appendChild(element);

        return new Promise((resolve) => setTimeout(resolve, LWC_STARTUP_WAIT));
    };

    beforeAll(() => {
        // Suppress irrelevant console error log caused by a LWC error
        // on the title attribute of the lightning-card in this component's HTML
        global.console.error = jest.fn();
    });

    afterAll(() => {
        // Restore the original console error function
        global.console.error = CONSOLE_ERROR;
    });

    beforeEach(() => {
        assets.find = jest.fn(() => Promise.resolve([]));
        bboxAssets.get = jest.fn(() => Promise.resolve({}));
        featureGroupAddTo = jest.fn();

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
    });

    afterEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('retrieves assets and bounding box for project 2', () =>
        load(2).then(() => {
            expect(assets.find).toHaveBeenCalledWith(2);
            expect(bboxAssets.get).toHaveBeenCalledWith(2);
        })
    );

    it('adds assets to the map when a projectId is specified', () =>
        load(2).then(() => {
            expect(global.L.featureGroup).toHaveBeenCalledWith([]);
            expect(featureGroupAddTo).toHaveBeenCalled();
        })
    );

    it('adds assets to the map when no projectId is specified', () =>
        load(undefined).then(() => {
            expect(global.L.featureGroup).toHaveBeenCalledWith([]);
            expect(featureGroupAddTo).toHaveBeenCalled();
        })
    );
});
