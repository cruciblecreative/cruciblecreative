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

As of 7/12/19, Emersya's API has been updated, deprecating some functions. I am in the process of updating functions in this layer that no longer work. Essentially what needed a string before, is now merged into a single API function that takes an array.


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


## Change Garment

Specify the garment's ID. This will be the same ID as the ID provided by Emersya, which we will have set in stone once all the finalised models are added. At this moment in time, the ID used for each garment is not editable.

```javascript

let emersyaID = visualizer.init(garmentID);
```

## Change Garment View

Some garments will have actionable points that will affect the model. An example is a suit jacket being clicked to open and reveal the inner lining.

The function will also call when selecting it in the customizer.

```javascript

var garmentView = visualizer.changeGarmentView(triggerId);
```

## Change Garment Material

*changeGarmentLining has been merged with changeGarmentMaterial*

Since the primary key and customizations of the garment are exclusive to 1 change per part of the garment. 

In the case of something like buttons, if we need to provide a material choice as well as a quantity choice, then use `changeGarmentCustomization` to set the quantity.

```javascript

var garmentMaterial = visualizer.changeGarmentMaterial(display, material);
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

The visualizer functions are all functions that affect the customizer. You can call them if you wish and trigger them manually, but the visualizer will be listening for these events and trigger them automatically.

<div class="warning">You do not need to call this/these function(s).</div>

## Set Highlight

Accepts an array of materials to be highlighted. Pass a single configurable material to highlight only one.

```javascript

visualizer.setHighlight(display);

// This should remove all highlights that were set manually.
visualizer.setHighlight();

```

# Service Layer

<a href="https://github.com/cruciblecreative/cruciblecreative.github.io/blob/master/serviceLayer/EnzoServiceLayer.js" target="_blank">View here</a>


