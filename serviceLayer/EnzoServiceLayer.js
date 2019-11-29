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

    getGarmentScreenshots = function() {
      console.log("triggered");
        var iframe = this.iframe;
        var viewerIframe = iframe.contentWindow;
        viewerIframe.postMessage({
            action : 'beginTransaction'
        },'*');
        viewerIframe.postMessage({
            action : 'getScreenshots',
            width : 512,
            height : 512,
            takeBackground : true,
            cameras : [{
                // front
                position : [-0.9726, 115.8661, 166.3097],
                target:[-0.9726, 115.8661, 0.758],
                up:[0,1,0]
            },{
                // back
                position : [-0.9726, 115.8661, -164.7936],
                target:[-0.9726, 115.8661, 0.758],
                up:[0,1,0]
            },{
                // left
                position : [164.579, 115.8661, 0.758],
                target:[-0.9726, 115.8661, 0.758],
                up:[0,1,0] 
            },{
                // right
                position : [-166.5243, 115.8661, 0.758],
                target:[-0.9726, 115.8661, 0.758],
                up:[0,1,0]
            }
        ]},'*');
        viewerIframe.postMessage({
            action : 'endTransaction'
        },'*');
    }
    

    init(garment) {
      var viewerIframe = null;
        var viewerActive = false;
        var iframe = this.iframe;
      
      var garmentID = garment.options[0].parent.garment.id;
        iframe.src = 'https://emersya.com/showcase/' + garmentID;

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
              this.getGarmentScreenshots();
            } 
        }
        if (event.data && event.data.action == 'onPolylistHighlight') {
          this.setHighlight(event.data.polylistName);
        }

        if (event.data && event.data.action == 'onPolylistSelection') {
          //  this.changeGarmentView(1);
        }  
       if (event.data && event.data.action == 'onScreenshots') {
         var screenshots = event.data.screenshots;
            screenshots.forEach((screenshot) => {
              // console.log('<img src="' + screenshot + '" />');    
            });
       }
        if (event.data && event.data.action == 'onError') {
            console.log(event);
        }
       
    };
      
        return garmentID;
    }

}