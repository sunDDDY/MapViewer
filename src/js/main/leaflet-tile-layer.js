// Add offset tiles to 1px in map container;

/* global L */

(function (L) {
    if (typeof L === 'undefined') {
        throw new Error('Leaflet must be included first');
    }

    L.TileLayer.Custom = L.TileLayer.extend({
        _initTile: function (tile) {
            L.GridLayer.prototype._initTile.call(this, tile);

            let tileSize = this.getTileSize();

            tile.style.width = `${tileSize.x + 1}px`;
            tile.style.height = `${tileSize.y + 1}px`;
        }
    });

    L.TileLayer.custom = function (urlTemplate, options) {
        return new L.TileLayer.Custom(urlTemplate, options);
    };

})(L);
