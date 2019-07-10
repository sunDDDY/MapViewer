// [libraries]
import coolSpinner from "./spin";
import to from "await-to-js";
import $ from "jquery";


// [import leaflet, leaflet plugins]
import L from 'leaflet';
import 'leaflet-draw'; // 1.0.2
import 'leaflet-draw-drag';
import 'leaflet-easybutton';

import 'leaflet.control.layers.tree/L.Control.Layers.Tree'; // leaflet plugin tree baseLayer and overlays
import 'leaflet.control.layers.tree/L.Control.Layers.Tree.css';

// [other npm libraries]
import GJV from 'geojson-validation'; // geoJSON validator

// [import src]
import './leaflet-control-layers';
import './leaflet-crs';
import './leaflet-handler';
import './leaflet-scale';
import './leaflet-tile-layer';

import developmentBar from './development-bar';

export default async function showMap(api, imgMapID, loadMap) {
    let spinner = coolSpinner('map');
    // call before any call to Leaflet objects
    L.Control.Layers.addSelectedFeatureGroupTracking();

    let [mapDTOError, mapDTO] = await to(api.getImgMap(imgMapID));
    if (mapDTOError) {
        $(".alert.alarm").show().curVector("Warning! Map not found, please choose another map");
        return;
    }

    mapDTO.ImgLayers = await api.getImgMapsImgLayers(imgMapID);
    mapDTO.VLayers = await api.getImgMapsVLayers(imgMapID);
    mapDTO.Employee = await api.getCurrentEmployee();

    const crs = L.CRS.metric({pixelsPerMeter: mapDTO.Zoom0PixelsPerMeter});


    let map = new L.map('map', {
        attributionControl: false,
        crs: crs,
        zoomControl: false,
        zoomSnap: 0,
        wheelPxPerZoomLevel: 40
    });
    L.Control.Scale.custom({imperial: false}).addTo(map);
    let mapBounds = [[0, 0], [mapDTO.SizeInMeters.Height, mapDTO.SizeInMeters.Width]];

    let baseTree =
        {
            label: 'Raster Layers  &#x1F431;',
            children: []
        };
    let baseLayers = [];
    for (let i = 0; i < mapDTO.ImgLayers.length; i++) {
        let imgLayer = mapDTO.ImgLayers[i];
        let urlTemplate = await api.getTileURLPattern(imgLayer.ID);
        let tileLayer = L.TileLayer.custom(urlTemplate, {
            minZoom: 0,
            maxZoom: mapDTO.MaxZoom + 10,
            maxNativeZoom: imgLayer.MaxZoom,
            minNativeZoom: imgLayer.MinZoom,
            tileSize: imgLayer.TileSize,
            bounds: [[0, 0], [imgLayer.SizeInMeters.Height, imgLayer.SizeInMeters.Width]],
            name: imgLayer.Name
        });
        if (i === 0) {
            map.addLayer(tileLayer);
            tileLayer.on("load", function () {
                spinner.stop(); // disable spinner off
                loadMap.state = true;
            });
        }
        baseLayers[i] = tileLayer;
        baseTree.children.push({label: imgLayer.Name, layer: tileLayer});
    }

    for (let i = 0; i < mapDTO.VLayers.length; i++) {
        mapDTO.VLayers[i].vectors = await api.getVectors(mapDTO.VLayers[i].ID);
    }

    let overlaysTree = {
        label : 'Vector Layers',
        children : [],
        addVLayers : function(vLayers) {
            Object.values(vLayers).map(async vLayer => {
                let overlay = L.geoJSON(vLayer.vectors, {
                    style: function (feature) {
                        let meta = feature.properties.meta;
                        return {
                            color: meta.LineColor,
                            fillColor: meta.FillColor,
                            fillOpacity: 1
                        };
                    },
                    onEachFeature: function (feature, layer) {
                        let setTextIcon = function (layer, meta) {
                            if (meta.Type === 'Text') {
                                let fontSize = map.project([0, meta.FontSizeInMeters], map.getZoom()).x;
                                let div = document.createElement("div");
                                div.style['color'] = meta.LineColor;
                                div.style['white-space'] = 'nowrap';
                                div.style['font-weight'] = 'normal';
                                div.style['width'] = '0px';  // for correct rotation
                                div.style['height'] = '0px'; // for correct rotation
                                div.style['font-size'] = `${fontSize}px`;
                                div.style['transform'] = `rotate(${meta.Rotation}deg)`;
                                div.appendChild(document.createTextNode(meta.Name));
                                let icon = L.divIcon({
                                    html: div.outerHTML,
                                    className: 'dummy'
                                });
                                layer.setIcon(icon);
                            }
                        };
                        let meta = feature.properties.meta;
                        let content = document.createElement("textarea");
                        content.value = meta.Name;
                        content.addEventListener("keyup", async () => {
                            meta.Name = content.value;
                            await api.patchVectors(feature);
                            setTextIcon(layer, meta);
                        });
                        layer.bindPopup(content, { autoClose: false });
                        map.on('zoomend', () => setTextIcon(layer, meta));
                        layer.on('add', () => setTextIcon(layer, meta));
                    }
                });
                overlay.VLayer = vLayer;
                this.children.push({label: vLayer.Name, layer: overlay});
            });
        }
    };
    overlaysTree.addVLayers(mapDTO.VLayers);

    $('#createVLayer').click(async () => {  // add new VLayer
        let vLayer = await api.postImgMapsVLayers(imgMapID, 'Truly PATH3');
        overlaysTree.addVLayers([vLayer]);
        controlLayer.setOverlayTree(overlaysTree);
    });

    const showVLayerInfoButton = L.easyButton({
        states: [{
            stateName: 'default',
            icon: 'fa-eye',
            title: 'Show all info',
            onClick: function () {   // unused arguments btn, map
                let featureGroup = controlLayer.getSelectedFeatureGroup();
                featureGroup.eachLayer((layer) => {
                    if (layer.feature.properties.meta.Name) {
                        layer.openPopup();
                    }
                });
            }
        }]
    });

    const hideVLayerInfoButton = L.easyButton({
        states: [{
            stateName: 'default',
            icon: 'fa-eye-slash',
            title: 'Hide all info',
            onClick: function () {  // unused arguments btn, map
                let featureGroup = controlLayer.getSelectedFeatureGroup();
                featureGroup.eachLayer((layer) => {
                    if (layer.feature.properties.meta.Name) {
                        layer.closePopup();
                    }
                });
            }
        }]
    });

    let drawControl;
    let controlLayer = L.control.layers.tree(baseTree, overlaysTree,
        {
            collapsed: false,
            onSelectedFeatureGroupChanged: (featureGroup) => {
                if (drawControl) {
                    drawControl.remove();
                    showVLayerInfoButton.remove();
                    hideVLayerInfoButton.remove();
                }
                if (featureGroup) {
                    showVLayerInfoButton.addTo(map);
                    hideVLayerInfoButton.addTo(map);

                    drawControl = new L.Control.Draw({
                        position: 'topleft',
                        draw: { // // draw options
                            polyline: {
                                shapeOptions: {
                                    color: '#9966ff'
                                }
                            },
                            marker: {},
                            rectangle: {
                                shapeOptions: {
                                    color: '#9966ff'
                                }
                            },
                            polygon: {
                                allowIntersection: false,
                                showArea: true,
                                drawError: {
                                    color: '#b00b00',
                                    timeout: 1000
                                },
                                shapeOptions: {
                                    color: '#9966ff'
                                }
                            },

                            circle: false,
                            circlemarker: false
                        },
                        edit: { // edit options
                            featureGroup: featureGroup,
                            edit: {
                                selectedPathOptions: {
                                    maintainColor: true
                                }
                            },
                            poly: {
                                allowIntersection: false
                            },
                            marker: {}
                        }
                    });
                    map.addControl(drawControl);
                }
            }
        }).addTo(map);

    map.on('draw:created', async function (e) {
        let layer = e.layer;
        let featureGroup = controlLayer.getSelectedFeatureGroup();

        let feature =
            {
                type: "Feature",
                geometry: layer.toGeoJSON().geometry,
                properties: {
                    meta: {
                        LineColor: "rgba(153, 102, 255, 1)",
                        FillColor: "rgba(255, 255, 255, 0.3)",
                        Type: layer.toGeoJSON().geometry.type
                    }
                }
            };
        let vector = await api.postVectors(featureGroup.VLayer.ID, feature);
        GJV.isFeature(vector, async function (valid, errs) {
            //log the errors
            if (!valid) {
                alert('[user no have same permissions]' + errs);
            }
            if (valid) {
                featureGroup.addData(vector);
            }
        });
    });
    map.on('draw:edited', async function (e) {
        let layers = e.layers;

        layers.eachLayer(async function (layer) {
            let geoJSON = layer.toGeoJSON();
            await api.patchVectors(geoJSON);
        });
    });
    map.on('draw:deleted', async function (e) {
        let layers = e.layers;
        layers.eachLayer(async function (layer) {
            let geoJSON = layer.toGeoJSON().id;
            await api.deleteVectors(geoJSON);
        });
    });

    await developmentBar(api, mapDTO, map);
    map.fitBounds(mapBounds);
    L.Map.ScrollWheelZoom.useCustom(map, baseLayers);
    $('#buttonNormalZoom').on('click', () => map.fitBounds(mapBounds));
}
