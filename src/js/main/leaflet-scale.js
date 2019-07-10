// Add new metric to standard behaviour: cm, mm, um, nm, pm;

/* global L */

(function (L) {
    if (typeof L === 'undefined') {
        throw new Error('Leaflet must be included first');
    }

    L.Control.Scale.Custom = L.Control.Scale.extend({
        _updateMetric: function (maxMeters) {
            let meters = maxMeters;
            let label = '';
            if (meters > 1e3) {
                label = this._round(meters / 1e3) + ' km';
            }
            else if (meters > 1) {
                label = this._round(meters) + ' m';
            }
            else if (meters > 1e-2) {
                label = this._round(meters / 1e-2) + ' cm';
            }
            else if (meters > 1e-3) {
                label = this._round(meters / 1e-3) + ' mm';
            }
            else if (meters > 1e-6) {
                label = this._round(meters / 1e-6) + ' um';
            }
            else if (meters > 1e-9) {
                label = this._round(meters / 1e-9) + ' nm';
            }
            else {
                label = this._round(meters / 1e-12) + ' pm';
            }
            this._updateScale(this._mScale, label, 1);
        },
        _round: function (value) {
            return Math.round(value * 100) / 100;
        }
    });

    L.Control.Scale.custom = function (options) {
        return new L.Control.Scale.Custom(options);
    };

})(L);
