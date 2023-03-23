import { addChart } from "./insee/showChart"

export async function picking(event, view) {
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

      let importantKey = ["usage_1", "usage_2", "hauteur", "nombre_de_logements", "nombre_d_etage"]
      Object.keys(properties).map(function (objectKey) {
        const value = properties[objectKey];
        if (value) {
          const key = objectKey.toString();
          if (key[0] !== '_' && key !== 'geometry_name' && (importantKey.includes(key))) {
            info = value.toString();
            htmlInfo.innerHTML += '<li><b>' + key + ': </b>' + info + '</li>';
          }
        }
      });
      htmlInfo.innerHTML += '<li>' + 'test iris' + '</li>';

      // getPopdata
      let apiUrl = "https://pyris.datajazz.io/api/insee/population/" + 291230000

      let apiUrl2 = "https://pyris.datajazz.io/api/insee/population/distribution/" + 291230000 + "?by=age"


      let dataPromise = await fetch(apiUrl)
      let dataJson = await dataPromise.json()
      console.log(dataJson)

      let dataPromiseAge = await fetch(apiUrl2)
      let dataJsonAge = await dataPromiseAge.json()
      console.log(dataJsonAge.data)
      delete dataJsonAge.data.census;

      htmlInfo.innerHTML += '<li><div style="width:100%;"><canvas id="pop"></canvas></div></li>';
      htmlInfo.innerHTML += '<div style="width:100%;"><canvas id="pop2"></canvas></div>';


      const data = [
        { pop: "total", count: dataJson.population },
        { pop: "homme", count: dataJson.population_male },
        { pop: "femme", count: dataJson.population_female },
      ];

      let dataAge = [];
      Object.entries(dataJsonAge.data).forEach(([key, val]) => {
        console.log(val)
        dataAge.push({ age: key, count: val })

      })

      addChart('pop', data, "pop", "count")
      addChart('pop2', dataAge, "age", "count")

    }
  }
}