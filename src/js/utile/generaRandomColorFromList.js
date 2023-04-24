/**
 * generate random color from list 
 * @param {Array} values - generate unique color from label 
 * @returns {Object} - json with key => label and value => color
 */
export function generateUniqueColors(values) {
  const uniqueValues = [...new Set(values)]; // récupère les valeurs uniques
  const colors = {};
  // génère une couleur unique pour chaque valeur unique
  for (let i = 0; i < uniqueValues.length; i++) {
    colors[uniqueValues[i]] = "#000000".replace(/0/g, function () { return (~~(Math.random() * 16)).toString(16); })
  } // ajoute la valeur et la couleur dans la liste
  colors.undefined = "rgb(169,169,169)"
  return colors
}
