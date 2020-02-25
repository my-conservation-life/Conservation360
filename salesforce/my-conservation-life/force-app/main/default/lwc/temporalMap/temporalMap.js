import { LightningElement } from 'lwc';
import utils from 'c/utils';

const HISTORY_URL = utils.URL + 'assets/properties/temporalSearch';

export default class TemporalMap extends LightningElement {
    assetsPromise;
    geoTemporalQueryBody;

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
     * @param {CustomEvent} event
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
            console.log('Posting: ' + historyURL.href);

            this.geoTemporalQueryBody.geometry.coordinates = [mlon, mlat];

            console.log(this.geoTemporalQueryBody);
            this.assetsPromise = utils.post(historyURL.href, this.geoTemporalQueryBody);

            try {
                // When the promise is fulfilled handle it
                this.assetsPromise.then(response => {
                    try {
                        // Response should be an array of assets
                        console.log(response);
                    } catch (error) {
                        console.log(error);
                    }

                    // // Initialize the array if need be
                    // if ( this.myAssets === undefined) {
                    //     this.myAssets = [];
                    // }
    
                    // // Iterate over the assets and add them to the map
                    // let i;
                    // for (i = 0; i < response.length; i++) {
                    //     const a = response[i];
    
                    //     // Create the map marker. Add back the offset so markers appear where the user clicked.
                    //     let m = L.marker(L.latLng(a.lat + (latOff * 90), a.lon + (lonOff * 180))).addTo(map);
    
                    //     // Add expanded details for if a user clicks on the marker
                    //     m.bindPopup(`${a.asset_type}\n\r${a.project_name}`);
    
                    //     // Keep a reference to the marker so we can remove it later
                    //     this.myAssets.push(m);
                    // }
                });
            } catch (error) {
                console.log(error);
            }


        });
    }


}
