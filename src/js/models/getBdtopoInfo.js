export function getBdtopoInfo(csvIdBdnbBdtopo, bdnbGoupeBatId) {
  let csvBdnbBdtopo = csvIdBdnbBdtopo.then(res => {
    let bdTopoId = res.filter(obj => obj.batiment_g === bdnbGoupeBatId)[0].bdtopo

    let result = shapefile.open("../../data/shp/prg/bd_topo")
      .then(source => source.read()
        .then(function log(result) {
          if (result.done) return "done";
          console.log("bdtopo")

          if (result.value.properties["ID"] === bdTopoId) {
            // console.log(result.value.properties)
            if (document.getElementById('batInfo').value != bdnbGoupeBatId) {
              console.log("bdtopoIDoh")
              // document.getElementById('listHauteur').innerHTML +=`<p> </p>`
              // document.getElementById("btnOffcanvasScrollingbat").click()

              document.getElementById('listHauteur').innerHTML += `<div style="width:100%;display:flex; flex-direction:row;justify-content:space-around"> <span>${result.value.properties["HAUTEUR"]} m </span><a  href="#" data-bs-toggle="tooltip" data-bs-placement="right"
                          data-bs-custom-class="custom-tooltip"
                          data-bs-title="donnée issue de la bdtopo  sur l'attribut HAUTEUR">
                          info
                      </a>
                      </div>
                        `
              document.getElementById('listEtage').innerHTML = `<div style="width:100%;display:flex; flex-direction:row;justify-content:space-around"> <span>${result.value.properties["NB_ETAGES"]} </span><a  href="#" data-bs-toggle="tooltip" data-bs-placement="right"
                        data-bs-custom-class="custom-tooltip"
                        data-bs-title="donnée issue de la bdtopo  sur l'attribut NB_ETAGES">
                        info
                    </a>
                    </div>
                      `

              document.getElementById('listEtat').innerHTML = `<div style="width:100%;display:flex; flex-direction:row;justify-content:space-around"> <span>${result.value.properties["ETAT"]} </span><a  href="#" data-bs-toggle="tooltip" data-bs-placement="right"
                      data-bs-custom-class="custom-tooltip"
                      data-bs-title="donnée issue de la bdtopo  sur l'attribut ETAT">
                      info
                  </a>
                  </div>
                    `
              const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
              const tooltipList = [...tooltipTriggerList]
              tooltipList.map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))


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