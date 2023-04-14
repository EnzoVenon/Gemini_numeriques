export default class Style {
    //Static variable solving a display issue of iTowns
    static #id_counter = 0;
    static #id_counter2 = 0;

    /**
     * @param {String} name Name of your style.
     * @param {*} view View object from iTowns.
     * @param {*} source Source object from iTowns.
     * @param {String} field The name of the field to apply a style on.
     * @param {Boolean} extrude If true, objects will be in 3D. Otherwise, they will be in 2D. Default is false.
     * @param {Boolean} gradation_or_classes If true, the style will be a gradation, otherwise it will be a classification. Default is true.
     */
    constructor(name, view, source, field, extrude = false, gradation_or_classes = true) {
        this.name = name;
        this.view = view;
        this.source = source;
        this.field = field;
        this.extrude = extrude;
        this.gradation_or_classes = gradation_or_classes;
        this.setExtrude();
        this.setGradation("rgb(255,0,0)", "", 0, 0);
        this.setClasses({});
        return this;
    }

    /**
     * Sets the fields used to extrude the objects.
     * @param {String} field_ground Name of the field corresponding to the ground.
     * @param {String} field_height Name of the field corresponding to the height.
     */
    setExtrude(field_ground = "", field_height = "") {
        this.field_ground = field_ground;
        this.field_height = field_height;
        return this;
    }

    /**
     * 
     * @param {Boolean} extrude Whether to set the style to 3D or not.
     * @returns 
     */
    to3D(extrude) {
        this.extrude = extrude;
        return this;
    }

    /**
     * Sets the color(s) and min and max values to use for gradation.
     * @param {String} color1 Color of the gradation. Must be in rgb format. Example: "rgb(241,0,60)".
     * @param {String} color2 Second color, in case you want for example to go from blue to red. Default value is "".
     * @param {Number} min Optional. If you want the white or the second color to be set to a specific min rather than it being detected automatically.
     * @param {Number} max Optional. If you want your color to be set to a specific max rather than it being detected automatically.
     */
    setGradation(color1, color2 = "", min = this.min, max = this.max) {
        //Set this.color1
        color1 = color1.replace(" ", "").slice(4, -1).split(",");
        this.color1 = { "r": +color1[0], "g": +color1[1], "b": +color1[2] };

        //Set this.color2
        if (color2 != "") {
            color2 = color2.replace(" ", "").slice(4, -1).split(",");
            this.color2 = { "r": +color2[0], "g": +color2[1], "b": +color2[2] };
        }

        //Set this.min
        this.min = min;
        //Automatically find and set this.min ?
        if (isNaN(this.min)) {
            //I am using a hack here, as I have not found enough information on iTowns to directly use its parsers and I don't have time to write those myself
            function hackMin(properties) {
                if ((properties.hasOwnProperty(this.field)) && (!isNaN(properties[this.field]))) {
                    if (isNaN(this.min) || (properties[this.field] < this.min)) {
                        this.min = properties[this.field];
                    }
                }
                return true;
            }
            const findMin = hackMin.bind(this);
            Style.#id_counter2 += 1;
            const layer = new itowns.FeatureGeometryLayer("to_delete_min_style" + Style.#id_counter2, {
                batchId: function (property, featureId) { return featureId; },
                filter: findMin,
                source: this.source,
                visible: false
            });
            this.view.addLayer(layer);
            this.view.notifyChange(this.view.camera.camera3D, true);
            this.view.removeLayer("to_delete_min_style" + Style.#id_counter2);
            layer.delete();
        }

        //Set this.max
        this.max = max;
        //Automatically find and set this.max ?
        if (isNaN(this.max)) {
            //I am using a hack here, as I have not found enough information on iTowns to directly use its parsers and I don't have time to write those myself
            function hackMax(properties) {
                if ((properties.hasOwnProperty(this.field)) && (!isNaN(properties[this.field]))) {
                    if (isNaN(this.max) || (properties[this.field] > this.max)) {
                        this.max = properties[this.field];
                    }
                }
                return true;
            }
            const findMax = hackMax.bind(this);
            Style.#id_counter2 += 1;
            const layer = new itowns.FeatureGeometryLayer("to_delete_max_style" + Style.#id_counter2, {
                batchId: function (property, featureId) { return featureId; },
                filter: findMax,
                source: this.source,
                visible: false
            });
            this.view.addLayer(layer);
            this.view.notifyChange(this.view.camera.camera3D, true);
            this.view.removeLayer("to_delete_max_style" + Style.#id_counter2);
            layer.delete();
        }
        return this;
    }

    /**
     * Sets the colors used during the classification.
     * @param {Map<String,String>} map Map having the field different values as keys and colors as values. Colors must be in the rgb format. Example: "rgb(241,0,60)".
     */
    setClasses(map) {
        this.classes_map = map;
        return this;
    }

    /**
     * Add a style itowns layer to the view and returns it.
     * @returns iTowns layer with the style.
     */
    to_itowns_layer() {
        //As iTowns isn't permitting dynamic modification yet, we delete the layer and we recreate it
        this.clean(Style.#id_counter);

        //Create the coloring function
        let coloring;
        if (this.gradation_or_classes) {
            // One or two colors ?
            if (!this.color2) {
                console.log("Affichage de style de dégradé 1 couleur");
                coloring = function f(properties) {
                    if (properties.hasOwnProperty(this.field)) {
                        const intensity = 1 - ((properties[this.field] - this.min) / (this.max - this.min));
                        let rgb = [];
                        rgb.push(Math.floor(intensity * (255 - this.color1.r) + this.color1.r));
                        rgb.push(Math.floor(intensity * (255 - this.color1.g) + this.color1.g));
                        rgb.push(Math.floor(intensity * (255 - this.color1.b) + this.color1.b));
                        for (let i = 0; i < 3; i++) {
                            if (rgb[i] < 0) {
                                rgb[i] = 0;
                            } else if (rgb[i] > 255) {
                                rgb[i] = 255;
                            }
                        }
                        return "rgb(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + ")";
                    } else {
                        return "rgb(169,169,169)";
                    }
                }
            } else {
                console.log("Affichage de style de dégradé 2 couleurs");
                coloring = function f(properties) {
                    //TODO
                    return properties;
                }
            }
        } else {
            //If the map associating classes and colors is empty, we classify automatically
            if (Object.keys(this.classes_map).length == 0) {
                console.log("Affichage de style de classif auto");
                coloring = function f(properties) {
                    if (properties.hasOwnProperty(this.field)) {
                        if (!this.classes_map.hasOwnProperty(properties[this.field])) {
                            this.classes_map[properties[this.field]] = "rgb(" + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + ")";
                        }
                        return this.classes_map[properties[this.field]];
                    }
                    return "rgb(169,169,169)";
                }
            } else {
                console.log("Affichage de style de classif");
                coloring = function f(properties) {
                    if (properties.hasOwnProperty(this.field) && this.classes_map.hasOwnProperty(properties[this.field])) {
                        return this.classes_map[properties[this.field]];
                    }
                    return "rgb(169,169,169)";
                }
            }
        }
        const drawing = coloring.bind(this);

        //Create the layer (3D or 2D)
        Style.#id_counter += 1;
        const id = "style_layer_" + Style.#id_counter;
        let layer;
        if (this.extrude) {
            //Create the functions to place the object on the ground and to extrude it.
            function alti(properties) {
                return properties[this.field_ground];
            }
            const altitudeFeature = alti.bind(this);
            function extr(properties) {
                return properties[this.field_height];
            }
            const extrudeFeature = extr.bind(this);
            function acceptFeature(properties) {
                return !!properties.hauteur;
            }

            // Create the style layer
            layer = new itowns.FeatureGeometryLayer(id, {
                batchId: function (property, featureId) { return featureId; },
                filter: acceptFeature,
                source: this.source,
                zoom: { min: 14 },

                style: new itowns.Style({
                    fill: {
                        color: drawing,
                        base_altitude: altitudeFeature,
                        extrusion_height: extrudeFeature,
                    },
                    stroke: { color: "black" }
                })
            });
        } else {
            // Create the style layer
            layer = new itowns.ColorLayer(id, {
                batchId: function (property, featureId) { return featureId; },
                source: this.source,
                zoom: { min: 14 },
                style: new itowns.Style({
                    fill: {
                        color: drawing
                    },
                    stroke: { color: "black" }
                })
            });
        }

        this.view.addLayer(layer);
        this.view.notifyChange(this.view.camera.camera3D, true);
        return layer;
    }

    /**
     * Delete the style layer.
     */
    clean(id_counter) {
        for (let i = 0; i <= id_counter; i++) {
            const id = "style_layer_" + i;
            try {
                const layer = this.view.getLayerById(id);
                this.view.removeLayer(id);
                layer.delete();
            } catch (error) {
            }
        }
        return this;
    }
}