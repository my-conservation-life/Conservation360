import { LightningElement, api } from 'lwc';

/* L is the Leaflet object constructed by the leaflet.js script */
/*global L*/

/**
 * Returns a Leaflet marker at the location of the asset
 * 
 * precondition: L is an initialized leaflet object
 */
const markerFromAsset = (asset) => L.marker(L.latLng(asset.latitude, asset.longitude));

const API_URL = 'https://cidb-dev-experimental-1.herokuapp.com/api/v1/';

export default class MapProjectAssets extends LightningElement {
    @api
    projectId;

    assetsPromise;
    assetsBboxPromise;

    /**
     * Starts the download for asset details and bounding box early.
     */
    connectedCallback() {
        this.assetsPromise =
            fetch(API_URL + 'assets?project_id=' + this.projectId)
            .then((response) => response.json());

        this.assetsBboxPromise =
            fetch(API_URL + 'bbox-assets?project_id=' + this.projectId)
            .then((response) => response.json());
    }

    /**
     * Event handler for the ready event of the child map component.
     * 
     * When the API call for the bounding box of the assets completes,
     * modify the view of the map to fit all assets within view.
     * 
     * When the API call for the asset data completes,
     * convert each asset into a marker that is displayed on the map
     * all at once.
     * 
     * @param {CustomEvent} event
     * @param {Map} event.details - Leaflet Map of the child component
     */
    onMapInitialized(event) {
        const map = event.detail;

        this.assetsBboxPromise.then((bbox) => {
            map.fitBounds([
                [bbox.latitude_min, bbox.longitude_min],
                [bbox.latitude_max, bbox.longitude_max]]);
        });

        this.assetsPromise.then((assets) => {
            L.featureGroup(assets.map(markerFromAsset)).addTo(map);
        });
    }
}