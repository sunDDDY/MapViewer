// Change current base layer if user press combination [ctrl + mouseWheelZoom];

/* global L */

(function (L) {
    if (typeof L === 'undefined') {
        throw new Error('Leaflet must be included first');
    }

    L.Map.ScrollWheelZoom.custom = function (baseLayers) {
        return L.Map.ScrollWheelZoom.extend({
            addHooks: function () {
                this._map.on('baselayerchange', this._onMapBaseLayerChanged, this);
                L.Map.ScrollWheelZoom.prototype.addHooks.call(this);
            },
            removeHooks: function () {
                this._map.off('baselayerchange', this._onMapBaseLayerChanged, this);
                L.Map.ScrollWheelZoom.prototype.removeHooks.call(this);
            },
            _baseLayersValues: baseLayers,
            _baseLayerSelectedIndex: 0,
            _onMapBaseLayerChanged: function (e) {
                this._baseLayerSelectedIndex = this._baseLayersValues.indexOf(e.layer);
            },
            _onWheelScroll: function (e) {
                if (e.ctrlKey) {
                    let delta = L.DomEvent.getWheelDelta(e);
                    if (delta > 0 && this._baseLayerSelectedIndex > 0) {
                        this._map.removeLayer(this._baseLayersValues[this._baseLayerSelectedIndex--]);
                        this._map.addLayer(this._baseLayersValues[this._baseLayerSelectedIndex]);
                    }
                    else if (delta < 0 && this._baseLayerSelectedIndex < this._baseLayersValues.length - 1) {
                        this._map.removeLayer(this._baseLayersValues[this._baseLayerSelectedIndex++]);
                        this._map.addLayer(this._baseLayersValues[this._baseLayerSelectedIndex]);
                    }
                    L.DomEvent.stop(e);
                }
                else {
                    L.Map.ScrollWheelZoom.prototype._onWheelScroll.call(this, e);
                }
            }
        });
    };
    L.Map.ScrollWheelZoom.useCustom = function (map, baseLayers) {
        map.scrollWheelZoom.disable();
        map.addHandler('scrollWheelZoom', L.Map.ScrollWheelZoom.custom(baseLayers));
        map.scrollWheelZoom.enable();
    };
})(L);
