export default class Style {
    /**
     * @param {String} field The name of the field to apply a style on.
     * @param {Boolean} extrude If true, objects will be in 3D. Otherwise, they will be in 2D. Default is false.
     * @param {Boolean} gradation_or_classes If true, the style will be a gradation, otherwise it will be a classification. Default is true.
     */
    constructor(field, extrude = false, gradation_or_classes = true) {
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
    }

    /**
     * Sets the color(s) and min and max values to use for gradation.
     * @param {String} color1 Color of the gradation.
     * @param {String} color2 Second color, in case you want for example to go from blue to red. Default value is "".
     * @param {Boolean} auto_min_max Whether to automatically detect the min and the max of the field. Default is true.
     * @param {Number} min If you want the white or the second color to be set to a specific min rather than it being detected automatically. Default is NaN (so the min is automatically detected).
     * @param {Number} max If you want your color to be set to a specific max rather than it being detected automatically. Default is NaN (so the max is automatically detected).
     */
    setGradation(color1, color2 = "", min = NaN, max = NaN) {
        this.color1 = color1;
        this.color2 = color2;
        this.min = min;
        this.max = max;
    }

    /**
     * Sets the colors used during the classification.
     * @param {Map<String,String>} map Map having the field different values as keys and colors as values.
     */
    setClasses(map) {
        this.map = map;
    }
}