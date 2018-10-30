var platform = new H.service.Platform({
  app_id: "iciTDYa8AcmSBID9hLL8",
  app_code: "eBx_av9-eVK1_oTsSJrhjw"
});

// creando el mapa del mundo como base
var pixelRatio = window.devicePixelRatio || 1;
var defaultLayers = platform.createDefaultLayers({
  tileSize: pixelRatio === 1 ? 256 : 512,
  ppi: pixelRatio === 1 ? undefined : 320
});
// desplegando el mapa del mundo en el elemento html
var map = new H.Map(
  document.getElementById("mapContainer"),
  defaultLayers.normal.map,
  { pixelRatio: pixelRatio }
);

// inicializando elemento para moviemiento
var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
var ui = H.ui.UI.createDefault(map, defaultLayers);

// marcando el centro al inicializar el mapa con mi ubicación actual y un marcador
function moveMapToBerlin(map) {
  //usando la api geolocation de html5 para obtener posicion actual
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const coords = position.coords;
      console.log(coords);
      let lati = coords.latitude;
      let lngt = coords.longitude;
      // icono personalizado
      var svgMarkup =
        "https://www.brilliantlectures.org/wp-content/uploads/2017/12/x-mark.png";
      var iconOptions = {
        /* Tamaño del icono es pixeles*/
        size: new H.math.Size(30, 30)
      };

      // iniciando markador y ubicandolo en el mapa
      var icon = new H.map.Icon(svgMarkup, iconOptions);
      marker = new H.map.Marker({ lat: lati, lng: lngt }, { icon: icon });

      //ubicando centro del mapa con mi ubicación actual
      map.setCenter({ lat: lati, lng: lngt });
      //añadiendo marcador de ubicacion actual
      map.addObject(marker);
      map.setZoom(14);
    });
  }
}
moveMapToBerlin(map);

function UbicarUnLugar(searchText) {
  // $.ajax({
  //   url:
  //     " https://geocoder.api.here.com/6.2/geocode.json?searchtext=Nederland&app_id=iciTDYa8AcmSBID9hLL8&app_code=eBx_av9-eVK1_oTsSJrhjw&gen=9",

  //   success: function(result) {
  //     console.log('successsss', result)
  //   }
  // });

  $.ajax({
    
    url:
      "http://autocomplete.geocoder.api.here.com/6.2/suggest.json?query=" +
      searchText +
      "&app_id=iciTDYa8AcmSBID9hLL8&app_code=eBx_av9-eVK1_oTsSJrhjw",
    success: function(result) {
      if (result.suggestions !== undefined) {
        for (let i = 0; i < result.suggestions.length; i++) {
          var textToSearch = result.suggestions[i].label;
          // lo que se va a ubicar en el mapa
          var geocodingParams = {
            searchText: textToSearch
          };

          // procesando el resultado
          var onResult = function(result) {
            console.log("resulllll", result);
            console.log(result)
            var locations = result.Response.View[0].Result,
              position,
              marker;
            // añadiendo un marcador por cada ubicacion encontrada
            for (i = 0; i < locations.length; i++) {
              position = {
                lat: locations[i].Location.DisplayPosition.Latitude,
                lng: locations[i].Location.DisplayPosition.Longitude
              };
              marker = new H.map.Marker(position);
              map.addObject(marker);
            }
          };

          // inicializando el servicio de geocoding
          var geocoder = platform.getGeocodingService();

          // haciendo la peticion al geocoder con la direccion
          geocoder.geocode(geocodingParams, onResult, function(e) {
            alert(e);
          });
        }
      }
    }
  });
}

$("#geolocalization").on("input", function(event) {
  map.setZoom(0);
  var searchText = $("#geolocalization").val();
  UbicarUnLugar(searchText);
});
