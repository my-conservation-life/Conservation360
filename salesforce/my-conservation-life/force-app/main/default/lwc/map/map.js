import { LightningElement } from 'lwc';
import { loadScript, loadStyle } from 'lightning/platformResourceLoader';

import leaflet from '@salesforce/resourceUrl/leaflet';

/* L is the Leaflet object constructed by the leaflet.js script */
/*global L*/

export default class Map extends LightningElement {

    connectedCallback() {
        Promise.all([
            loadScript(this, leaflet + '/leaflet.js'),
            loadStyle(this, leaflet + '/leaflet.css')
        ]).then(() => {
                this.initializeleaflet();
        });
    }

    initializeleaflet() {
        const mapRoot = this.template.querySelector(".map-root");
        const map = L.map(mapRoot).setView([-19.3, 46.7], 6);
        const mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
        L.tileLayer(
            'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            {
                attribution: '&copy; ' + mapLink + ' Contributors',
                maxZoom: 18
            }).addTo(map);
    }
}