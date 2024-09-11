import React from "react";
import Map from "./components/Maps/Map";
import { Stack, Text } from "@chakra-ui/react";
import ScriptCards from "./components/Cards/ScriptCards";
import NavBar from "./components/Header/NavBar";
import GeoUpload from "./components/Upload/GeoUpload";

function App() {
  return (
    <div>
      <NavBar />
      <GeoUpload />
      <ScriptCards />
      <Map />
    </div>
  );
}

export default App;
