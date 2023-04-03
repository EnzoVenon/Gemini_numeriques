// const { GeometryLayer } = require("itowns");

/**
 * A tooltip that can display some useful information about a feature when
 * hovering it.
 *
 * @module FeatureToolTip
 *
 * @example
 * // Initialize the FeatureToolTip
 * FeatureToolTip.init(viewerDiv, view);
 *
 * // Add layers
 * var wfsSource = new itowns.WFSSource(...);
 * var wfsLayer = new itowns.ColorLayer('id_wfs', { source: wfsSource });
 * view.addLayer(wfsLayer);
 *
 * var fileSource = new itowns.FileSource(...);
 * var fileLayer = new itowns.GeometryLayer('id_myFile', new THREE.Group(), { source: fileSource });
 * view.addLayer(fileLayer);
 *
 * FeatureToolTip.addLayer(wfsLayer);
 * FeatureToolTip.addLayer(fileLayer);
 */
var FeatureToolTip = (function _() {
    var tooltip;
    var view;
    var layers = [];
    var layersId = [];

    var mouseevent;

    var mouseDown = 0;
    document.body.addEventListener('mousedown', function _(event) {
        ++mouseDown;
        // console.log('++ mousedown')
        // console.log(mouseDown)
        // console.log(event.target)
    }, false);

    document.body.addEventListener('mouseup', function _(event) {
        if (event.target.id === "") {
            --mouseDown;
            // console.log('-- mouseup')
            // console.log(mouseDown)
        }
        // console.log(event.target.id === '3d-button')
    }, false);

    function moveToolTip(event) {
        tooltip.innerHTML = '';
        tooltip.style.display = 'none';
        // console.log('---------------moveToolTip-------------');
        // console.log(event)
        var features = view.pickFeaturesAt.apply(view, [event, 3].concat(layersId));

        var layer;

        for (var layerId in features) {
            if (features[layerId].length == 0) {
                continue;
            }

            layer = layers[layersId.indexOf(layerId)];
            if (!layer) {
                continue;
            }
            if (typeof layer.options.filterGeometries == 'function') {
                features[layerId] = layer.options.filterGeometries(features[layerId], layer.layer) || [];
            }
            tooltip.innerHTML += fillToolTip(features[layerId], layer.layer, layer.options);
        }

        if (tooltip.innerHTML != '') {
            tooltip.style.display = 'block';
            tooltip.style.left = view.eventToViewCoords(event).x + 'px';
            tooltip.style.top = view.eventToViewCoords(event).y + 'px';
        }

    }

    function getGeometryProperties(geometry) {
        return function properties() {
            return geometry.properties;
        };
    }


    function fillToolTip(features, layer, options) {
        var content = '';

        var feature;
        var geometry;
        var style;

        // var fill;
        // var stroke;
        // var symb = '';

        var prop;
        for (var p = 0; p < features.length; p++) {
            feature = features[p];
            geometry = feature.geometry;

            // console.log(geometry)

            tooltip.value = geometry

            style = (geometry.properties && geometry.properties.style) || feature.style || layer.style;
            var context = { globals: {}, properties: getGeometryProperties(geometry) };
            style = style.drawingStylefromContext(context);

            // if (feature.type === itowns.FEATURE_TYPES.POLYGON) {
            //     symb = '&#9724';
            //     if (style) {
            //         fill = style.fill && style.fill.color;
            //         stroke = style.stroke && ('1.25px ' + style.stroke.color);
            //     }
            // } else if (feature.type === itowns.FEATURE_TYPES.LINE) {
            //     symb = '&#9473';
            //     fill = style && style.stroke && style.stroke.color;
            //     stroke = '0px';
            // } else if (feature.type === itowns.FEATURE_TYPES.POINT) {
            //     // symb = '&#9679';
            //     if (style && style.point) {  // Style and style.point can be undefined if no style options were passed
            //         fill = style.point.color;
            //         stroke = '1.25px ' + style.point.line;
            //     }
            // }



            content += '<div class="tab">'
            content += '<input type="radio" name="css-tabs" id="' + layer.id + '" class="tab-switch" checked>'
            content += '<label for="' + layer.id + '" class="tab-label">'

            if (geometry.properties) {

                content += (geometry.properties.name || geometry.properties.nom || geometry.properties.description || layer.name || layer.id || '');
                content += '</label>';
            }

            if (feature.type === itowns.FEATURE_TYPES.POINT) {
                content += '<br/><span class="coord">long ' + feature.coordinates[0].toFixed(4) + '</span>';
                content += '<br/><span class="coord">lat ' + feature.coordinates[1].toFixed(4) + '</span>';
            }

            if (geometry.properties && !options.filterAllProperties) {
                if (options.format) {
                    for (prop in geometry.properties) {
                        if (!options.filterProperties.includes(prop)) {
                            content += options.format(prop, geometry.properties[prop]) || '';

                        }
                    }
                } else {
                    content += '<div class="tab-content">'
                    content += '<ul>';
                    for (prop in geometry.properties) {
                        if (!options.filterProperties.includes(prop)) {
                            content += '<li>' + prop + ': ' + geometry.properties[prop] + '</li>';
                        }
                    }

                    if (content.endsWith('<ul>')) {
                        content = content.replace('<ul>', '');
                    } else {
                        content += '</ul>';
                        content += '</div>'
                    }
                }
            }

            content += '</div>';
            content += '</div>';
        }


        return content;
    }

    return {
        /**
         * Initialize the `FeatureToolTip` plugin for a specific view.
         *
         * @param {Element} viewerDiv - The element containing the viewer.
         * @param {View} viewer - The view to bind the tooltip to.
         *
         * @example
         * const viewerDiv = document.getElementById('viewerDiv');
         * const view = new GlobeView(viewerDiv, { longitude: 4, latitude: 45, altitude: 3000 });
         *
         * FeatureToolTip.init(viewerDiv, view);
         *
         * @memberof module:FeatureToolTip
         */
        init: function _(viewerDiv, viewer) {
            // HTML element
            tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.id = 'tooltip';

            mouseevent = document.createElement('div');
            mouseevent.className = 'mouseevent';
            mouseevent.id = 'mouseevent';


            viewerDiv.appendChild(tooltip);
            viewerDiv.appendChild(mouseevent);


            // View binding
            view = viewer;

            // Mouse movement listening
            function onMouseMove(event) {
                // console.log('----------------onMouseMove--------------')
                // console.log(event)
                // console.log('mouseDown')
                // console.log(mouseDown)
                // console.log('onmousedown')
                // console.log(onmousedown)
                // console.log(document)
                if (mouseDown) {
                    moveToolTip(event);

                    mouseevent.value = event;


                    tooltip.innerHTML = '<div id="TEST" class="wrapper"><div class="tabs">' + tooltip.innerHTML + '</div></div>';

                    tooltip.addEventListener('mouseover', () => {
                        document.removeEventListener('mousedown', onMouseMove);
                    })
                    tooltip.addEventListener('mouseout', () => {
                        document.addEventListener('mousedown', onMouseMove);
                    })

                    tooltip.addEventListener

                    console.log(tooltip)
                } else {
                    tooltip.style.left = (view.eventToViewCoords(event).x) + 'px';
                    tooltip.style.bottom = (view.eventToViewCoords(event).y) + 'px';
                }
            }

            // document.addEventListener('mousemove', onMouseMove, false);
            // console.log(document)
            document.addEventListener('mousedown', onMouseMove, false);
            // document.addEventListener('mousedown', () => {
            //     console.log('mousedown')

            // }, false);

        },

        /**
         * Add a layer to be picked by the tooltip.
         *
         * @param {Layer} layer - The layer to add.
         * @param {Object} options - Options to have more custom content displayed.
         * @param {function} [options.filterGeometries] - A callback to filter
         * geometries following a criteria, like an id found on FeatureGeometry
         * properties.  This is useful to remove duplicates, for example when a
         * feature is present on multiple tiles at the same time (see the
         * example below).  This function takes two parameters: a list of
         * features (usually a `Array<Feature>`) and the `Layer` associated to
         * these features.
         * @param {function} [options.format] - A function that takes the name
         * of the property currently being processed and its value, and gives
         * the appropriate HTML output to it. If this method is specified, no
         * others properties other than the ones handled in it will be
         * displayed.
         * @param {Array<string>} [options.filterProperties] - An array of
         * properties to filter.
         * @param {boolean} [options.filterAllProperties=true] - Filter all the
         * properties, and don't display anything besides the name of the layer
         * the feature is attached to.
         *
         * @return {Layer} The added layer.
         *
         * @example
         * FeatureToolTip.addLayer(wfsLayer, {
         *      filterProperties: ['uuid', 'notes', 'classification'],
         *      filterGeometries: (features, layer) => {
         *          const idList = [];
         *          return features.filter((f) => {
         *              if (!idList.includes(f.geometry.properties.id)) {
         *                  idList.push(f.geometry.properties.id);
         *                  return f;
         *              }
         *          });
         *      }
         * });
         *
         * @memberof module:FeatureToolTip
         */
        addLayer: function _(layer, options) {
            if (!layer.isLayer) {
                return layer;
            }
            var opts = options || { filterAllProperties: true };
            opts.filterProperties = opts.filterProperties == undefined ? [] : opts.filterProperties;
            opts.filterProperties.concat(['name', 'nom', 'style', 'description']);

            layers.push({ layer: layer, options: opts });
            layersId.push(layer.id);

            return layer;
        },
    };
}());

if (typeof module != 'undefined' && module.exports) {
    module.exports = FeatureToolTip;
}
