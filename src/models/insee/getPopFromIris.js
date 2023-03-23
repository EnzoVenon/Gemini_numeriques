export function getPopInfoFromIris(code_iris) {
  let apiUrl = "https://pyris.datajazz.io/api/insee/population/" + 291230000

  fetch(apiUrl).then(res => res.json()).then(resjson => {
    console.log(resjson)
  }
  )
}