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

function ScriptCards() {
  // const scriptLists = [
  //   {
  //     file_name: "Upscale GFED5 Data",
  //     author: "Richard Aja",
  //     description:
  //       "Preforms an upscale of the GFED5 data sample. Preforming an upscale of 720x1440 to 90x144",
  //     libraries: ["xarray", "netcdf", "matplotlib", "os"],
  //     snippets: "",
  //   },
  // ];

  const [scripts, setScripts] = useState<any>([]);

  const checkScripts = () => {
    return !(scripts.length < 1 || scripts == undefined);
  };

  console.log(scripts);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/view_scripts", {})
      .then(async (res) => {
        const result = await res.json();
        setScripts(result.data);
        console.log(result);
      })
      .catch((error) => {
        console.log(`[-] Failed to obtain files file`);
      });
  }, []);

  return (
    <>
      <Box backgroundColor={"blackAlpha.900"} paddingY={4}>
        {checkScripts() ? (
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
              fontSize="4xl"
              textColor={"white"}
              padding={4}
            >
              {checkScripts() ? "Python Scripts" : "No Scripts Available"}
            </Text>
          </AbsoluteCenter>
        </Box>
        {checkScripts() && (
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

            <div className="flex overflow-x-auto p-2">
              {scripts.map((script: any) =>
                Object.keys(script).map((key, index: number) => (
                  <div key={index}>
                    <ScriptCard
                      file_name={script[key].Title}
                      author={script[key].Author}
                      description={script[key].Description}
                      libraries={""}
                      snippets={""}
                    ></ScriptCard>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </Box>
    </>
  );
}

export default ScriptCards;
