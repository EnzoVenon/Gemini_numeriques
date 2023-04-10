export default class Style {
    /**
     * @param {*} view View object from iTowns.
     * @param {*} source Source object from iTowns.
     * @param {String} field The name of the field to apply a style on.
     * @param {Boolean} extrude If true, objects will be in 3D. Otherwise, they will be in 2D. Default is false.
     * @param {Boolean} gradation_or_classes If true, the style will be a gradation, otherwise it will be a classification. Default is true.
     */
    constructor(view, source, field, extrude = false, gradation_or_classes = true) {
        this.view = view;
        this.source = source;
        this.field = field;
        this.extrude = extrude;
        this.gradation_or_classes = gradation_or_classes;
        this.setExtrude(NaN, NaN);
        this.setGradation("rgb(250,0,0)");
        this.setClasses({});
    }

    /**
     * Sets the fields used to extrude the objects.
     * @param {String} field_ground Name of the field corresponding to the ground.
     * @param {String} field_height Name of the field corresponding to the height.
     */
    setExtrude(field_ground, field_height) {
        this.field_ground = field_ground;
        this.field_height = field_height;
        return this;
    }

    /**
     * Sets the color(s) and min and max values to use for gradation.
     * @param {String} color1 Color of the gradation. Must be in rgb format. Example: "rgb(241,0,60)".
     * @param {String} color2 Second color, in case you want for example to go from blue to red. Default value is "".
     * @param {Number} min If you want the white or the second color to be set to a specific min rather than it being detected automatically. Default is NaN (so the min is automatically detected).
     * @param {Number} max If you want your color to be set to a specific max rather than it being detected automatically. Default is NaN (so the max is automatically detected).
     */
    async setGradation(color1, color2 = "", min = NaN, max = NaN) {
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
            const findMin = (properties) => {
                if (!isNaN(properties[this.field])) {
                    if (isNaN(this.min) || (properties[this.field] < this.min)) {
                        this.min = properties[this.field];
                    }
                }
                return true;
            }
            const layer = new itowns.FeatureGeometryLayer("to_delete", {
                batchId: function (property, featureId) { return featureId; },
                filter: findMin,
                source: this.source,
                visible: false
            });
            await this.view.addLayer(layer);
            update(this.view);
            this.view.removeLayer("to_delete");
            layer.delete();
        }

        //Set this.max
        this.max = max;
        //Automatically find and set this.max ?
        if (isNaN(this.max)) {
            //I am using a hack here, as I have not found enough information on iTowns to directly use its parsers and I don't have time to write those myself
            const findMax = (properties) => {
                if (!isNaN(properties[this.field])) {
                    if (isNaN(this.max) || (properties[this.field] < this.max)) {
                        this.max = properties[this.field];
                    }
                }
                return true;
            }
            const layer = new itowns.FeatureGeometryLayer("to_delete", {
                batchId: function (property, featureId) { return featureId; },
                filter: findMax,
                source: this.source,
                visible: false
            });
            await this.view.addLayer(layer);
            update(this.view);
            this.view.removeLayer("to_delete");
            layer.delete();
        }
        return this;
    }

    /**
     * Sets the colors used during the classification.
     * @param {Map<String,String>} map Map having the field different values as keys and colors as values. Colors must be in the rgb format. Example: "rgb(241,0,60)".
     */
    setClasses(map) {
        this.map = map;
        return this;
    }

    /**
     * Add a style itowns layer to the view and returns it.
     * @returns iTowns layer with the style.
     */
    async to_itowns_layer() {
        //As iTowns isn't permitting dynamic modification yet, we delete the layer and we recreate it
        const id = "style_layer";
        this.clean_itowns_layer();

        //Create the coloring function
        let coloring;
        if (this.gradation_or_classes) {
            // One or two colors ?
            if (this.color2 == undefined) {
                coloring = (properties) => {
                    let color = new itowns.THREE.Color();
                    const intensity = 1 - ((properties[this.field] - this.min) / (this.max - this.min));
                    const red = intensity * (255 - this.color1.r) + this.color1.r;
                    const green = intensity * (255 - this.color1.g) + this.color1.g;
                    const blue = intensity * (255 - this.color1.b) + this.color1.b;
                    return color.set("rgb(" + red + "," + green + "," + blue + ")");
                }
            } else {
                coloring = (properties) => {
                    //TODO
                }
            }
        } else {
            coloring = (properties) => {
                let color = new itowns.THREE.Color();
                for (const key of Object.keys(this.classes_map)) {
                    if (properties[this.field] == key) {
                        return color.set(this.classes_map[key]);
                    }
                }
                return color.set("rgb(169,169,169)");
            }
        }

        //Create the layer (3D or 2D)
        let layer;
        if (this.extrude) {
            //Create the functions to place the object on the ground and to extrude it.
            const altitudeFeature = (properties) => {
                return properties[this.field_ground];
            }
            const extrudeFeature = (properties) => {
                return properties[this.field_height];
            }
            const acceptFeature = (properties) => {
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
                        color: coloring,
                        base_altitude: altitudeFeature,
                        extrusion_height: extrudeFeature,
                    }
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
                        color: coloring
                    }
                })
            });
        }

        await this.view.addLayer(layer);
        update(this.view);
        return layer;
    }

    /**
     * Delete the style layer.
     */
    clean_itowns_layer() {
        const id = "style_layer";
        const layer = this.view.getLayerById(id);
        this.view.removeLayer(id);
        layer.delete();
        return this;
    }
}