import {
  SimpleGrid,
  Card,
  CardHeader,
  Heading,
  CardBody,
  CardFooter,
  Button,
  Text,
  Input,
  InputGroup,
  InputLeftElement,
  Box,
  Divider,
  AbsoluteCenter,
  Center,
} from "@chakra-ui/react";
import ScriptCard from "./ScriptCard";
import { FaSearch } from "react-icons/fa";

function ScriptCards() {
  const scriptLists = [
    {
      file_name: "Upscale GFED5 Data",
      author: "Richard Aja",
      description:
        "Preforms an upscale of the GFED5 data sample. Preforming an upscale of 720x1440 to 90x144",
      libraries: ["xarray", "netcdf", "matplotlib", "os"],
      snippets: "",
    },
  ];

  return (
    <>
      <Box backgroundColor={"blackAlpha.900"} paddingY={4}>
        <Box position="relative" padding="10">
          <Divider />
          <AbsoluteCenter bg="blackAlpha.700" px="4" rounded={"full"}>
            <Text fontSize="4xl" textColor={"white"} padding={4}>
              Python Scripts
            </Text>
          </AbsoluteCenter>
        </Box>

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

        <div className="flex overflow-x-auto p-2">
          {scriptLists.map((script: any) => (
            <div>
              <ScriptCard
                file_name={script.file_name}
                author={script.author}
                description={script.description}
                libraries={script.libraries}
                snippets={script.snippets}
              ></ScriptCard>
            </div>
          ))}
        </div>
      </Box>
    </>
  );
}

export default ScriptCards;
