---
title: API Reference

language_tabs: # must be one of https://git.io/vQNgJ
  - javascript

search: true
---

# Introduction

Hi Scott, Harry and Crucible Team. Here's some documentation about the service layer of the Enzo project.

Some of the snippet examples use an object similar to that of what you have outlined.

```javascript
var garment = {
  viewerID: ID,
  garment: GARMENTS.SUIT_JACKET,
	material: MATERIALS.TWEED_5,
	elements: [
		{
			element: LAPEL,
			variation: WIDE,
		},
  ],
};
```

# Instantiating the Visualizer

My understanding is that if the customizer retains settings from previous garments, then reinstantiating the viewer by selecting a new garment will preserve the previous state if the user returns to that garment.

> To initialize, use this code:

```javascript
const visualizer = new Visualizer();

let emersyaID = visualizer.init(garment.viewerID);
```

> 'viewerID' feeds into the iframe URL. 


<!-- <aside class="notice">
You must replace <code>meowmeowmeow</code> with your personal API key.
</aside> -->

# Customizer Functions

changeGarment - e.g. jacket, trousers, etc.
- changeGarmentView - e.g. jacket default, jacket open/lining, jacket zoom level, etc.
- changeGarmentFabric
- changeGarmentLining
- onClick - to respond to hotspots
- changeGarmentCustomization

## Change Garment

To be added. Will change the viewer.

```javascript

let emersyaID = visualizer.init(garment.viewerID);
```

> Presumably it will be a reinstantiation with a different ID. If garment state needs to at all be preserved by this service layer, let me know.

## Change Garment View

Some garments will have actionable points that will affect the model. An example is a suit jacket being clicked to open and reveal the inner lining.

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

```

## Change Garment Customization

To change the garment's variant of the part of the garment. E.g. changing the width of the lapel.

This will most likely occur after the user has clicked the garment and triggered garmentView to zoom in and also reveal the options in the customizer.

```javascript

var garmentCustomization = visualizer.changeGarmentCustomization(garment.elements.element, garment.elements.variation);
```

# Visualizer Functions

The visualizer functions are all functions that affect the customizer. This can happen by clicking a highlighted part of the model. 




