function setupLoadingScreen(n,e){var s;function t(){s&&(s.style.opacity=0,s.style.pointerEvents="none",s.style.transition="opacity 0.5s cubic-bezier(0.55, 0.085, 0.68, 0.53)",s.addEventListener("transitionend",(function(e){n.removeChild(e.target)})),s=null,e.removeEventListener(itowns.VIEW_EVENTS.LAYERS_INITIALIZED,t))}e.isDebugMode||((s=document.createElement("div")).innerHTML='        <div>        <span class="c1">G</span><span class="c2">e</span><span class="c3">m</span><span class="c4">♊︎</span><span class="c5">n</span><span class="c6">i</span>        </div>',s.id="itowns-loader",n.appendChild(s),e.addEventListener(itowns.VIEW_EVENTS.LAYERS_INITIALIZED,t),setTimeout(t,3e3))}
//# sourceMappingURL=index.7f336e55.js.map