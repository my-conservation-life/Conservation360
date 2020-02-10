import { LightningElement } from 'lwc';
import { loadScript, loadStyle } from 'lightning/platformResourceLoader';

import leaflet from '@salesforce/resourceUrl/leaflet';

/* L is the Leaflet object constructed by the leaflet.js script */
/*global L*/

export default class Map extends LightningElement {

    map; // L.map, a leaflet map. constructed in initializeleaflet

    /**
     * When the Map LWC is ready, start downloading Leaflet.
     * 
     * When this is complete, call initializeleaflet()
     */
    connectedCallback() {
        Promise.all([
            loadScript(this, leaflet + '/leaflet.js'),
            loadStyle(this, leaflet + '/leaflet.css')
        ]).then(() => {
            this.initializeLeaflet();
            this.setupBaseTiles();
            this.dispatchEvent(new CustomEvent('ready', { detail: this.map }));
        });
    }

    /**
     * Constructs the Leaflet map on the page and initializes this.map
     */
    initializeLeaflet() {
        const mapRoot = this.template.querySelector('.map-root');
        this.map = L.map(mapRoot);
        this.map.fitWorld();
        L.control.scale().addTo(this.map);
        
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
                //minZoom: 4,
                maxZoom: 5,
                maxNativeZoom: 5
            })
            .addTo(this.map);
    }
}