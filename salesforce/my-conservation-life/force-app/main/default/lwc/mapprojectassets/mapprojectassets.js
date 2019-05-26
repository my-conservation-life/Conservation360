import { LightningElement } from 'lwc';

/* L is the Leaflet object constructed by the leaflet.js script */
/*global L*/

/**
 * Returns a Leaflet marker at the location of the asset
 * 
 * precondition: L is an initialized leaflet object
 */
const markerFromAsset = (asset) => L.marker(L.latLng(asset.latitude, asset.longitude));

export default class MapProjectAssets extends LightningElement {
    assetsPromise;

    constructor() {
        super();

        this.assetsPromise = fetch('https://cidb-dev-experimental-1.herokuapp.com/getAssetsLocations');
    }

    onMapInitialized(event) {
        const map = event.detail;
        map.setView([-19.3, 46.7], 6);

        this.assetsPromise
        .then((response) => response.json())
        .then((assets) => L.featureGroup(assets.map(asset => markerFromAsset(asset))).addTo(map));
    }
}