/* currently a multitude of scope related issues as I'm forming the function at this point in time */


class Visualizer {
    constructor(iframe) {
        this.iframe = iframe;
    }


    // This is just part of the visualizer and doesn't need to return anything currently.

    setHighlight = function (highlight) {
        viewerIframe.postMessage({
            action: 'beginTransaction'
        }, '*');
        viewerIframe.postMessage({
            action: 'setHighlightByName',
            list: highlight
        }, '*');
        var highlightPick = document.querySelector('#highlight-picker');
        highlightPick.innerHTML = highlight;
        viewerIframe.postMessage({
            action: 'endTransaction'
        }, '*');
    }


    /* customizer functions */

    static changeGarmentView(element) {
        viewerIframe.postMessage({
            action: 'beginTransaction'
        }, '*');
        viewerIframe.postMessage({
            action: 'setCamera',
            position: [1.33, 22, 0],
            target: [-0.53, -1.25, -0.3],
            up: [0, 1, 0],
            transitionTime: 500,
            fov: 30
        }, '*');
        viewerIframe.postMessage({
            action: 'endTransaction'
        }, '*');
        return element;
    }

    static changeGarmentFabric(material) {}

    static changeGarmentLining() {}

    // the element is a part of the garment, like the lapel. The variation is what will change to the element.
    static changeGarmentCustomization(element, variation) {}

    visualizerEventListener = function (event) {
        if (event.data && event.data.action == 'onStateChange') {
            if (event.data.state.viewerState == 'loaded' || event.data.state.viewerState == 'fallbackloaded') {
                viewerActive = true;
            }
        }
        if (event.data && event.data.action == 'onMaterialTreeHighlight') {
            console.log(event.data.materialTreesName);
            setHighlight(event.data.materialTreesName);
        }

        if (event.data && event.data.action == 'onPolylistSelection') {
            changeGarmentView(event.data.polylistName, [1.33, 16, 0], [-0.53, 1.05, -0.3], '#logo-options');
        }
        if (event.data && event.data.action == 'onError') {
            console.log(event);
        }
    };

    init(garment) {
        var viewerIframe = null;
        var viewerActive = false;
        var iframe = this.iframe;

        iframe.onload = function () {
            viewerIframe = iframe.contentWindow;
            window.removeEventListener('message', visualizerEventListener, false);
            viewerIframe.postMessage({
                action: 'registerCallback'
            }, '*');
            window.addEventListener('message', visualizerEventListener, false);
            viewerIframe.postMessage({
                action: 'getViewerState'
            }, '*');
        };
        var garmentID = garment.options[0].parent.garment.id;
        iframe.src = 'https://emersya.com/showcase/' + garmentID; // this will change when we know the full URL.
        console.log(iframe.src);
        return garmentID;
    }

}