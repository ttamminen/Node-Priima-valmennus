var Map = function () {
  var map = {};

  map.initialize = function (sourceKml) {
    var map_canvas = document.getElementById('map-canvas');
    var map_options = {
      zoom: 6,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      draggable: true,
      scaleControl: false,
      mapTypeControl: false,
      panControl: true,
      zoomControl: false
    }
    var mapObj = new google.maps.Map(map_canvas, map_options)
    loadKmlLayer(sourceKml, mapObj);
  }

  /**
   * Adds a KMLLayer based on the URL passed. Clicking on a marker
   * results in the balloon content being loaded into the right-hand div.
   * @param {string} src A URL for a KML file.
   */
  function loadKmlLayer(src, mapObj) {
    var kmlLayer = new google.maps.KmlLayer(src, {
      preserveViewport: false,
      map: mapObj
    });
  }

  return map;
}();