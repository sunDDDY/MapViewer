// Add transformation on crs  [256x256];

/* global L */

(function (L) {
    if (typeof L === 'undefined') {
        throw new Error('Leaflet must be included first');
    }

    L.CRS.metric = function (options) {
        return L.extend({}, L.CRS.Simple, {
            projection: L.Projection.LonLat,
            transformation: new L.Transformation(options.pixelsPerMeter, 0, options.pixelsPerMeter, 0)
        });
    };
})(L);
