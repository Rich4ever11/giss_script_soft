import React from "react";
import { LatLngExpression } from "leaflet";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import GeoRasterLayer from "georaster-layer-for-leaflet";
// @ts-ignore
import parseGeoraster from "georaster";

function ParseRaster() {
  const map = useMap();

  fetch("./../../../../../../scripts/test.tif")
    .then((response) => response.arrayBuffer())
    .then((arrayBuffer) => {
      console.log(arrayBuffer.byteLength);
      parseGeoraster(arrayBuffer).then((georaster: any) => {
        console.log("georaster:", georaster);

        /*
              GeoRasterLayer is an extension of GridLayer,
              which means can use GridLayer options like opacity.

              Just make sure to include the georaster option!

              Optionally set the pixelValuesToColorFn function option to customize
              how values for a pixel are translated to a color.

              https://leafletjs.com/reference.html#gridlayer
          */
        // var layer = new GeoRasterLayer({
        //   georaster: georaster,
        //   opacity: 0.7,
        //   pixelValuesToColorFn: (values) =>
        //     values[0] === 42 ? "#ffffff" : "#000000",
        //   resolution: 64, // optional parameter for adjusting display resolution
        // });
        // layer.addTo(map);

        // map.fitBounds(layer.getBounds());
      });
    });

  return <div>ParseRaster</div>;
}

export default ParseRaster;
