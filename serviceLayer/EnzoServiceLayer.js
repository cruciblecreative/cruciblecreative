/* currently a multitude of scope related issues as I'm forming the function at this point in time */


class Visualizer {
    constructor(iframe) {
        this.iframe = iframe;
        this.screenshots = [];
        this.garmentState = [];
    }

    // This is just part of the visualizer and doesn't need to return anything currently.

    setHighlight = function(highlighedMaterial) {
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
                configurableMaterials: [highlighedMaterial],
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

    // used for when you want to revert everything back to the initial state.
    resetView = function(resetState) {
        var iframe = this.iframe;
        var viewerIframe = iframe.contentWindow;
        viewerIframe.postMessage({
                action: "beginTransaction"
            },
            "*"
        );
        viewerIframe.postMessage({
            action : 'resetMaterials'
        },'*');
        viewerIframe.postMessage({
                action: "endTransaction"
            },
            "*"
        );
        this.update(resetState);
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

        // do a quick check if update is being called when it doesn't need to. 
        // However, both objects must be identical in order, so it may not work with push/pop
        if (JSON.stringify(newState) == JSON.stringify(currentState)) {
            console.log("update called when the current state is already up to date");
            return;
        }

        // run through the options object and trigger functions based the difference from the current state.
        var newStateOptions = newState.garment.options;
        var currentStateOptions = currentState.garment.options;
        
        var newStateOptionsKeys = Object.keys(newStateOptions);
        var currentStateOptionsKeys = Object.keys(currentStateOptions);


        /* 
        Check new object list for (in order):
        - A new key. If new key exists that isn't in the current state, add it.
        - If the key exists but it's VALUE is different, update it.
        - If a key no longer exists, remove it.
        */

        

        // loop through each key
        // if is changed or new, set or add the new option, then trigger the customization.
        newStateOptionsKeys.forEach((newKey, newIndex) => {

            // find if the new key does not currently exist. If this is new, then it will be the new change clicked in the customizer.
            if (currentStateOptionsKeys.indexOf(newKey) == -1) {

                // this should work once the ids match up in Emersya
                this.changeGarmentMaterial(newKey, newStateOptions[newKey]);

                // This should set the key and value
                currentStateOptions[newKey] = newStateOptions[newKey];
            } else {

                // This runs if the key exists. Now we check to see if the value has changed. Like if a customization has been set to a different material.
                // This shouldnt throw a false positive because at this stage we know that the key exists in the object index for sure.
                if (Object.values(currentStateOptions).indexOf(newStateOptions[newKey]) == -1) {
                    this.changeGarmentMaterial(newKey, newStateOptions[newKey]);
                }
            }

            // We need to loop through the current state and remove any from it where it cannot find the equivalent in the new state.
            currentStateOptionsKeys.forEach((currentKey, curIndex) => {
                
                // if the current key index does not exist in the new state. That means something in the customizer has been undone/removed
                if (newStateOptionsKeys.includes(currentKey) == false) {
                    // Will be looking to see how we can implement this through Emersya's API.
                }
            });

        });

        // We want this to happen last.
        this.garmentState = newState;
    }

    // like visualizerEventListener but needs to return where the user clicked.
    subscribe = () => {
        
    }

    init(currentGarment) {
        var viewerIframe = null;
        var viewerActive = false;
        var iframe = this.iframe;
        var viewerWidth = iframe.clientWidth;

        // We will add more to this list as more models are completed.
        var iframeMap = [{
            02: 'RBIMG1MF79',
        }];
        var iframeID = currentGarment.garment.id;

        if (iframeID in iframeMap == true) {
        iframe.src = "https://emersya.com/showcase/" + iframeMap.iframeID;
        }
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
            if (event.data && event.data.action == "onConfigurableMaterialHighlight") {
                if (viewerWidth >= 768) {
                    this.setHighlight(event.data.configurableMaterialsName);
                }
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