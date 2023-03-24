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
      let iris_code;
      let importantKey = ["usage_1", "usage_2", "hauteur", "nombre_de_logements", "nombre_d_etage"]

      let keys = Object.keys(properties)
      // Object.keys(properties).map(async function (objectKey) 
      for (let i = 0; i < keys.length; i++) {
        let objectKey = keys[i]

        const value = properties[objectKey];

        if (value) {
          const key = objectKey.toString();
          console.log('------------------- Key ---------------')
          if (key === 'bbox') {
            const lon = (value[0] + value[2]) / 2;
            const lat = (value[1] + value[3]) / 2;
            const res = await fetch("https://pyris.datajazz.io/api/coords?lat=" + lat + "&lon=" + lon)
            const json = await res.json();

            console.log('result')
            iris_code = json.complete_code
          }
          if (key[0] !== '_' && key !== 'geometry_name' && (importantKey.includes(key))) {
            info = value.toString();
            htmlInfo.innerHTML += '<li><b>' + key + ': </b>' + info + '</li>';
          }
        }
      }
      htmlInfo.innerHTML += '<li>' + 'test iris' + '</li>';

      console.log('iris_code')
      console.log(iris_code)

      // getPopdata
      let apiUrl = "https://pyris.datajazz.io/api/insee/population/" + iris_code

      let apiUrl2 = "https://pyris.datajazz.io/api/insee/population/distribution/" + iris_code + "?by=age"


      let dataPromise = await fetch(apiUrl)
      let dataJson = await dataPromise.json()
      console.log(dataJson)

      let dataPromiseAge = await fetch(apiUrl2)
      let dataJsonAge = await dataPromiseAge.json()
      console.log(dataJsonAge.data)
      delete dataJsonAge.data.census;

      htmlInfo.innerHTML += '<li>' + 'population par groupe paté de maison' + '</li>';
      htmlInfo.innerHTML += '<div style="width:100%;"><canvas id="pop"></canvas></div>';
      htmlInfo.innerHTML += '<li>' + 'population par age par groupe paté de maison' + '</li>';
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

      addChart('pop', data, "pop", "count", 'population')
      addChart('pop2', dataAge, "age", "count", 'population par age')

    }
  }
}