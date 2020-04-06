/* eslint-disable vars-on-top */
import { LightningElement } from 'lwc';
import { loadScript, loadStyle } from 'lightning/platformResourceLoader';
import leaflet from '@salesforce/resourceUrl/leaflet';
import leafletDraw from '@salesforce/resourceUrl/leafletDraw';

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
            loadStyle(this, leaflet + '/leaflet.css'),
            loadScript(this, leafletDraw + '/dist/leaflet.draw.js'),
            loadStyle(this, leafletDraw + '/dist/leaflet.draw.css')

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
        this.map.setMinZoom(2);
        this.map.setMaxZoom(17);
        this.addDrawTools();
    }
    
    /**
     * Adds the drawing tools to the map interface
     */
    addDrawTools() {
        var drawnItems = new L.FeatureGroup();
        this.map.addLayer(drawnItems);
        var drawControl = new L.Control.Draw({
            draw: {
                polygon: {
                    allowIntersection: false, //Disallows crossing over of lines in polygons
                    drawError: {
                        color: '#8B0000', //Turns darkred
                        message: '<strong>Intersecting lines not allowed<strong>'
                    },
                    shapeOptions: {
                        color: '#007300'
                    }
                },
                rectangle: {
                    showArea: false,
                    shapeOptions: {
                        color: '#e59400'
                    }
                },
                polyline: false,
                marker: false,
                circlemarker: false
            },
            edit: {
                featureGroup: drawnItems,
                remove: false,
                edit: false
            }
        });
        this.map.addControl(drawControl);
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
            })
            .addTo(this.map);
    }
}
