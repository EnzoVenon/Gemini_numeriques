function e(e){return new itowns.THREE.Color(11184810)}function t(e){return e.hauteur}function i(e){return e.z_min-e.hauteur}const o=document.getElementById("viewerDiv"),n={coord:new itowns.Coordinates("EPSG:4326",.71829,45.1826),range:3e3,tilt:20};let r=new itowns.GlobeView(o,n);const l=function(e,t,i,o,n){const r=new itowns.WMTSSource({url:e,crs:t,name:i,tileMatrixSet:o,format:n});return new itowns.ColorLayer("Ortho",{source:r})}("http://wxs.ign.fr/3ht7xcw6f7nciopo16etuqp2/geoportail/wmts","EPSG:3857","ORTHOIMAGERY.ORTHOPHOTOS","PM","image/jpeg");r.addLayer(l);const a=function(e,t,i,o,n){const r=new itowns.WMTSSource({url:e,crs:t,name:i,tileMatrixSet:o,format:n,tileMatrixSetLimits:{11:{minTileRow:442,maxTileRow:1267,minTileCol:1344,maxTileCol:2683},12:{minTileRow:885,maxTileRow:2343,minTileCol:3978,maxTileCol:5126},13:{minTileRow:1770,maxTileRow:4687,minTileCol:7957,maxTileCol:10253},14:{minTileRow:3540,maxTileRow:9375,minTileCol:15914,maxTileCol:20507}}});return new itowns.ElevationLayer("MNT_WORLD",{source:r})}("http://wxs.ign.fr/3ht7xcw6f7nciopo16etuqp2/geoportail/wmts","EPSG:4326","ELEVATION.ELEVATIONGRIDCOVERAGE.HIGHRES","WGS84G","image/x-bil;bits=32");r.addLayer(a);!function(o,n,r,l,a){const w=new itowns.WFSSource({url:o,typeName:n,crs:r,extent:a});new itowns.FeatureGeometryLayer("Buildings",{source:w,zoom:{min:l},style:new itowns.Style({fill:{color:e,base_altitude:i,extrusion_height:t}})})}("http://wxs.ign.fr/3ht7xcw6f7nciopo16etuqp2/geoportail/wfs?","BDTOPO_BDD_WLD_WGS84G:bati_indifferencie","EPSG:4326",14,{west:.67289,east:.74665,south:45.17272,north:45.2135});r.addLayer(geometry_layer);
//# sourceMappingURL=index.b8ce9a0a.js.map
