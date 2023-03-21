itowns.proj4.defs("EPSG:3946","+proj=lcc +lat_1=45.25 +lat_2=46.75 +lat_0=46 +lon_0=3 +x_0=1700000 +y_0=5200000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");var e,t={coord:new itowns.Coordinates("EPSG:4326",4.818,45.7354),range:3e3,tilt:45},n=[],r=[],o=document.getElementById("viewerDiv"),i=new itowns.GlobeView(o,t);function a(e){e.source=new itowns.WMTSSource(e.source);var t=new itowns.ElevationLayer(e.id,e);i.addLayer(t).then(w.addLayerGUI.bind(w))}setupLoadingScreen(o,i),itowns.Fetcher.json("./layers/JSONLayers/Ortho.json").then((function(e){e.source=new itowns.WMTSSource(e.source);var t=new itowns.ColorLayer("Ortho",e);i.addLayer(t).then(w.addLayerGUI.bind(w))})),itowns.Fetcher.json("./layers/JSONLayers/WORLD_DTM.json").then(a),itowns.Fetcher.json("./layers/JSONLayers/IGN_MNT_HIGHRES.json").then(a);var s,u=new itowns.THREE.Color;var l=new itowns.WFSSource({protocol:"wfs",url:"https://download.data.grandlyon.com/wfs/rdata?",version:"2.0.0",typeName:"tcl_sytral.tcllignebus",crs:"EPSG:3946",extent:{west:1822174.6,east:1868247.07,south:5138876.75,north:5205890.19},format:"geojson"}),c=new itowns.FeatureGeometryLayer("WFS Bus lines",{name:"lyon_tcl_bus",filter:function(e){if("Aller"==e.sens){var t=e.ligne;if(-1===r.indexOf(t))return r.push(t),!0}return!1},source:l,zoom:{min:9},style:new itowns.Style({stroke:{color:function(e){return u.set(Math.round(16777215*Math.random()))},base_altitude:function(e,t){var n,r=0;if(t)return(n=itowns.DEMUtils.getTerrainObjectAt(i.tileLayer,t,0,s))||(n=itowns.DEMUtils.getTerrainObjectAt(i.tileLayer,t,0)),s=[n.tile],n&&(r=n.coord.z),r+5},width:5}})});i.addLayer(c),e=function(){var e,t;for(n.length&&i.notifyChange(i.camera.camera3D,!0),e=0;e<n.length;e++)(t=n[e])&&(t.scale.z=Math.min(1,t.scale.z+.1),t.updateMatrixWorld(!0));n=n.filter((function(e){return e.scale.z<1}))},i.addFrameRequester(itowns.MAIN_LOOP_EVENTS.BEFORE_RENDER,e);var d=new itowns.WFSSource({url:"https://wxs.ign.fr/topographie/geoportail/wfs?",version:"2.0.0",typeName:"BDTOPO_V3:batiment",crs:"EPSG:4326",ipr:"IGN",format:"application/json",extent:{west:4.568,east:5.18,south:45.437,north:46.03}}),g=new itowns.FeatureGeometryLayer("WFS Building",{batchId:function(e,t){return t},onMeshCreated:function(e){e.children.forEach((e=>{e.scale.z=.01,n.push(e)}))},filter:function(e){return!!e.hauteur},source:d,zoom:{min:14},style:new itowns.Style({fill:{color:function(e){return"Résidentiel"===e.usage_1?u.set(16645631):"Annexe"===e.usage_1?u.set(13026745):"Commercial et services"===e.usage_1?u.set(6460062):"Religieux"===e.usage_1?u.set(3751231):"Sportif"===e.usage_1?u.set(5532283):u.set(5592405)},base_altitude:function(e){return e.altitude_minimale_sol},extrusion_height:function(e){return e.hauteur}}})});i.addLayer(g);var w=new GuiTools("menuDiv",i);function y(e){if(i.controls.isPaused){var t,n,r,o=document.getElementById("info"),a=i.pickObjectsAt(e,3,"WFS Building");o.innerHTML=" ",a.length&&(r=a[0].object.geometry.attributes.batchId.array[a[0].face.a],t=a[0].object.feature.geometries[r].properties,Object.keys(t).map((function(e){var r=t[e];if(r){var i=e.toString();"_"!==i[0]&&"geometry_name"!==i&&(n=r.toString(),o.innerHTML+="<li><b>"+i+": </b>"+n+"</li>")}})))}}for(var f of(i.addEventListener(itowns.GLOBE_VIEW_EVENTS.GLOBE_INITIALIZED,(function(){console.info("Globe initialized")})),debug.createTileDebugUI(w.gui,i),i.getLayers()))"WFS Bus lines"===f.id&&f.whenReady.then((function(e){var t=debug.GeometryDebug.createGeometryDebugUI(w.gui,i,e);debug.GeometryDebug.addMaterialLineWidth(t,i,e,1,10)})),"WFS Building"===f.id&&f.whenReady.then((function(e){var t=debug.GeometryDebug.createGeometryDebugUI(w.gui,i,e);debug.GeometryDebug.addWireFrameCheckbox(t,i,e),window.addEventListener("mousemove",y,!1)})),"WFS Route points"===f.id&&f.whenReady.then((function(e){var t=debug.GeometryDebug.createGeometryDebugUI(w.gui,i,e);debug.GeometryDebug.addMaterialSize(t,i,e,1,200)}));
//# sourceMappingURL=index.a38dd4be.js.map
