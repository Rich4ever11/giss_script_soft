import { LatLngExpression } from "leaflet";
import React, { useState } from "react";
import { MapContainer, useMap, TileLayer, Marker, Popup } from "react-leaflet";
import ParseRaster from "./ParseRaster";
import { Card, CardBody, Input, Text } from "@chakra-ui/react";
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
        console.log(georaster);
        var new_layer = new GeoRasterLayer({
          georaster: georaster,
          opacity: 0.5,
          pixelValuesToColorFn: function (values) {
            return `rgb(${10 * values[0]}, 0, 0)`;
          },
          resolution: 64,
        });
        setLayer(new_layer);
      });
    };
  }

  return (
    <>
      <Card
        align="center"
        backgroundColor={"blue.900"}
        color={"black"}
        bgGradient="linear(black 0%, black 5%, blue.900 50%)"
        rounded={"none"}
      >
        <CardBody>
          <Text fontSize="5xl" textColor={"white"} fontWeight={2}>
            Upload GeoTiff Data
          </Text>
        </CardBody>
        <div className="flex items-center justify-center w-full">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-black border-dashed rounded-lg cursor-pointer bg-black dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 16"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                />
              </svg>
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                SVG, PNG, JPG or GIF (MAX. 800x400px)
              </p>
            </div>
            <input
              id="dropzone-file"
              type="file"
              className="hidden"
              onChange={readFileDataAsBase64}
            />
          </label>
        </div>
      </Card>
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
