import {
  Text,
  Input,
  InputGroup,
  InputLeftElement,
  Box,
  AbsoluteCenter,
  Image,
  Center,
} from "@chakra-ui/react";
import ScriptCard from "./ScriptCard";
import { FaSearch } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useGeoData } from "../../context/GeoDataContext";

function ScriptCards() {
  const scriptLists = [
    {
      file_name: "Netcdf Resampler",
      author: "Richard Aja",
      description:
        "Preforms an upscale on any netcdf dataset. This requires an input of the variable name that you wish to resample and the new shape",
      libraries: ["xarray", "netcdf", "matplotlib", "os"],
      snippets: "",
      path: "../geo_scripts\\resampler.py",
      modalType: "resample",
    },
  ];

  // const [scripts, setScripts] = useState<any>([]);
  const { fileName } = useGeoData();

  const checkScripts = () => {
    return !(scriptLists.length < 1 || scriptLists == undefined);
  };

  return (
    <>
      <Box backgroundColor={"blackAlpha.900"} paddingY={24} marginY={0.5}>
        {checkScripts() && fileName ? (
          <></>
        ) : (
          <>
            <Center>
              <Box boxSize="sm">
                <Image
                  borderColor={"black"}
                  borderWidth={4}
                  borderRadius={"lg"}
                  marginY={4}
                  src="https://images.unsplash.com/photo-1454789548928-9efd52dc4031?q=80&w=2680&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                />{" "}
              </Box>
            </Center>
          </>
        )}

        <Box position="relative" padding={12}>
          <AbsoluteCenter px="4" rounded={"full"}>
            <Text
              className="font-thin "
              fontSize="6xl"
              textColor={"white"}
              padding={4}
            >
              {checkScripts() && fileName
                ? "Python Scripts"
                : !fileName
                ? "Please Upload File"
                : "No Scripts Available"}
            </Text>
          </AbsoluteCenter>
        </Box>
        {checkScripts() && fileName && (
          <>
            <Box position="relative" h="80px">
              <AbsoluteCenter color="white" axis="both">
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <FaSearch color="white" />
                  </InputLeftElement>
                  <Input
                    type="tel"
                    placeholder="Search Scripts"
                    textColor={"white"}
                    width={"100%"}
                  />
                </InputGroup>
              </AbsoluteCenter>
            </Box>

            <div className="py-2">
              {scriptLists.map(
                (
                  script: {
                    file_name: string;
                    author: string;
                    description: string;
                    libraries: string[];
                    snippets: string;
                    path: string;
                    modalType: string;
                  },
                  index: number
                ) => (
                  <div
                    key={index}
                    className="flex justify-center max-w-full py-2"
                  >
                    <ScriptCard
                      file_name={script.file_name}
                      author={script.author}
                      description={script.description}
                      path={script.path}
                      libraries={""}
                      snippets={""}
                      modalType={script.modalType}
                    ></ScriptCard>
                  </div>
                )
              )}
            </div>
          </>
        )}
      </Box>
    </>
  );
}

export default ScriptCards;
