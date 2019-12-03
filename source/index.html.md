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
            code: "",
            display: "Notch 6 cm / 2 3/8 in",
            parent: {
                id: "23iulrbqepnw9v8sngw",
                code: "T010505",
                display: "Button",
                triggerId: 1,
                allowedMaterials: ['buttons', 'buttons_white', 'buttons_red'],
                allowedLinings: [],
                garment: {
                    id: "FE8BCEEPXQ",
                    code: "02",
                    display: "Jacket",
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
                triggerId: 2,
                allowedMaterials: [],
                allowedLinings: [],
                garment: {
                    id: "FE8BCEEPXQ",
                    code: "02",
                    display: "Jacket",
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
- changeGarmentMaterial
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

var garmentView = visualizer.changeGarmentView(triggerId);
```

## Change Garment Material

i.e. fabric

```javascript

var garmentMaterial = visualizer.changeGarmentMaterial(display, material);
```

> The customization and material are customizable seperately if the allowedMaterials affects the parent (e.g. button).

## Change Garment Lining

Will be finished once the lining of the model is made as a customizable garment part.

```javascript

var garmentLining = visualizer.changeGarmentLining(display, lining);
```

## Change Garment Customization

To change the garment's variant of the part of the garment. E.g. changing the width of the lapel.

This will most likely occur after the user has clicked the garment and triggered garmentView to zoom in and also reveal the options in the customizer.

```javascript

var garmentCustomization = visualizer.changeGarmentCustomization(id);
```

## Take Garment Screenshots for checkout

This function will generate 4 images from the garment (front, back, left, right), on a transparent background, and return an array of URLs.

```javascript

visualizer.getGarmentScreenshots();

var garmentScreenshots = visualizer.screenshots;
```


# Visualizer Functions

The visualizer functions are all functions that affect the customizer. This can happen by clicking a highlighted part of the model. 


# Service Layer

```javascript

class Visualizer {
    constructor(iframe) {
        this.iframe = iframe;
        this.screenshots = [];
    }

    // This is just part of the visualizer and doesn't need to return anything currently.

    setHighlight = function(polylist) {
        var iframe = this.iframe;
        var viewerIframe = iframe.contentWindow;
        viewerIframe.postMessage({
                action: "beginTransaction"
            },
            "*"
        );
        viewerIframe.postMessage({
                action: "setHighlightByName",
                list: polylist
            },
            "*"
        );
        viewerIframe.postMessage({
                action: "endTransaction"
            },
            "*"
        );
    };

    setTriggers = function(viewerWidth) {
        var iframe = this.iframe;
        var viewerIframe = iframe.contentWindow;
        viewerIframe.postMessage({
                action: "beginTransaction"
            },
            "*"
        );
        if (viewerWidth > 768) {
            viewerIframe.postMessage({
                    action: "hideAnimationTriggers"
                },
                "*"
            );
        } else {
            viewerIframe.postMessage({
                    action: "showAnimationTriggers"
                },
                "*"
            );
        }
        viewerIframe.postMessage({
                action: "endTransaction"
            },
            "*"
        );
    };

    /* customizer functions */

    changeGarmentView = function(trigger) {
        var iframe = this.iframe;
        var viewerIframe = iframe.contentWindow;
        viewerIframe.postMessage({
                action: "beginTransaction"
            },
            "*"
        );
        viewerIframe.postMessage({
                action: "triggerAnimation",
                triggerId: trigger
            },
            "*"
        );
        viewerIframe.postMessage({
                action: "endTransaction"
            },
            "*"
        );
    };

    // materialSettings is formatted like 'buttons/buttons_white'
    changeGarmentMaterial = function(display, material) {
        var iframe = this.iframe;
        var viewerIframe = iframe.contentWindow;
        viewerIframe.postMessage({
                action: "beginTransaction"
            },
            "*"
        );
        viewerIframe.postMessage({
                action: "setMaterialByName",
                materialSettings: display + "/" + material
            },
            "*"
        );
        viewerIframe.postMessage({
                action: "endTransaction"
            },
            "*"
        );
    };

    changeGarmentLining = function(display, lining) {
        var iframe = this.iframe;
        var viewerIframe = iframe.contentWindow;
        viewerIframe.postMessage({
                action: "beginTransaction"
            },
            "*"
        );
        viewerIframe.postMessage({
                action: "setMaterialByName",
                materialSettings: display + "/" + lining
            },
            "*"
        );
        viewerIframe.postMessage({
                action: "endTransaction"
            },
            "*"
        );
    };

    // This is called when you are changing the SIZE or the QUANTITY of the garment part. Such as increasing the lapel size or the quantity of buttons.
    changeGarmentCustomization = function(id) {};

    getGarmentScreenshots = function() {
        var iframe = this.iframe;
        var viewerIframe = iframe.contentWindow;
        viewerIframe.postMessage({
                action: "beginTransaction"
            },
            "*"
        );
        viewerIframe.postMessage({
                action: "getScreenshots",
                width: 512,
                height: 512,
                takeBackground: true,
                cameras: [{
                        // front
                        position: [-0.9726, 115.8661, 166.3097],
                        target: [-0.9726, 115.8661, 0.758],
                        up: [0, 1, 0]
                    },
                    {
                        // back
                        position: [-0.9726, 115.8661, -164.7936],
                        target: [-0.9726, 115.8661, 0.758],
                        up: [0, 1, 0]
                    },
                    {
                        // left
                        position: [164.579, 115.8661, 0.758],
                        target: [-0.9726, 115.8661, 0.758],
                        up: [0, 1, 0]
                    },
                    {
                        // right
                        position: [-166.5243, 115.8661, 0.758],
                        target: [-0.9726, 115.8661, 0.758],
                        up: [0, 1, 0]
                    }
                ]
            },
            "*"
        );
        viewerIframe.postMessage({
                action: "endTransaction"
            },
            "*"
        );
    };

    init(garment) {
        var viewerIframe = null;
        var viewerActive = false;
        var iframe = this.iframe;
        var viewerWidth = iframe.clientWidth;

        var garmentID = garment.options[0].parent.garment.id;
        iframe.src = "https://emersya.com/showcase/" + garmentID;

        iframe.onload = function() {
            viewerIframe = iframe.contentWindow;
            window.removeEventListener("message", visualizerEventListener, false);
            viewerIframe.postMessage({
                    action: "registerCallback"
                },
                "*"
            );
            window.addEventListener("message", visualizerEventListener, false);
            viewerIframe.postMessage({
                    action: "getViewerState"
                },
                "*"
            );
        };

        var visualizerEventListener = event => {
            if (event.data && event.data.action == "onStateChange") {
                if (
                    event.data.state.viewerState == "loaded" ||
                    event.data.state.viewerState == "fallbackloaded"
                ) {
                    viewerActive = true;
                    this.setTriggers(viewerWidth);
                }
            }
            if (event.data && event.data.action == "onPolylistHighlight") {
                if (viewerWidth >= 768) {
                    this.setHighlight(event.data.polylistName);
                }
            }

            if (event.data && event.data.action == "onPolylistSelection") {
                //  this.changeGarmentView(1);
            }
            if (event.data && event.data.action == "onScreenshots") {
                this.screenshots = event.data.screenshots;
            }
            if (event.data && event.data.action == "onError") {
                console.log(event);
            }
        };
    }
}

```


