/**
 * 
 * @param {Object} jsonLabelColor - json with key=label and value =color
 */
export function setLegend(jsonLabelColor) {
    console.log(jsonLabelColor)
    let legendHtml = '<div>';
    for (const [label, color] of Object.entries(jsonLabelColor)) {
        legendHtml += `<div style="display:flex;flex-direction:row"> <div style="background-color:${color};width: 31px;height: 16px; margin-right: 20px;"></div><div>${label}</div></div>`;
    }
    legendHtml += '</div>';
    // a div element to hold the legend
    document.getElementById("legend").innerHTML = legendHtml;
}
