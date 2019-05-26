import { LightningElement } from 'lwc';
import { loadScript, loadStyle } from 'lightning/platformResourceLoader';

import leaflet from '@salesforce/resourceUrl/leaflet';

/* L is the Leaflet object constructed by the leaflet.js script */
/*global L*/

/**
 * Returns a Leaflet marker at the location of the asset
 * 
 * precondition: L is an initialized leaflet object
 */
const markerFromAsset = (asset) => L.marker(L.latLng(asset.latitude, asset.longitude));

export default class Map extends LightningElement {

    map; // L.map, a leaflet map. constructed in initializeleaflet
    assets;

    /**
     * When the Map LWC is ready, start downloading Leaflet and project assets.
     * 
     * When this is complete, call initializeleaflet()
     */
    connectedCallback() {
        Promise.all([
            Promise.all([
                loadScript(this, leaflet + '/leaflet.js'),
                loadStyle(this, leaflet + '/leaflet.css')
            ]).then(() => {
                this.initializeLeaflet();
                this.setupDefaultView();
                this.setupBaseTiles();
            }),
            fetch('https://cidb-dev-experimental-1.herokuapp.com/getAssetsLocations')
            .then((response) => response.json())
            .then((responseJson) => (this.assets = responseJson))])
        .then(() => L.featureGroup(this.assets.map(asset => markerFromAsset(asset))).addTo(this.map));
    }

    /**
     * Constructs the Leaflet map on the page and initializes this.map
     * 
     * precondition: this.asset contains an array of assets (with properties x and y))
     */
    initializeLeaflet() {
        const mapRoot = this.template.querySelector(".map-root");
        this.map = L.map(mapRoot);
    }

    /**
     * Setup the base OpenStreetMap tile layer
     */
    setupBaseTiles() {
        const mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';

        L.tileLayer(
            'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            {
                attribution: '&copy; ' + mapLink + ' Contributors',
                maxZoom: 18
            })
        .addTo(this.map);
    }

    /**
     * Setup the initial map view
     */
    setupDefaultView() {
        this.map.setView([-19.3, 46.7], 6);
    }
}