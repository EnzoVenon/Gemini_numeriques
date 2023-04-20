// eslint-disable-next-line no-unused-vars
function setupLoadingScreen(viewerDiv, view) {
    var loadingScreenContainer;

    if (view.isDebugMode) {
        return;
    }

    // loading screen
    loadingScreenContainer = document.createElement('div');
    // eslint-disable-next-line no-multi-str
    loadingScreenContainer.innerHTML = '\
        <div>\
        <span class="c1">G</span><span class="c2">e</span><span class="c3">m</span><span class="c4">i</span><span class="c5">n</span><span class="c6">i</span>\
        </div>';
    loadingScreenContainer.id = 'itowns-loader';
    viewerDiv.appendChild(loadingScreenContainer);

    // auto-hide in 3 sec or if view is loaded
    function hideLoader() {
        if (!loadingScreenContainer) {
            return;
        }
        loadingScreenContainer.style.opacity = 0;
        loadingScreenContainer.style.pointerEvents = 'none';
        loadingScreenContainer.style.transition = 'opacity 0.5s cubic-bezier(0.55, 0.085, 0.68, 0.53)';

        loadingScreenContainer.addEventListener('transitionend', function _(e) {
            viewerDiv.removeChild(e.target);
        });
        loadingScreenContainer = null;
        view.removeEventListener(
            itowns.VIEW_EVENTS.LAYERS_INITIALIZED,
            hideLoader);
    }

    view.addEventListener(itowns.VIEW_EVENTS.LAYERS_INITIALIZED, hideLoader);
    setTimeout(hideLoader, 3000);
}
