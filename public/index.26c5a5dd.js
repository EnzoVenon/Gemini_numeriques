var FeatureToolTip=function(){var e,o,t,n=[],r=[],i=0;function s(e){return function(){return e.properties}}function l(o,t){var n,r,i,l="";console.log(o);for(var d=0;d<o.length;d++){r=(n=o[d]).geometry,console.log(r),e.value=r,i=r.properties&&r.properties.style||n.style||t.style;var a={globals:{},properties:s(r)};i=i.drawingStylefromContext(a),l=""}return l}return document.body.addEventListener("mousedown",(function(){++i}),!1),document.body.addEventListener("mouseup",(function(e){""===e.target.id&&--i}),!1),{init:function(s,d){(e=document.createElement("div")).className="tooltip",e.id="tooltip",(t=document.createElement("div")).className="mouseevent",t.id="mouseevent",s.appendChild(e),s.appendChild(t),o=d,document.addEventListener("mousedown",(function s(d){i?(!function(t){e.innerHTML="",e.style.display="none";var i,s=o.pickFeaturesAt.apply(o,[t,2].concat(r));for(var d in s)0!=s[d].length&&(i=n[r.indexOf(d)],console.log(i),console.log(i.layer.source),console.log(i.layer.source.features),i&&("function"==typeof i.options.filterGeometries&&(s[d]=i.options.filterGeometries(s[d],i.layer)||[]),e.innerHTML+=l(s[d],i.layer)));e.innerHTML="",""!=e.innerHTML&&(e.style.display="block",e.style.left=o.eventToViewCoords(t).x+"px",e.style.top=o.eventToViewCoords(t).y+"px")}(d),t.value=d,e.innerHTML='<div class="wrapper"><div class="tabs">'+e.innerHTML+"</div></div>",e.addEventListener("mouseover",(()=>{document.removeEventListener("mousedown",s)})),e.addEventListener("mouseout",(()=>{document.addEventListener("mousedown",s)})),e.addEventListener,console.log(e)):(e.style.left=o.eventToViewCoords(d).x+"px",e.style.bottom=o.eventToViewCoords(d).y+"px")}),!1)},addLayer:function(e,o){if(!e.isLayer)return e;var t=o||{filterAllProperties:!0};return t.filterProperties=null==t.filterProperties?[]:t.filterProperties,t.filterProperties.concat(["name","nom","style","description"]),n.push({layer:e,options:t}),r.push(e.id),e}}}();"undefined"!=typeof module&&module.exports&&(module.exports=FeatureToolTip);
//# sourceMappingURL=index.26c5a5dd.js.map