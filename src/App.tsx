import React from "react";
import Map from "./components/Maps/Map";
import { Stack, Text } from "@chakra-ui/react";
import ScriptCards from "./components/Cards/ScriptCards";
import NavBar from "./components/Header/NavBar";
import GeoUpload from "./components/Upload/GeoUpload";
import { GeoDataContext } from "./context/GeoDataContext";

function App() {
  return (
    <>
      <GeoDataContext>
        <div>
          <NavBar />
          <GeoUpload />
          <ScriptCards />
          <Map />
        </div>
      </GeoDataContext>
    </>
  );
}

export default App;
