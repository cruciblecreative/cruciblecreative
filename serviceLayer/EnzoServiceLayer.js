/* currently a multitude of scope related issues as I'm forming the function at this point in time */


class Visualizer {
    constructor(iframe) {
        this.iframe = iframe;
    }

    // This is just part of the visualizer and doesn't need to return anything currently.

     setHighlight = function(polylist) {
        var iframe = this.iframe;
        var viewerIframe = iframe.contentWindow;
        viewerIframe.postMessage({
            action: 'beginTransaction'
        }, '*'); 
        viewerIframe.postMessage({
            action: 'setHighlightByName',
            list: polylist
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

    // materialSettings is formatted like 'buttons/buttons_white'
    changeGarmentMaterial = function(display, material) {
        var iframe = this.iframe;
        var viewerIframe = iframe.contentWindow;
        viewerIframe.postMessage({
            action : 'beginTransaction'
        },'*');
        viewerIframe.postMessage({
            action : 'setMaterialByName',
            materialSettings : display + '/' + material,
        },'*');
        viewerIframe.postMessage({
            action : 'endTransaction'
        },'*');
    }

    changeGarmentLining = function(display, lining) {
        var iframe = this.iframe;
        var viewerIframe = iframe.contentWindow;
        viewerIframe.postMessage({
            action : 'beginTransaction'
        },'*');
        viewerIframe.postMessage({
            action : 'setMaterialByName',
            materialSettings : display + '/' + lining,
        },'*');
        viewerIframe.postMessage({
            action : 'endTransaction'
        },'*');
    }

    // This is called when you are changing the SIZE or the QUANTITY of the garment part. Such as increasing the lapel size or the quantity of buttons.
    changeGarmentCustomization = function(id) {}

    

    init(garment) {
      var viewerIframe = null;
        var viewerActive = false;
        var iframe = this.iframe;
      
      var garmentID = garment.options[0].parent.garment.id;
        iframe.src = 'https://emersya.com/showcase/' + garmentID; // this will change when we know the full URL.
        console.log(iframe.contentWindow);

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
      
      var visualizerEventListener = (event) => {
        if (event.data && event.data.action == 'onStateChange') {
            if (event.data.state.viewerState == 'loaded' || event.data.state.viewerState == 'fallbackloaded') {
                viewerActive = true;
            }
        }
        if (event.data && event.data.action == 'onPolylistHighlight') {
           this.setHighlight(event.data.polylistName);
        }

        if (event.data && event.data.action == 'onPolylistSelection') {
          //  this.changeGarmentView(1);
        }
        if (event.data && event.data.action == 'onError') {
            console.log(event);
        }
    };
        return garmentID;
    }

}