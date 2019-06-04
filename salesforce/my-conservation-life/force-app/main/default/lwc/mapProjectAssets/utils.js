/* L is the Leaflet object constructed by the leaflet.js script */
/*global L*/

/**
 * Returns a Leaflet marker at the location of the asset
 * 
 * precondition: L is an initialized leaflet object
 */
export const markerFromAsset = (asset) => L.marker(L.latLng(asset.latitude, asset.longitude));