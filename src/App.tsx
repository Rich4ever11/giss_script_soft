import React from "react";
import Map from "./components/Maps/Map";
import { Stack, Text } from "@chakra-ui/react";
import ScriptCards from "./components/Cards/ScriptCards";
import NavBar from "./components/Header/NavBar";

function App() {
  return (
    <div>
      <NavBar />
      <ScriptCards />
      <Map />
    </div>
  );
}

export default App;
