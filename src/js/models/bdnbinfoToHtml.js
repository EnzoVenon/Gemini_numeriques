export function bdnbinfoToHtml(dataBatBdnb) {
  // console.log(output)
  // document.getElementById('batInfo').innerHTML = JSON.stringify(res)
  document.getElementById('listHauteur').innerHTML = `<div style="width:100%;display:flex; flex-direction:row;justify-content:space-around"> <span>${dataBatBdnb["bdtopo_bat_hauteur_mean"]} m</span><a  href="#" data-bs-toggle="tooltip" data-bs-placement="right"
                    data-bs-custom-class="custom-tooltip"
                    data-bs-title="Donnée issue de la BDNB sur l'attribut bdtopo_bat_hauteur_mean">
                    info
                </a>
                </div>
                  `

  document.getElementById('listConsoEnergie').innerHTML = `<div style="width:100%;display:flex; flex-direction:row;justify-content:space-around"> <span>${dataBatBdnb["dpe_logtype_classe_conso_ener"]} m</span><a  href="#" data-bs-toggle="tooltip" data-bs-placement="right"
                  data-bs-custom-class="custom-tooltip"
                  data-bs-title="Donnée issue de la BDNB sur l'attribut dpe_logtype_classe_conso_ener">
                  info
              </a>
              </div>
                `

  document.getElementById('listConsoEnergie').innerHTML = `<div style="width:100%;display:flex; flex-direction:row;justify-content:space-around"> <span>${dataBatBdnb["dpe_logtype_classe_conso_ener"]} m</span><a  href="#" data-bs-toggle="tooltip" data-bs-placement="right"
                data-bs-custom-class="custom-tooltip"
                data-bs-title="Donnée issue de la BDNB sur l'attribut dpe_logtype_classe_conso_ener">
                info
            </a>
            </div>
              `
  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
  const tooltipList = [...tooltipTriggerList]
  tooltipList.map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
}
