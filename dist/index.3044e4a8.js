function setupLoadingScreen(n,s){var e;function t(){e&&(e.style.opacity=0,e.style.pointerEvents="none",e.style.transition="opacity 0.5s cubic-bezier(0.55, 0.085, 0.68, 0.53)",e.addEventListener("transitionend",(function(s){n.removeChild(s.target)})),e=null,s.removeEventListener(itowns.VIEW_EVENTS.LAYERS_INITIALIZED,t))}s.isDebugMode||((e=document.createElement("div")).innerHTML='        <div>        <span class="c1">i</span><span class="c2">T</span><span class="c3">o</span><span class="c4">w</span><span class="c5">n</span><span class="c6">s</span>        </div>',e.id="itowns-loader",n.appendChild(e),s.addEventListener(itowns.VIEW_EVENTS.LAYERS_INITIALIZED,t),setTimeout(t,3e3))}
//# sourceMappingURL=index.3044e4a8.js.map
