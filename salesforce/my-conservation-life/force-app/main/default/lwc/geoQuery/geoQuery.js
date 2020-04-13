/* eslint-disable vars-on-top */
/* eslint-disable no-console */
import { LightningElement } from 'lwc';

import leafletDraw from '@salesforce/resourceUrl/leafletDraw';

import utils from 'c/utils';

const DISTANCE_URL = utils.URL + 'assets/geometrySearch/distance';
const POLY_URL = utils.URL + 'assets/geometrySearch/polygon';

/* L is the Leaflet object constructed by the leaflet.js script */
/*global L*/
export default class GeoQuery extends LightningElement {
    assetsPromise;

    /**
     * Starts the download for asset details and bounding box early.
     */
    connectedCallback() {
        //Handled elsewhere
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
        // Get the leaflet map... I have been having a hard time making this a class variable... 
        const map = event.detail;

        // An array of assets
        this.myAssets = [];

        // Set the initial view of the map to Madagascar
        map.fitBounds([
            [-30.06909396443886, 26.102030238912395], 
            [-7.231698708367139, 74.47760116029443]]);

        // Locks the map region to one earth (prevents dragging)
        map.setMaxBounds([[-90,-180],[90,180]]);
        var editableLayers = new L.FeatureGroup();
        map.addLayer(editableLayers);

        map.on('draw:created', function(e) {
            var type = e.layerType,
                layer = e.layer;

            //Sets the icons for the trees
            var baobabIcon = L.icon({
                iconUrl: 'https://i.imgur.com/RQM5bdh.png',
                iconSize: [32, 32]
            });

            //Sets the icon for lemurs
            var lemurIcon = L.icon({
                iconUrl: 'https://i.imgur.com/d2uKnLn.png',
                iconSize: [32, 32]
            });

            if (type === 'circle') {
                //Gets the center point from the circle object
                map.addLayer(layer);
                var centerPnt = layer.getLatLng();
                var center = [centerPnt.lng,centerPnt.lat];
                console.log('The center point is ' + center);
               
                //Gets the radius from the created circle object
                let rad = layer.getRadius();
                console.log('The radius is ' + rad);

                //Adds the circle to the map
                editableLayers.addLayer(layer);
                console.log(`Map clicked at lat: ${centerPnt.lat} lon: ${centerPnt.lng}`);
                
                //Gets the information needed for the query to the DB
                const distanceURL = new URL(DISTANCE_URL);
                distanceURL.searchParams.append('latitude', `${centerPnt.lat}`);
                distanceURL.searchParams.append('longitude', `${centerPnt.lng}`);
                distanceURL.searchParams.append('radiusMeters', `${rad}`);

                console.log('Posting: ' + distanceURL.href);

                // Send out the POST request
                this.assetsPromise = utils.post(distanceURL.href);

                // When the promise is fulfilled handle it
                //Tried to break this entire block out into a separate method but the LWC gets weird when that happens.
                this.assetsPromise.then(response => {
                    // Response should be an array of assets
                    console.log(response);

                    // Initialize the array if need be
                    if (this.myAssets === undefined) {
                        this.myAssets = [];
                    }

                    // Iterate over the assets and add them to the map
                    let assetIndex;
                    for (assetIndex = 0; assetIndex < response.length; assetIndex++) {
                        const assetResponse = response[assetIndex];

                        // Create the map marker, asset type determine the icon
                        let markerIcon;
                        if (assetResponse.asset_type === 'Tree') {
                            markerIcon = L.marker(L.latLng(assetResponse.lat, assetResponse.lon), {icon: baobabIcon}).addTo(map);
                        } else if (assetResponse.asset_type === 'Lemur') {
                            markerIcon = L.marker(L.latLng(assetResponse.lat, assetResponse.lon), {icon: lemurIcon}).addTo(map);
                        } else {
                            markerIcon = L.marker(L.latLng(assetResponse.lat, assetResponse.lon)).addTo(map);
                        }

                        // Add expanded details for if a user clicks on the marker
                        markerIcon.bindPopup(`${assetResponse.asset_type}\n\r${assetResponse.project_name}`);

                        // // Keep a reference to the marker so we can remove it later
                        this.myAssets.push(markerIcon);
                    }
                });
            } 
            
            if (type === 'polygon' || type === 'rectangle') {
                map.addLayer(layer);
                let polyLatLng = e.layer.getLatLngs();
                console.log('The polygon is at ' + polyLatLng);
                
                var body = {
                    coordinates: []
                };
                
                var vertices;
                let polyPoints = polyLatLng[0].length;
                let j;
                for (j = 0; j < polyPoints; j++) {
                    vertices = {latitude: (polyLatLng[0][j]).lat, longitude: (polyLatLng[0][j]).lng};
                    body.coordinates.push(vertices);
                }

                const polyURL  = new URL(POLY_URL);
                console.log('Posting: ' + polyURL.href);

                // Send out the POST request
                this.assetsPromise = utils.post(polyURL.href, body);

                // When the promise is fulfilled handle it
                this.assetsPromise.then(response => {
                    // Response should be an array of assets
                    console.log(response);

                    // Initialize the array if need be
                    if (this.myAssets === undefined) {
                        this.myAssets = [];
                    }

                    // Iterate over the assets and add them to the map
                    let assetIndex;
                    for (assetIndex = 0; assetIndex < response.length; assetIndex++) {
                        const assetResponse = response[assetIndex];

                        // Create the map marker. Add back the offset so markers appear where the user clicked.
                        let markerIcon;
                        if (assetResponse.asset_type === 'Tree') {
                            markerIcon = L.marker(L.latLng(assetResponse.lat, assetResponse.lon), {icon: baobabIcon}).addTo(map);
                        } else if (assetResponse.asset_type === 'Lemur') {
                            markerIcon = L.marker(L.latLng(assetResponse.lat, assetResponse.lon), {icon: lemurIcon}).addTo(map);
                        } else {
                            markerIcon = L.marker(L.latLng(assetResponse.lat, assetResponse.lon)).addTo(map);
                        }

                        // Add expanded details for if a user clicks on the marker
                        markerIcon.bindPopup(`${assetResponse.asset_type}\n\r${assetResponse.project_name}`);

                        // Keep a reference to the marker so we can remove it later
                        this.myAssets.push(markerIcon);
                    }
                });
            } else {
                console.log('They shouldn\'t have been able to get here');
            }
        });
    } 
}
