/* L is the Leaflet object constructed by the leaflet.js script */
/*global L*/

/**
 * Returns a Leaflet marker at the location of the asset
 * 
 * @param {Object} asset - a MyConservationLife asset
 * @param {number} asset.latitude - Latitude of the asset
 * @param {number} asset.longitude - Longitude of the asset
 * 
 * @returns {L.Marker} a Leaflet marker for the location of the given asset
 */
export const markerFromAsset = (asset) => L.marker(L.latLng(asset.latitude, asset.longitude));