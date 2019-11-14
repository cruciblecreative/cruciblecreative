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
        viewerIframe.postMessage({
            action: 'endTransaction'
        }, '*');
    }


    /* customizer functions */

    changeGarmentView = function(trigger) {
      var iframe = this.iframe;
            var viewerIframe = iframe.contentWindow;
        viewerIframe.postMessage({
            action: 'beginTransaction'
        }, '*');
        viewerIframe.postMessage({
            action : 'triggerAnimation',
            triggerId : trigger,
          },'*');
        viewerIframe.postMessage({
            action: 'endTransaction'
        }, '*');
    }

    static changeGarmentFabric(material) {}

    static changeGarmentLining() {}

    // the element is a part of the garment, like the lapel. The variation is what will change to the element.
    static changeGarmentCustomization(element, variation) {}

    visualizerEventListener = function(event) {
        if (event.data && event.data.action == 'onStateChange') {
            if (event.data.state.viewerState == 'loaded' || event.data.state.viewerState == 'fallbackloaded') {
                viewerActive = true;
            }
        }
        if (event.data && event.data.action == 'onMaterialTreeHighlight') {
            console.log(event.data.materialTreesName);
            this.setHighlight(event.data.materialTreesName);
        }

        if (event.data && event.data.action == 'onPolylistSelection') {
          console.log(event.data.polylistName); 
            this.changeGarmentView(1);
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
            window.removeEventListener('message', this.visualizerEventListener, false);
            viewerIframe.postMessage({
                action: 'registerCallback'
            }, '*');
            window.addEventListener('message', this.visualizerEventListener, false);
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