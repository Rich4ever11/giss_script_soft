import { LatLngExpression } from "leaflet";
import React, { useEffect, useRef, useState } from "react";
import { MapContainer, useMap, TileLayer, Marker, Popup } from "react-leaflet";
import ParseRaster from "./ParseRaster";
import {
  Button,
  Card,
  CardBody,
  Grid,
  Input,
  Select,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useGeoData } from "../../context/GeoDataContext";

import GeoRasterLayer from "georaster-layer-for-leaflet";
var parse_georaster = require("georaster");
const { Buffer } = require("buffer");
// var writeFile = require("fs");

function Map() {
  const [layer, setLayer] = useState<any>(null);
  const [clearMap, setClearMap] = useState<any>(false);
  const { fileName, netcdfData } = useGeoData();

  useEffect(() => {
    console.log(fileName);
    if (fileName) {
      if (netcdfData.variables) {
        const initVarName = netcdfData.variables[0].name;
        handleVarSelectionChange(initVarName);
      }
    }
  }, [fileName]);

  const handleVarSelectionChange = (varName: string) => {
    if (varName) {
      fetch("http://127.0.0.1:5000/get_geotiff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          variable_name: varName,
        }),
      })
        .then(async (res) => {
          const value = await res.arrayBuffer();
          console.log(value);
          parse_georaster(value).then((georaster: any) => {
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
        })
        .catch((error) => {
          console.log("[-] Failed to upload file");
        });
      console.log(varName);
    }
  };

  function readFileDataAsBase64(e: any) {
    const file = e.target.files[0];
    var reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = async function () {
      const arrayBuffer = reader.result;
      parse_georaster(arrayBuffer).then((georaster: any) => {
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

  const clearMapCode = () => {
    return (
      <Stack direction="row" spacing={4} align="center" py={2}>
        <Button
          backgroundColor={"black"}
          color={"white"}
          variant="outline"
          size="lg"
          onClick={() => setClearMap(!clearMap)}
        >
          Clear Map
        </Button>
      </Stack>
    );
  };

  return (
    <>
      {fileName ? (
        <>
          <Grid justifyContent={"center"} backgroundColor={"blackAlpha.900"}>
            {clearMapCode()}
          </Grid>
          <Select
            size={"lg"}
            onChange={(event) => handleVarSelectionChange(event.target.value)}
            bg="black"
            color="white"
          >
            {netcdfData.variables.map(
              (
                variable: { name: string; dimensions: number[] },
                index: number
              ) => (
                <option
                  value={variable.name}
                  key={index}
                  style={{ color: "black", backgroundColor: "black" }}
                >
                  {variable.name}
                </option>
              )
            )}
          </Select>
        </>
      ) : (
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
          {clearMapCode()}

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
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload Geotiff</span>{" "}
                  or drag and drop
                </p>
              </div>
              <input
                id="dropzone-file"
                type="file"
                className="hidden"
                accept=".tif"
                onChange={readFileDataAsBase64}
              />
            </label>
          </div>
        </Card>
      )}
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
        {layer && <ParseRaster layer={layer} mapClearTrigger={clearMap} />}
      </MapContainer>
    </>
  );
}

export default Map;
