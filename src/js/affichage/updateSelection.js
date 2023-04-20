export function updateSelectOption(geojson, idSelectDrop2d) {
    // supposons que votre objet GeoJSON est stocké dans la variable 'geojson'
    // obtenir un tableau des noms de propriétés
    const propNames = geojson.features.reduce((acc, feature) => {
        return acc.concat(Object.keys(feature.properties));
    }, []);
    // créer un tableau des clés uniques
    const uniquePropNames = propNames.reduce((acc, propName) => {
        if (!acc.includes(propName)) {
            acc.push(propName);
        }
        return acc;
    }, []);

    // Récupération de l'élément HTML de sélection
    const selectElement = document.getElementById(idSelectDrop2d);
    selectElement.innerHTML = "";

    // Boucle pour ajouter chaque valeur à la sélection
    uniquePropNames.forEach(value => {
        // Création d'un élément d'option
        const option = document.createElement('option');
        // Ajout de la valeur de l'option
        option.text = value;
        // Ajout de la valeur de l'option en tant que valeur d'attribut
        option.value = value;
        // Ajout de l'option à l'élément de sélection
        selectElement.add(option);
    });
}