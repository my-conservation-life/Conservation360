/* eslint-disable @lwc/lwc/no-async-operation */
import { createElement } from 'lwc';
import { loadScript, loadStyle } from 'lightning/platformResourceLoader';
import Map from 'c/map';

const LWC_STARTUP_WAIT = 10; // milliseconds to wait the LWC to finish loading

describe('c-map', () => {
    let element;
    let tileLayerAddTo;
    const CONSOLE_ERROR = global.console.error;

    const LeafletMap = class {
        type = 'map';
    };

    /**
     * Load the LWC.
     * 
     * This returns a promise that waits until the LWC has likely finished starting.
     */
    const load = () => {
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
        tileLayerAddTo = jest.fn();
        global.L = {
            map: jest.fn(() => new LeafletMap()),
            tileLayer: jest.fn(() => ({
                addTo: tileLayerAddTo
            }))
        };

        element = createElement('c-map-project-assets', {
            is: Map
        });
    });

    afterEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('adds a Leaflet map to the HTML element with the map-root class', () =>
        load().then(() => {
            expect(global.L.map).toHaveBeenCalledTimes(1);
            const mapRoot = global.L.map.mock.calls[0][0];
            expect(mapRoot).toBeInstanceOf(HTMLElement);
            expect(mapRoot.classList.contains('map-root')).toBeTruthy();
        })
    );

    it('downloads Leaflet library', () =>
        load().then(() => {
            expect(loadScript).toHaveBeenCalled();
            expect(loadScript.mock.calls[0][1]).toEqual(expect.stringContaining('leaflet.js'));
            expect(loadStyle).toHaveBeenCalled();
            expect(loadStyle.mock.calls[0][1]).toEqual(expect.stringContaining('leaflet.css'));
        })
    );

    it('emits a ready event when fully initialized', () => {
        const readyHandler = jest.fn();
        element.addEventListener('ready', readyHandler);

        return load().then(() => {
            expect(readyHandler).toHaveBeenCalledTimes(1);
            expect(readyHandler.mock.calls[0][0]).toBeInstanceOf(CustomEvent);
            expect(readyHandler.mock.calls[0][0].detail).toBeInstanceOf(LeafletMap);
        });
    });

    it('adds a base tileLayer', () =>
        load().then(() => {
            expect(tileLayerAddTo).toHaveBeenCalled();
        })
    );
});
