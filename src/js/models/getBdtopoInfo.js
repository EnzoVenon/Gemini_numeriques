export function getBdtopoInfo(csvIdBdnbBdtopo, bdnbGoupeBatId) {
  let csvBdnbBdtopo = csvIdBdnbBdtopo.then(res => {
    let bdTopoId = res.filter(obj => obj.batiment_g === bdnbGoupeBatId)[0].bdtopo

    let result = shapefile.open("../../data/shp/prg/bd_topo")
      .then(source => source.read()
        .then(function log(result) {
          if (result.done) return "done";
          console.log("bdtopo")

          if (result.value.properties["ID"] === bdTopoId) {

            if (document.getElementById('batInfo').value != bdnbGoupeBatId) {
              console.log("bdtopoIDoh")
            }
            return result.value.properties;
          }
          else {
            return source.read().then(log);
          }
        }
        ))
    return result;

  })
  return csvBdnbBdtopo;
}