export default class Style {
    //Static variable solving a display issue of iTowns
    static #id_counter = 0;
    static #id_counter2 = 0;
    #extrude;

    /**
     * Style object. Dealing with one itowns layer. Can apply a gradation or a classification.
     * @param {String} name Name of your style.
     * @param {*} view View object from iTowns.
     * @param {*} source Source object from iTowns.
     * @param {String} field The name of the field to apply a style on.
     * @param {Boolean} gradation_or_classes If true, the style will be a gradation, otherwise it will be a classification. Default is classification (false).
     */
    constructor(name, view, source, field, gradation_or_classes = false) {
        this.name = name;
        this.view = view;
        this.source = source;
        this.field = field;
        this.gradation_or_classes = gradation_or_classes;
        this.#extrude = false;
        if (gradation_or_classes) {
            this.setGradation("rgb(255,0,0)", "", NaN, NaN);
        } else {
            this.setClasses({});
        }
        return this;
    }



    /**
     * Sets the fields used to extrude the objects.
     * @param {String} field_ground Name of the field corresponding to the ground.
     * @param {String} field_height Name of the field corresponding to the height.
     */
    setExtrude(field_ground, field_height) {
        this.field_ground = field_ground;
        this.field_height = field_height;
        this.#extrude = true;
        return this;
    }



    /**
     * Sets the style to 3D or 2D. The setExtrude method must have been called to set the extruding fields.
     * @param {Boolean} extrude Whether to set the style to 3D or not.
     */
    to3D(extrude) {
        if (this.field_ground === undefined || this.field_height === undefined) {
            this.#extrude = false;
            return this;
        }
        this.#extrude = extrude;
        return this;
    }



    /**
     * Sets the color(s) and min and max values to use for gradation.
     * @param {String} color1 Color of the gradation. Must be in rgb format. Example: "rgb(241,0,60)".
     * @param {String} color2 Optional. Second color, in case you want to go from blue to red, for example. Default value is "".
     * @param {Number} min Optional. If you want the white or the second color to be set to a specific min rather than it being detected automatically. Default value is this.min.
     * @param {Number} max Optional. If you want your color to be set to a specific max rather than it being detected automatically. Default value is this.max.
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

        //Set this.min and this.max
        this.min = min;
        this.max = max;
        return this;
    }



    /**
     * Sets the colors used during the classification. 
     * @param {JSON} map Optional. JSON having the field different values as keys and colors as values (example: "rgb(0,1,2)"). If unset, classification is automated. If a field value is not in keys, its color will be set to the one of the key "no-data-color". Example: myStyle.setClasses({"Résidentiel": "rgb(255,0,0)", "Commercial": "rgb(0,0,255)", "no-data-color": "rgb(0,255,0)"}).
     */
    setClasses(map = {}) {
        this.classes_map = map;
        if (this.classes_map["no-data-color"] === undefined) {
            this.classes_map["no-data-color"] = "rgb(169,169,169)";
        }
        return this;
    }



    /**
     * Finds automatically the min and max values of this.field and returns the promess that end when it is done.
     * @returns Promess which end when min and max are set.
     */
    async autoMinMax() {
        const min = this.min;
        const max = this.max;
        if (isNaN(min) || isNaN(max)) {
            //I am using a hack here, as we can't access iTowns source field value in our version and I don't have time to write those myself
            let hackMinMax = function f(properties) {
                if ((properties[this.field] !== undefined) && (!isNaN(properties[this.field]))) {
                    if (isNaN(this.min) || (properties[this.field] < this.min)) {
                        this.min = properties[this.field];
                    }
                    if (isNaN(this.max) || (properties[this.field] > this.max)) {
                        this.max = properties[this.field];
                    }
                }
                return true;
            }
            const findMinMax = hackMinMax.bind(this);
            Style.#id_counter2 += 1;
            const id = Style.#id_counter2;
            const layer = new itowns.FeatureGeometryLayer("to_delete_minmax_style" + id, {
                batchId: function (property, featureId) { return featureId; },
                filter: findMinMax,
                source: this.source,
                visible: false
            });
            return this.view.addLayer(layer).then(() => {
                //Here, this min and this.max were automatically set, we deal with the case where one of the two was NaN but not the other.
                if (!isNaN(min)) {
                    this.min = min;
                }
                if (!isNaN(max)) {
                    this.max = max;
                }
                this.view.removeLayer("to_delete_minmax_style" + id);
                layer.delete();
            });
        } else {
            return Promise.resolve();
        }
    }



    /**
     * Finds automatically the classes contained in this.field if the user wants automated classification and returns the promess that end when it is done.
     * @returns Promess which end when classes are well set.
     */
    async autoClass() {
        if (Object.keys(this.classes_map).length == 1) {
            //I am using a hack here, as we can't access iTowns source field value in our version and I don't have time to write those myself
            let hackClass = function f(properties) {
                if ((properties[this.field] !== undefined) && (this.classes_map[properties[this.field]] === undefined)) {
                    this.classes_map[properties[this.field]] = "rgb(" + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + ")";
                }
                return true;
            }
            const findClass = hackClass.bind(this);
            Style.#id_counter2 += 1;
            const id = Style.#id_counter2;
            const layer = new itowns.FeatureGeometryLayer("to_delete_class_style" + id, {
                batchId: function (property, featureId) { return featureId; },
                filter: findClass,
                source: this.source,
                visible: false
            });
            return this.view.addLayer(layer).then(() => {
                this.view.removeLayer("to_delete_class_style" + id);
                layer.delete();
            });
        } else {
            return Promise.resolve();
        }
    }



    /**
     * Apply the style. Removes the previous style itowns layer (if existing) and adds this one to the view and returns it.
     * @returns iTowns layer with the style.
     */
    async to_itowns_layer() {
        //As iTowns isn't permitting dynamic modification yet, we delete the layer and we recreate it
        this.clean();

        //Create the coloring function
        let coloring;
        if (this.gradation_or_classes) {
            //Here, we deal with the gradation
            //Check if min and max are set before creating color, otherwise we automatically find and set this.min and this.max
            if (isNaN(this.min) || isNaN(this.max)) {
                await this.autoMinMax();
            }
            if (!this.color2) {
                //Here, the gradation has only one color
                coloring = function f(properties) {
                    if (properties[this.field] !== undefined) {
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
                //Here, the gradation has two colors
                coloring = function f(properties) {
                    if (properties[this.field] !== undefined) {
                        const mid = (this.max + this.min) / 2;
                        let intensity;
                        let tcolor;
                        if (properties[this.field] < mid) {
                            intensity = (properties[this.field] - this.min) / (mid - this.min);
                            tcolor = this.color2;
                        } else {
                            intensity = 1 - ((properties[this.field] - mid) / (this.max - mid));
                            tcolor = this.color1;
                        }
                        let rgb = [];
                        rgb.push(Math.floor(intensity * (255 - tcolor.r) + tcolor.r));
                        rgb.push(Math.floor(intensity * (255 - tcolor.g) + tcolor.g));
                        rgb.push(Math.floor(intensity * (255 - tcolor.b) + tcolor.b));
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
            }
        } else {
            //Here we deal with the classification
            if (Object.keys(this.classes_map).length == 1) {
                //Here, the map associating classes and colors only contains the "no-data-color" key, so we classify automatically.
                await this.autoClass();
            }
            //Here, we classify according to the classes_map given. Unregistered classes are set to grey.
            coloring = function f(properties) {
                if ((properties[this.field] !== undefined) && (this.classes_map[properties[this.field]] !== undefined)) {
                    return this.classes_map[properties[this.field]];
                }
                return this.classes_map["no-data-color"];
            }
        }
        const drawing = coloring.bind(this);

        //Create the layer (3D or 2D)
        Style.#id_counter += 1;
        const id = "style_layer_" + Style.#id_counter;
        let layer;
        if (this.#extrude) {
            //Here, we create a 3D style layer, a FeatureGeometryLayer
            //Create the functions to place the object on the ground and to extrude it.
            const altitudeFeature = (properties) => {
                return properties[this.field_ground];
            }
            const extrudeFeature = (properties) => {
                return properties[this.field_height];
            }
            const acceptFeature = (properties) => {
                return !!properties[this.field_height] && !!properties[this.field_ground];
            }

            //Create the style layer
            layer = new itowns.FeatureGeometryLayer(id, {
                batchId: function (property, featureId) { return featureId; },
                filter: acceptFeature,
                source: this.source,
                zoom: { min: 0, max: 12 },
                style: new itowns.Style({
                    fill: {
                        color: drawing,
                        extrusion_height: extrudeFeature,
                        base_altitude: altitudeFeature
                    }
                }),
                onMeshCreated: (mesh) => {
                    let object = mesh.children[0].children[0].children[0].children[0];
                    let objectEdges = new itowns.THREE.LineSegments(
                        new itowns.THREE.EdgesGeometry(object.geometry),
                        new itowns.THREE.LineBasicMaterial({ color: 'black' })
                    );
                    object.add(objectEdges);
                }
            });
        } else {
            //Here, we create the 2D style layer, a ColorLayer
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

        this.view.addLayer(layer).then(() => {
            this.view.notifyChange(this.view.camera.camera3D, true);
        });
        return layer;
    }



    /**
     * Delete the style layer.
     */
    clean() {
        const id = "style_layer_" + Style.#id_counter;
        try {
            const layer = this.view.getLayerById(id);
            this.view.removeLayer(id);
            layer.delete();
        } catch (error) {
            //I know, ESLint, this is empty
        }
        return this;
    }



    /**
     * Returns the legend div which can be appended on an html element in the document.
     * @returns Legend div.
     */
    getLegend() {
        let res = document.createElement("div");
        res.appendChild(document.createElement("h5")).innerText = this.name;
        if (this.gradation_or_classes) {
            let canvas = document.createElement("canvas");
            let ctx = canvas.getContext("2d");
            console.log(canvas.height);
            canvas.height = 120;

            //Create gradient
            const grad_height = 80;
            ctx.fillStyle = "rgb(0,0,0)";
            ctx.fillRect(0, 0, 300, grad_height + 2);
            let gradient = ctx.createLinearGradient(20, 0, 280, 0);
            if (this.color2 === undefined) {
                gradient.addColorStop(0, "rgb(255,255,255)");
            } else {
                gradient.addColorStop(0, "rgb(" + this.color2.r + "," + this.color2.g + "," + this.color2.b + ")");
                gradient.addColorStop(0.5, "rgb(255,255,255)");
            }
            gradient.addColorStop(1, "rgb(" + this.color1.r + "," + this.color1.g + "," + this.color1.b + ")");
            ctx.fillStyle = gradient;
            ctx.fillRect(1, 1, 298, grad_height);

            //Create small arrows
            ctx.fillStyle = "rgb(0,0,0)";
            ctx.font = "18px Arial";
            ctx.fillText("I", 0, grad_height + 17);
            ctx.fillText("I", 296, grad_height + 17);

            //Create min and max text
            const max = "" + this.max;
            ctx.font = "bold 18px Arial";
            ctx.fillText("" + this.min, 0, grad_height + 35);
            ctx.fillText(max, canvas.width - max.length * 10, grad_height + 35);

            res.appendChild(canvas);
        } else {
            let inner = "";
            for (let key of Object.keys(this.classes_map)) {
                inner += '<p><span style="color:' + this.classes_map[key] + ';font-size: 2em">■</span> ' + key + '</p>';
            }
            res.innerHTML += inner;
        }
        return res;
    }



    /**
     * Returns the configuration json of this style, as it can be used by the load method.
     * @returns Json of configuration.
     */
    to_config_json() {
        let config_json = {};
        config_json["name"] = this.name;
        config_json["field"] = this.field;
        config_json["extrude"] = this.#extrude;
        if ((this.field_ground !== undefined) && (this.field_height !== undefined)) {
            config_json["field_ground"] = this.field_ground;
            config_json["field_height"] = this.field_height;
        }
        config_json["gradation_or_classes"] = this.gradation_or_classes;
        if (this.gradation_or_classes) {
            config_json["color1"] = this.color1;
            if (this.color2 !== undefined) {
                config_json["color2"] = this.color2;
            }
            config_json["min"] = this.min;
            config_json["max"] = this.max;
        } else {
            config_json["classes_map"] = this.classes_map;
        }
        if (this.source.isFileSource) {
            config_json["source_info"] = {
                "type": "FileSource",
                "fetchedData": this.source.fetchedData,
                "crs": this.source.crs,
                "format": this.source.format
            };
        } //TODO else if to add other source types
        return config_json;
    }



    /**
     * Creates a style object from a configuration json.
     * @param {*} view View object from iTowns.
     * @param {*} source Source object from iTowns.
     * @param {JSON} config_json Json containing the configuration of style, as it is returned by the to_config_json method.
     * @returns The style object created.
     */
    static load(view, config_json) {
        let source;
        if (config_json.source_info.type == "FileSource") {
            source = new itowns.FileSource({
                fetchedData: config_json.source_info.fetchedData,
                crs: config_json.source_info.crs,
                format: config_json.source_info.format
            });
        } //TODO else if to add other source types
        let style_res = new Style(config_json.name, view, source, config_json.field, config_json.gradation_or_classes);
        if ((config_json.field_ground !== undefined) && (config_json.field_height !== undefined)) {
            style_res.setExtrude(config_json.field_ground, config_json.field_height);
        }
        if (config_json.gradation_or_classes) {
            if (config_json.color2 === undefined) {
                style_res.setGradation(config_json.color1, "", config_json.min, config_json.max);
            } else {
                style_res.setGradation(config_json.color1, config_json.color2, config_json.min, config_json.max);
            }
        } else {
            style_res.setClasses(config_json.classes_map);
        }
        return style_res;
    }
}