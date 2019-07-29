import { LightningElement, api } from 'lwc';

// import { assets, bboxAssets } from 'c/controllers';
import { assets, bboxAssets } from 'c/controllers';
import { markerFromAsset } from './utils';

/* L is the Leaflet object constructed by the leaflet.js script */
/*global L*/

export default class MapProjectAssets extends LightningElement {
    @api
    projectId;

    assetsPromise;
    assetsBboxPromise;

    /**
     * Starts the download for asset details and bounding box early.
     */
    connectedCallback() {
        this.assetsPromise = assets.find({ projectId: parseInt(this.projectId, 10) });
        this.assetsBboxPromise = bboxAssets.get(parseInt(this.projectId, 10));
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

        this.assetsPromise.then((assetArray) => {
            L.featureGroup(assetArray.map(markerFromAsset)).addTo(map);
        });
    }
}