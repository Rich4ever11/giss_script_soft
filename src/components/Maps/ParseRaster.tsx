// @ts-nocheck
import React from "react";
import { useEffect } from "react";
import { LatLngBoundsExpression, LatLngExpression } from "leaflet";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import GeoRasterLayer from "georaster-layer-for-leaflet";
// @ts-ignore
import parseGeoraster from "georaster";
import L from "leaflet";
var parse_georaster = require("georaster");

function ParseRaster(props) {
  const { layer, mapClearTrigger } = props;
  const map = useMap();

  const handleMapClear = () => {
    map.eachLayer(function (layer) {
      if (layer?.sourceType === "ArrayBuffer") map.removeLayer(layer);
    });
  };

  useEffect(() => {
    //clears previous geo data layer
    handleMapClear();
    layer.addTo(map);
    map.setView([0, -70], 3);
    map.setMaxBounds([
      [-90, -180],
      [90, 180],
    ]);
  }, [layer, mapClearTrigger]);

  useEffect(() => {
    //clears previous geo data layer
    handleMapClear();
    map.setView([0, -70], 3);
    map.setMaxBounds([
      [-90, -180],
      [90, 180],
    ]);
  }, [mapClearTrigger]);

  return <div></div>;
}

export default ParseRaster;
