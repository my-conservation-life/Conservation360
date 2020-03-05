import { LightningElement } from 'lwc';
import utils from 'c/utils';

const HISTORY_URL = utils.URL + 'assets/properties/temporalSearch';

import leaflet from '@salesforce/resourceUrl/leaflet';


export default class TemporalMap extends LightningElement {
    assetsPromise;
    geoTemporalQueryBody;
    geoLayer;

    /**
     * Starts the download for asset details and bounding box early.
     */
    connectedCallback() {
        // this.assetsPromise = assets.find({ projectId: parseInt(this.projectId, 10) });
        // this.assetsBboxPromise = bboxAssets.get(parseInt(this.projectId, 10));
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
     * @param {CustomEvent} event - A dom event
     * @param {Map} event.details - Leaflet Map of the child component
     */
    onMapInitialized(event) {
        // Get the leaflet map... I have been having a hard time making this a class variable... 
        const map = event.detail;

        // An array of assets
        this.myAssets = [];

        this.geoTemporalQueryBody = {
            'geometry': {
                'type': 'Circle',
                'coordinates' : [-16, 44],
                'radius' : 100000
            },
        };    

        // Set the initial view of the map to Madagascar
        map.fitBounds([
            [-30.06909396443886, 26.102030238912395], 
            [-7.231698708367139, 74.47760116029443]]);

        // Locks the map region to one earth (prevents dragging)
        map.setMaxBounds([[-90,-180],[90,180]]);

        L.Icon.Default.prototype.options.iconUrl = 'baobab-marker-icon.png';

        
        // Implement map "on click" handler
        // If we could keep a reference to the map via a class variable (this.map = event.detail) this would be a lot cleaner
        // to bad this map doesn't wish to cooperate at the time being.
        map.on('click', function(e) {

            // Remove the old radius search indicator so we can start a new query
            if (this.mapCircle !== undefined) {
                map.removeLayer(this.mapCircle);
            }

            // Remove the old markers from the previous query
            if (this.myAssets !== undefined && this.myAssets.length > 0){
                let i;
                for (i = 0; i < this.myAssets.length; i++) {
                    map.removeLayer(this.myAssets[i]);
                }

                // Clear the markers
                this.myAssets = [];
            }

            if (this.geoTemporalQueryBody === undefined)
            {
                this.geoTemporalQueryBody = {
                    'geometry': {
                        'type': 'Circle',
                        'coordinates' : [-16, 44],
                        'radius' : 100000
                    },
                };   
            }

            // Get the coordinates of where the user clicked
            let coord = e.latlng;

            console.log(`Map clicked at lat: ${coord.lat} lon: ${coord.lng}`);

            // If you zoom out far enough the world map will start to repeat accross the screan and leaflet 
            // will return longitudes like 190 degrees for what would technically be -170
            let mlat = (((coord.lat + 90) % 180) - 90);
            let mlon = (((coord.lng + 180) % 360) - 180); 

            // Remember where the user actually clicked so we can put the markers in the correct spot
            let latOff = Math.trunc(coord.lat / 90);
            let lonOff = Math.trunc(coord.lng / 180);

            console.log(`Translates to lat: ${mlat} lat offset: ${latOff} lon: ${mlon} lon offset: ${lonOff}`);

            // radius in meters
            let rad = 100000;

            // Place the radius query indicator on the map
            this.mapCircle = L.circle(coord, {
                color: 'red',
                fillColor: '#f03',
                fillOpacity: 0.5,
                radius: rad
            }).addTo(map);

            
            const historyURL = new URL(HISTORY_URL);
            this.geoTemporalQueryBody.geometry.coordinates = [mlon, mlat];
            this.assetsPromise = utils.post(historyURL.href, this.geoTemporalQueryBody);

            // When the promise is fulfilled handle it
            this.assetsPromise.then(response => {
                console.log(response);

                let geojsonMarkerOptions = {
                    radius: 8,
                    fillColor: '#228B22',
                    color: '#000',
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                };

                let lemurMarkerOptions = {
                    radius: 8,
                    fillColor: '#C2C5CC',
                    color: '#695F4F',
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                };

                if (this.geoLayer !== undefined) {
                    map.removeLayer(this.geoLayer);
                }
                this.geoLayer = L.geoJSON(response, {
                    pointToLayer: function (feature, latlng) {
                        switch (feature.properties.asset_type) {
                        case 'tree':
                        case 'Tree':
                            return L.marker(latlng);
                        case 'lemur':
                        case 'Lemur':
                            return L.circleMarker(latlng, lemurMarkerOptions);
                        default:
                            return L.circleMarker(latlng, geojsonMarkerOptions);
                        }
                        
                    }})
                    .bindPopup(function (layer) {
                        let props = layer.feature.properties;
                        let d = props.date.split('T')[0].split('-');

                        let propRows = '';

                        let p = {};
                        for (let i = 0; i < props.asset_properties.length; i++)
                        {
                            p = props.asset_properties[i];
                            propRows += `<tr>
                                          <td>${p.property}</td>
                                          <td>${p.value}</td>
                                        </tr>`;
                        }

                        let propTable = `<div style="height:100px;overflow:auto;">
                                            <table style="width:100%">
                                                <tr>
                                                    <th>Property</th>
                                                    <th>Value</th>
                                                </tr>
                                                    ${propRows}
                                            </table>
                                        </div>`;


                        return `<p>${props.asset_type}<br />Sponsor: ${props.sponsor_name}<br />Uploaded: ${d[1]}/${d[2]}/${d[0]}</p>${propTable}`;
                    }).addTo(map);
            });

        });
    }
}
