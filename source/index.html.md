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

// Example currentGarment with data.
const currentGarment = [
    view: {
        combination: "TU0101", 
        component: "T010203",
        latestOptionSelected: "T01020325",
    },
    garment: {
        id: "02",  
        subCategory: "Half Canvas",
        options: {
            fabrics_group: "12107",
            linings_group: "12102",
            "T010203": "T01020325",
        }
    }
]
```


# Instantiating the Visualizer

My understanding is that if the customizer retains settings from previous garments, then reinstantiating the viewer by selecting a new garment will preserve the previous state if the user returns to that garment.

garmentID refers to the unique id stored in the garment object above. This will be referenced with a static object of values to get the correct ID of the iframe on Emersya. 

> To initialize, use this code:

```javascript
const visualizer = new Visualizer(document.querySelector('#emersyaIframe'));

visualizer.init(currentGarment);
```

> '#emersyaIframe' can be whatever you would prefer the id of the iframe to be.

# The Update function

This will be the primary way to interact with the service layer. The update function accepts an object (such as currentGarment above) and compares it to the object currently held in `garmentState` which is set by the visualizer when it was initialized. If the data is structured as it is above, it will be able to find the `options` object in `garment`.

Whether you update `currentGarment` or you pass in a new version, it will attempt to update it's held object values to match the new. 

```javascript

visualizer.update(currentGarment);


```


# Customizer Functions

For when you want to call the functions yourself. Update will utilise these functions automatically, however some functions such as `getGarmentScreenshots` will need to be called manually.

## Change Garment

Specify the garment's ID, which we will have set in stone once all the finalised models are added. At this moment in time, the ID used for each garment is not editable.

```javascript

let emersyaID = visualizer.init(currentGarment);
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

## Reset Viewer to default

Likely not needed, but may be useful. Accepts data of options that have been cleared of customizations.

```javascript
visualizer.resetView(currentGarment);

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


