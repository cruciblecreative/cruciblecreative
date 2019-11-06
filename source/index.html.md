---
title: API Reference

language_tabs: # must be one of https://git.io/vQNgJ
  - javascript

search: true
---

# Introduction

Hi Scott, Harry and Crucible Team. Here's some documentation about the service layer of the Enzo project.

Here is the Garment object that you have outlined.

To see an updating version of this code in action:
[Codepen](https://codepen.io/kylegriffin/pen/qBBoQGr?editors=1011)

The camera object is subject to change, now that we have access to a model.

```javascript
const garment = {
    options: [
        {
            id: "3i2h145p9wgunvs",
            code: "T01020311",
            display: "Notch 6 cm / 2 3/8 in",
            parent: {
                id: "23iulrbqepnw9v8sngw",
                code: "T010203",
				display: "Lapel",
				camera: {
					position: [1.33,16,0],
					target: [-0.53,1.05,-0.3]
				},
                garment: {
                    id: "iepuwbfaw9p23f",
                    code: "02",
                    display: "Jacket",
                    allowedFabrics: [],
                    allowedLinings: [],
                }
            },
        },
        {
            id: "gailuwdnsfsd",
            code: "T01020401",
            display: "Left",
            parent: {
                id: "4qt;rpinfp08q32rwea",
                code: "T010204",
				display: "Lapel buttonhole",
				camera: {
					position: [1.33,16,0],
					target: [-0.53,1.05,-0.3]
				},
                garment: {
                    id: "iepuwbfaw9p23f",
                    code: "02",
                    display: "Jacket",
                    allowedFabrics: [],
                    allowedLinings: [],
                }
            },
        },
    ],
}
```


# Instantiating the Visualizer

My understanding is that if the customizer retains settings from previous garments, then reinstantiating the viewer by selecting a new garment will preserve the previous state if the user returns to that garment.

> To initialize, use this code:

```javascript
const visualizer = new Visualizer(document.querySelector('#emersyaIframe'));

let emersyaID = visualizer.init(garment);
```

> '#emersyaIframe' can be whatever you would prefer the id of the iframe to be.


<!-- <aside class="notice">
You must replace <code>meowmeowmeow</code> with your personal API key.
</aside> -->

# Customizer Functions
 
<!-- changeGarment - e.g. jacket, trousers, etc.
- changeGarmentView - e.g. jacket default, jacket open/lining, jacket zoom level, etc.
- changeGarmentFabric
- changeGarmentLining
- onClick - to respond to hotspots
- changeGarmentCustomization -->

<aside class="warning">
All of these functions are subject to change very quickly at this time. THEY WILL NOT BE CORRECT!
</aside>

## Change Garment

Presumably it will be a reinstantiation with a different ID. If garment state needs to at all be preserved by this service layer, let me know.

```javascript

let emersyaID = visualizer.init(garment);
```

## Change Garment View

Some garments will have actionable points that will affect the model. An example is a suit jacket being clicked to open and reveal the inner lining.

The function will also call when selecting it in the customizer.

```javascript

var garmentView = visualizer.changeGarmentView(garment.elements.element);
```

## Change Garment Fabric

```javascript

var garmentFabric = visualizer.changeGarmentFabric(garment.material);
```


## Change Garment Lining

Will be added soon.

```javascript

var garmentLining = visualizer.changeGarmentLining(garment.material);
```

## Change Garment Customization

To change the garment's variant of the part of the garment. E.g. changing the width of the lapel.

This will most likely occur after the user has clicked the garment and triggered garmentView to zoom in and also reveal the options in the customizer.

```javascript

var garmentCustomization = visualizer.changeGarmentCustomization(garment.elements.element, garment.elements.variation);
```

# Visualizer Functions

The visualizer functions are all functions that affect the customizer. This can happen by clicking a highlighted part of the model. 


# Service Layer

```javascript

class Visualizer {
    constructor(iframe) {
        this.iframe = iframe;
      }

    init(garment) {
        var viewerIframe = null;
		var viewerActive = false;
        var iframe = this.iframe;
        
        iframe.onload = function() {
			viewerIframe = iframe.contentWindow;
			window.removeEventListener('message', visualizerEventListener ,false);
			viewerIframe.postMessage({
				action : 'registerCallback'
			}, '*');
			window.addEventListener('message', visualizerEventListener, false);
			viewerIframe.postMessage({
				action:'getViewerState'
			}, '*');
        }; 
        
        var visualizerEventListener = function(event){
			if(event.data && event.data.action == 'onStateChange'){
				if(event.data.state.viewerState == 'loaded' || event.data.state.viewerState == 'fallbackloaded'){
					viewerActive = true;
				}
			}
            if(event.data && event.data.action == 'onMaterialTreeHighlight'){
                console.log(event.data.materialTreesName);
                setHighlight(event.data.materialTreesName);
            }

            if(event.data && event.data.action == 'onPolylistSelection'){
                    changeGarmentView(event.data.polylistName, [1.33,16,0], [-0.53,1.05,-0.3], '#logo-options');
            }
			if(event.data && event.data.action == 'onError'){
				console.log(event);
			} 
		};
      
      // This is just part of the visualizer and doesn't need to return anything currently.
    function setHighlight(highlight) {
        viewerIframe.postMessage({
           action : 'beginTransaction'
         },'*');
         viewerIframe.postMessage({
           action : 'setHighlightByName',
           list: highlight
         },'*');
         var highlightPick = document.querySelector('#highlight-picker');
         highlightPick.innerHTML = highlight;
         viewerIframe.postMessage({
           action : 'endTransaction'
         },'*');
    }
        var garmentID = garment.options[0].parent.garment.id;
        iframe.src = 'https://emersya.com/showcase/'+garmentID;  // this will change when we know the full URL.
      console.log(iframe.src);
        return garmentID; 
    }

    

    /* customizer functions */

    static changeGarmentView(element) {
        viewerIframe.postMessage({
            action : 'beginTransaction'
          },'*');
        viewerIframe.postMessage({
            action : 'setCamera',
            position : [1.33,22,0],
            target : [-0.53,-1.25,-0.3],
            up : [0,1,0],
            transitionTime : 500,
            fov : 30
        },'*');
        viewerIframe.postMessage({
            action : 'endTransaction'
          },'*');
        return element;
    }

    static changeGarmentFabric(material) {
    }

    static changeGarmentLining() {
    }
    
    // the element is a part of the garment, like the lapel. The variation is what will change to the element.
    static changeGarmentCustomization(element, variation) {
    }
}

```


