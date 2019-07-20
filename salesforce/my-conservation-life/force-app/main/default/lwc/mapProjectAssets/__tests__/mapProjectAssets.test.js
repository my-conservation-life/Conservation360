/* eslint-disable @lwc/lwc/no-async-operation */
import { createElement } from 'lwc';
import MapProjectAssets from 'c/mapProjectAssets';
import { assets, bboxAssets } from 'c/controllers';

const LWC_STARTUP_WAIT = 10; // milliseconds to wait the LWC to finish loading

describe('c-map-project-assets', () => {
    let element;
    let featureGroupAddTo;
    let fitBounds;
    const CONSOLE_ERROR = global.console.error;

    let ASSETS;
    let BBOX;

    /**
     * Load the LWC with the given attribute values.
     * 
     * This returns a promise that waits until the LWC has likely finished starting.
     * 
     * @param {*} [projectId] Project ID
     * @returns {Promise<any>} Promise that resolves when loading should be complete
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
        ASSETS = [{ latitude: 1, longitude: 2 }];
        BBOX = { latitude_min: 1, latitude_max: 1, longitude_min: 2, longitude_max: 2 };

        assets.find = jest.fn(() => Promise.resolve(ASSETS));
        bboxAssets.get = jest.fn(() => Promise.resolve(BBOX));
        featureGroupAddTo = jest.fn();
        fitBounds = jest.fn();

        global.L = {
            latLng: jest.fn(),
            map: jest.fn(() => ({
                type: 'map',
                fitBounds: fitBounds
            })),
            marker: jest.fn(),
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
            expect(assets.find).toHaveBeenCalledWith({ projectId: 2 });
            expect(bboxAssets.get).toHaveBeenCalledWith(2);
        })
    );

    it('adds assets to the map when a projectId is specified', () =>
        load(2).then(() => {
            expect(global.L.featureGroup).toHaveBeenCalled();
            expect(global.L.featureGroup.mock.calls[0][0]).toHaveLength(1);
            expect(featureGroupAddTo).toHaveBeenCalled();
        })
    );

    it('adds assets to the map when no projectId is specified', () =>
        load(undefined).then(() => {
            expect(global.L.featureGroup).toHaveBeenCalled();
            expect(global.L.featureGroup.mock.calls[0][0]).toHaveLength(1);
            expect(featureGroupAddTo).toHaveBeenCalled();
        })
    );

    it('does not call fitBounds when there are no assets and there is no bounding box', async () => {
        ASSETS = [];
        BBOX = { latitude_min: null, latitude_max: null, longitude_min: null, longitude_max: null };
        await load(undefined).then(() => {
            expect(fitBounds).not.toHaveBeenCalled();
        });
    });
});
