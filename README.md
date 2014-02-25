# Esri Leaflet Geocoder

The Esri Leaflet Geocoder is a small series of API helpers and UI controls to interact with the ArcGIS Online geocoding services.

**Currently Esri Leaflet Geocoder is in development and should be thoguht of as a beta or preview**

Despite sharing a name and a namespace with Esri Leaflet, Esri Leaflet Geocoder **does not** require Esri Leaflet. It is however tested with Esri Leaflet and will work just fine with or without it.

## Example

Take a look at the live demo at http://esri.github.io/esri-leaflet-geocoder/

![Example Image](https://raw.github.com/esri/esri-leaflet-geocoder/master/example.png)

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Esri Leaflet Geocoder</title>

    <!-- Load Leaflet from their CDN -->
    <link rel="stylesheet" href="http://cdn.leafletjs.com/leaflet-0.7.2/leaflet.css" />
    <script src="http://cdn.leafletjs.com/leaflet-0.7.2/leaflet-src.js"></script>

    <!-- Make the map fill the entire page -->
    <style>
      #map {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
      }
    </style>

    <script src="dist/esri-leaflet-geocoder.js"></script>
    <link rel="stylesheet" href="dist/esri-leaflet-geocoder.css" />

  </head>
  <body>

    <div id="map"></div>
    <script>
      var map = L.map('map').setView([45.5165, -122.6764], 12);

      var tiles = L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

      // create the geocoding control and add it to the map
      var searchControl = new L.esri.Controls.Geosearch().addTo(map);

      // create an empty layer group to store the results and add it to the map
      var results = new L.LayerGroup().addTo(map);

      // listen for the results event and add every result to the map
      searchControl.on("results", function(data){
        results.clearLayers();
        for (var i = data.results.length - 1; i >= 0; i--) {
          results.addLayer(L.marker(data.results[i].latlng));
        };
      });

      searchControl.on("error", function(e){
        console.log(e);
      });
    </script>
  </body>
</html>
```

## L.esri.Controls.Geosearch

### Constructor

**Extends** [`L.Control`](http://leafletjs.com/reference.html#control)

Constructor | Options | Description
--- | --- | ---
`new L.esri.Controls.Geosearch(options)`<br>`L.esri.Controls.geosearch(options)` | [`<GeosearchOptions>`](#options) | Creates a new Geosearch control.

### Options

Option | Type | Default | Description
--- | --- | --- | ---
`position` | `String` | `topleft` | One of the valid Leaflet [control positions](http://leafletjs.com/reference.html#control-positions).
`zoomToResult` | `Boolean` | `true` | If `true` the map will zoom the result after geocoding is complete.
`useMapBounds` | `Boolean` or <br> `Integer` | `11` | Determines if and when the geocoder should begin using the bounds of the map to enchance search results. If `true` the geocoder will always return results in the current map bounds. If `false` it will always search the world. If an integer like `11` is passed in the geocoder will use the bounds of the map for searching if the map is at a zoom level equal to or greater than the integer. This mean the geocoder will prefer local results when the map is zoomed in.
`collapseAfterResult` | `Boolean` | `true` | If the geocoder is expanded after a result this will collapse it.
`expanded` | `Boolean` | `true` | Start the control in an expanded state.
`maxResults` | `Integer` | `25` | The maximum number of results to return from a geocoding request. Max is 50.

### Methods

Method | Options | Description
--- | --- | ---
`clear()` | `null` | Clears the text currently in the geocoder and collapses it if `collapseAfterResult` is true.

### Events

Event | Data | Description
--- | --- | ---
`load` | `null` | A generic event fired when a request to the geocoder starts.
`loading` | `null` | A generic event fired when a request to the geocoder finished.
`results` | [`<ResultsEvent>`](#results-event) | Fired when a result is returned from the geocoder.
`error` | [`ErrorEvent`](#error-event) | Fired when the geocoding service returns an error.

### Styling
For reference here is the internal structure of the geocoder...

```html
<div class="geocoder-control leaflet-control">

  <input class="geocoder-control-input leaflet-bar">

  <ul class="geocoder-control-suggestions leaflet-bar">
    <li class="geocoder-control-suggestion geocoder-control-selected">The Selected Result</li>
    <li class="geocoder-control-suggestion">Another Result</li>
  </ul>
</div>
```

#### Results Event

Property | Type | Description
--- | --- | ---
`bounds` | [`L.LatLngBounds`](http://leafletjs.com/reference.html#latlngbounds)| The bounds arround this suggestion. Good for zooming to results like cities and states.
`latlng` | [`L.LatLng`](http://leafletjs.com/reference.html#latlng)| The center of the result.
`results` | [`[<ResultObject>]`](#result-object) | An array of [result objects](#result-object).

#### Result Object

A single result from the geocoder. You should not rely on all these properties being present in every result object.

Property | Type | Description
--- | --- | ---
`text` | `String` | The text that was passed to the geocoder.
`bounds` | [`L.LatLngBounds`](http://leafletjs.com/reference.html#latlngbounds)| The bounds arround this suggestion. Good for zooming to results like cities and states.
`latlng` | [`L.LatLng`](http://leafletjs.com/reference.html#latlng)| The center of the result.
`name` | `String` | Name of the geocoded place. Usually something like "Paris" or "Starbucks".
`match` | `String` | What was matched internally in the geocoder. Cooresponded to the [`Addr_type`](http://resources.arcgis.com/en/help/arcgis-rest-api/#/Service_output/02r300000017000000/) field in the geocoding service.
`country` | `String` | The country the geocoded place is located in.
`region` | `String` | The largest administrative area for a country that the geocoded palce is in, typically a state or province.
`subregion` | `String` | The next largest administrative area for a the geocoded place, typically a county or region.
`city` | `String` | The city the geocoded place is located in.
`address` | `String` | Complete address returned for the geocoded place. The format is based on address standards for the country within which the address is located.

## L.esri.Services.Geocoding
A basic wrapper for ArcGIS Online geocoding services. Used internally by `L.esri.Controls.Geosearch`.

### Constructor

Constructor | Options | Description
--- | --- | ---
`new L.esri.Services.Geocoding(options)`<br>`L.esri.Controls.geosearch(options)` | [`<GeosearchOptions>`](#options-1) | Creates a new Geosearch control.

### Options

Option | Type | Default | Description
--- | --- | --- | ---
`url` | `String` | `<WorldGeocodeServiceURL>` | Defaults to the ArcGIS World Geocoding service.
`outFields`| `String` | "Subregion, Region, PlaceName, Match_addr, Country, Addr_type, City, Place_addr" | The fields from the service that you would like returned.

### Methods

Method | Options | Description
--- | --- | ---
`geocode(text, object, callback)` | [`<GeocodeOptions>`](#geocode-options) | Geocodes the specified `text` with the passed [`<GeocodeOptions>``](#geocode-options). `callback` will be called `response` as the first parameter.
`suggest(text, object, callback)` | [`<SuggestOptions>`](#geocode-options) | Suggests results for `text` with the given [`<SuggestOptions>`](#suggest-options). `callback` will be called with `response` as the first parameter.

### Events

Event | Data | Description
--- | --- | ---
`load` | `null` | A generic event fired when a request to the geocoder begins.
`loading` | `null` | A generic event fired when a request to the geocoder is finished.

#### Geocode Options

The `geocode` method can accept any options from the [Geocode service](http://resources.arcgis.com/en/help/arcgis-rest-api/#/Single_input_field_geocoding/02r300000015000000/) with the exception of `text`.

#### Suggest Options

The `suggest` method can accept any options from the [Suggest service](http://resources.arcgis.com/en/help/arcgis-rest-api/#/Working_with_suggestions/02r300000238000000/) with the exception of `text`.

## Development Instructions

1. [Fork and clone Esri Leaflet Geocoder](https://help.github.com/articles/fork-a-repo)
2. `cd` into the `esri-leaflet-geocoder` folder
5. Instal the dependancies with `npm install`
5. The example at `/index.html` should work
6. Make your changes and create a [pull request](https://help.github.com/articles/creating-a-pull-request)

## Dependencies

Despite sharing a name and a namespace the Esri Leaflet Geocoder **does not** require Esri Leaflet. It only requires [Leaflet](http://leaflet.com).

## Resources

* [Geocoding Service Documentation](http://resources.arcgis.com/en/help/arcgis-rest-api/#/Single_input_field_geocoding/02r300000015000000/)
* [ArcGIS for Developers](http://developers.arcgis.com)
* [ArcGIS REST Services](http://resources.arcgis.com/en/help/arcgis-rest-api/)
* [twitter@esri](http://twitter.com/esri)

## Issues

Find a bug or want to request a new feature?  Please let us know by submitting an issue.

## Contributing

Esri welcomes contributions from anyone and everyone. Please see our [guidelines for contributing](https://github.com/esri/contributing).

## Terms and Conditions

In order the use the ArcGIS Online Geocoding Service you should signup for an [ArcGIS for Developers account](https://developers.arcgis.com/en/plans) or purchase an [ArcGIS Online Organizational Subscription](http://www.arcgis.com/features/plans/pricing.html).

1. Once you have an account you are good to go. Thats it!
2. Your users can search for as many places as they want. Esri defines this as "Geosearch" and its free. You only consume credits when you want to store the result of geocodes.
3. You are not allowed to store the results of any geocoding you do. There is a `forStorage` flag which you can set that will allow this. There is an [issue](https://github.com/Esri/esri-leaflet-geocoder/issues/10) for including the `forStorage` flag
4. If you use this library in a revenue generating application or for goverment use you must upgrade to a paid account. You are not allowed to generate revenue while on a free plan.

This information is from the [ArcGIS for Developers Terms of Use FAQ](https://developers.arcgis.com/en/terms/faq/) and the [ArcGIS Online World Geocoder documentation](http://resources.arcgis.com/en/help/arcgis-rest-api/#/Single_input_field_geocoding/02r300000015000000/)

## Licensing
Copyright 2013 Esri

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

> http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

A copy of the license is available in the repository's [license.txt]( https://raw.github.com/Esri/esri-leaflet-geocoder/master/license.txt) file.

[](Esri Tags: ArcGIS Web Mapping Leaflet Geocoding)
[](Esri Language: JavaScript)
