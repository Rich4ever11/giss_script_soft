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
  const { layer } = props;
  console.log(layer);
  const map = useMap();

  // const bounds = [
  //   [-90, -180],
  //   [90, 180],
  // ];
  // const image = L.imageOverlay(
  //   "https://i.imgur.com/Ion6X7C.jpg",
  //   bounds as LatLngBoundsExpression,
  //   { opacity: 0.1 }
  // ).addTo(map);
  // map.fitBounds(image.getBounds());

  useEffect(() => {
    layer.addTo(map);
    map.setView([0, -70], 3);
    map.setMaxBounds([
      [-90, -180],
      [90, 180],
    ]);

    // map.fitBounds(layer.getBounds());
  }, [layer]);

  return <div></div>;
}

export default ParseRaster;
