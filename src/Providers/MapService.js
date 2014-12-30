EsriLeafletGeocoding.Controls.Geosearch.Providers.MapService = L.esri.Services.MapService.extend({
  options: {
    layers: [0],
    label: 'Map Service',
    bufferRadius: 1000,
    maxResults: 5,
    formatSuggestion: function(feature){
      return feature.properties[feature.displayFieldName] + ' <small>' + feature.layerName + '</small>';
    }
  },
  initialize: function(url, options){
    L.esri.Services.MapService.prototype.initialize.call(this, url, options);
    this._getIdFields();
  },
  suggestions: function(text, bounds, callback){
    var request = this.find().text(text).returnGeometry(false).layers(this.options.layers);

    return request.run(function(error, results, raw){
      var suggestions = [];
      if(!error){
        var count = Math.min(this.options.maxResults, results.features.length);
        raw.results = raw.results.reverse();
        for (var i = 0; i < count; i++) {
          var feature = results.features[i];
          var result = raw.results[i];
          var layer = result.layerId;
          var idField = this._idFields[layer];
          feature.layerId = layer;
          feature.layerName = result.layerName;
          feature.foundFieldName = result.foundFieldName;
          feature.displayFieldName = result.displayFieldName;
          if(idField && layer){
            suggestions.push({
              text: this.options.formatSuggestion.call(this, feature),
              magicKey: result.attributes[idField] + ':' + layer
            });
          }
        }
      }
      callback(error, suggestions.reverse());
    }, this);
  },
  results: function(text, key, bounds, callback){
    var results = [];
    var request;

    if(key){
      var featureId = key.split(':')[0];
      var layer = key.split(':')[1];
      request = this.query().layer(layer).featureIds(featureId);
    } else {
      request = this.find().text(text).contains(false).layers(this.options.layers);
    }

    return request.run(function(error, features){
      if(!error){
        for (var i = 0; i < features.features.length; i++) {
          var feature = features.features[i];
          if(feature){
            var bounds = this._featureBounds(feature);
            var result = {
              latlng: bounds.getCenter(),
              bounds: bounds,
              text: this.options.formatSuggestion.call(this, feature),
              properties: feature.properties
            };
            results.push(result);
          }
        }
      }
      callback(error, results.reverse());
    }, this);
  },
  _featureBounds: function(feature){
    var geojson = L.geoJson(feature);
    if(feature.geometry.type === 'Point'){
      var center = geojson.getBounds().getCenter();
      return new L. Circle(center, this.options.bufferRadius).getBounds();
    } else {
      return geojson.getBounds();
    }
  },
  _layerMetadataCallback: function(layerid){
    return L.Util.bind(function(error, metadata){
      for (var i = 0; i < metadata.fields.length; i++) {
        var field = metadata.fields[i];
        if(field.type === 'esriFieldTypeOID'){
          this._idFields[layerid] = field.name;
          break;
        }
      }
    }, this);
  },
  _getIdFields: function(){
    this._idFields = {};
    for (var i = 0; i < this.options.layers.length; i++) {
      var layer = this.options.layers[i];
      this.get(layer, {}, this._layerMetadataCallback(layer));
    }
  }
});