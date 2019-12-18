/* currently a multitude of scope related issues as I'm forming the function at this point in time */


class Visualizer {
    constructor(iframe) {
        this.iframe = iframe;
        this.screenshots = [];
        this.garmentState = [];
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
                action: "setHighlight",
                meshes : [],
                configurableMaterials: [polylist],
                configurableMaterialGroups : []
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
                action: "setMaterials",
                materials: [{
                    materialVariation : material,
		            configurableMaterial : display
                }]
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

    update(newCustomizerState) {
        // We want to take the updated state and compare it with that stored in garmentState.
        var newState = newCustomizerState;
        var currentState = this.garmentState;

        // run through the options object and trigger functions based the difference from the current state. It should be a single new options value added or removed.
        var newStateOptions = newState.garment.options;
        var currentStateOptions = currentState.garment.options;

        /* 
        Check new object list for (in order):
        - A new key. If new key exists that isn't in the current state, add it.
        - If the key exists but it's VALUE is not different, update it.
        - If a key no longer exits, remove it.
        */

        // If key is changed or new, set or add the new option, then trigger the customization.
        Object.keys(newStateOptions).forEach((newOption, index) => {
            if (newOption == currentStateOptions[index]) {}
            if (newOption != currentStateOptions[index]) {}
        });



        // We want this to happen last.
        // this.garmentState = newState;
    }

    init(garmentID, currentGarment) {
        var viewerIframe = null;
        var viewerActive = false;
        var iframe = this.iframe;
        var viewerWidth = iframe.clientWidth;

        // We will add more to this list as more models are completed.
        var iframeMap = [{
            02: 'RBIMG1MF79',
        }];
        var iframeID = iframeMap[garmentID];

        iframe.src = "https://emersya.com/showcase/" + iframeID;

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
            // add the initial state to the visualizer
            this.garmentState = currentGarment;
        };

        // This is how emersya prefers it's listener structured
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