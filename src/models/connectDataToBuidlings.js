import { getPopInfoFromIris } from "./insee/getPopFromIris"


export function picking(event, view) {
  if (view.controls.isPaused) {
    const htmlInfo = document.getElementById('info');
    const intersects = view.pickObjectsAt(event, 3, 'WFS Building');
    // const intersects2 = view.pickObjectsAt(event, 10000000, 'iris');
    // console.log(intersects2)
    let properties;
    let info;
    let batchId;

    htmlInfo.innerHTML = ' ';

    if (intersects.length) {
      // console.log(intersects[0])
      batchId = intersects[0].object.geometry.attributes.batchId.array[intersects[0].face.a];
      properties = intersects[0].object.feature.geometries[batchId].properties;

      Object.keys(properties).map(function (objectKey) {
        const value = properties[objectKey];
        if (value) {
          const key = objectKey.toString();
          if (key[0] !== '_' && key !== 'geometry_name') {
            info = value.toString();
            htmlInfo.innerHTML += '<li><b>' + key + ': </b>' + info + '</li>';
          }
        }
      });
    }
  }
}