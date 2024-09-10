import { LatLngExpression } from "leaflet";
import React, { useState } from "react";
import { MapContainer, useMap, TileLayer, Marker, Popup } from "react-leaflet";
import ParseRaster from "./ParseRaster";
import { Input } from "@chakra-ui/react";
import GeoRasterLayer from "georaster-layer-for-leaflet";
var parse_georaster = require("georaster");

function Map() {
  const [layer, setLayer] = useState<any>(null);

  function readFileDataAsBase64(e: any) {
    const file = e.target.files[0];

    var reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = function () {
      const arrayBuffer = reader.result;
      parse_georaster(arrayBuffer).then((georaster: any) => {
        /*
              GeoRasterLayer is an extension of GridLayer,
              which means can use GridLayer options like opacity.
              Just make sure to include the georaster option!
              Optionally set the pixelValuesToColorFn function option to customize
              how values for a pixel are translated to a color.
              https://leafletjs.com/reference.html#gridlayer
          */
        var new_layer = new GeoRasterLayer({
          georaster: georaster,
          opacity: 0.5,
          // pixelValuesToColorFn: (values) =>
          //   values[0] === 42 ? "#ffffff" : "#000000",
          resolution: 64,
        });
        setLayer(new_layer);
      });
    };
  }

  return (
    <>
      <Input
        placeholder="Input GeoFile"
        type="file"
        onChange={readFileDataAsBase64}
      />
      <MapContainer
        center={[51.505, -0.09]}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: "100vh", width: "100wh" }}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[51.505, -0.09]}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
        {layer && <ParseRaster layer={layer} />}
      </MapContainer>
    </>
  );
}

export default Map;
