// Check selected vector layers. If user have one selected vector-layer add draw-toll-bar to this layer;

/* global L */

(function (L) {
    if (typeof L === 'undefined') {
        throw new Error('Leaflet must be included first');
    }

    L.Control.Layers.addSelectedFeatureGroupTracking = function () {
        L.Control.Layers.include({
            _selectedFeatureGroup: null,
            _onInputClick: function () {
                var inputs = this._layerControlInputs,
                    input, layer;
                var addedLayers = [],
                    removedLayers = [];
                var featureGroupsSelected = 0;

                this._selectedFeatureGroup = null;
                this._handlingClick = true;

                for (var i = inputs.length - 1; i >= 0; i--) {
                    input = inputs[i];
                    layer = this._getLayer(input.layerId).layer;

                    if (input.checked) {
                        if (layer instanceof L.FeatureGroup) {
                            if (++featureGroupsSelected === 1) {
                                this._selectedFeatureGroup = layer;
                            }
                            else {
                                this._selectedFeatureGroup = null;
                            }
                        }
                        addedLayers.push(layer);

                    } else if (!input.checked) {
                        removedLayers.push(layer);
                    }
                }

                this._onSelectedFeatureGroupChanged();

                // Bugfix issue 2318: Should remove all old layers before readding new ones
                for (i = 0; i < removedLayers.length; i++) {
                    if (this._map.hasLayer(removedLayers[i])) {
                        this._map.removeLayer(removedLayers[i]);
                    }
                }
                for (i = 0; i < addedLayers.length; i++) {
                    if (!this._map.hasLayer(addedLayers[i])) {
                        this._map.addLayer(addedLayers[i]);
                    }
                }

                this._handlingClick = false;

                this._refocusOnMap();
            },
            _onSelectedFeatureGroupChanged: function () { // write non leaflet
                if (this.options.onSelectedFeatureGroupChanged) {
                    this.options.onSelectedFeatureGroupChanged(this._selectedFeatureGroup);
                }
            },
            getSelectedFeatureGroup: function () {
                return this._selectedFeatureGroup;
            }
        });
    };
})(L);

