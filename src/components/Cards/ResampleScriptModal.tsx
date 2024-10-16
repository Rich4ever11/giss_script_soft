import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  Box,
  ModalFooter,
  Button,
  SimpleGrid,
  Text,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Stack,
  Input,
  Select,
} from "@chakra-ui/react";
import { useState } from "react";
import { useGeoData } from "../../context/GeoDataContext";

function ScriptModal(props: {
  isOpen: boolean;
  filePath: string;
  onOpen: () => void;
  onClose: () => void;
}) {
  const [shapeHeight, setShapeHeight] = useState(90);
  const [shapeWidth, setShapeWidth] = useState(144);
  const [variableName, setVariableName] = useState<string>("");
  const { fileName, netcdfData } = useGeoData();
  const { isOpen, onClose } = props;

  const handleCodeExecution = async () => {
    const data = {
      height: shapeHeight,
      width: shapeWidth,
      filePath: props.filePath,
      variableName: variableName,
    };

    const result = await fetch("http://127.0.0.1:5000/run_script", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const value = await result.arrayBuffer();
    const blob = new Blob([value], { type: "application/netcdf" });
    const url = URL.createObjectURL(blob);
    const window_val = window.open(url, "value");
  };

  return (
    <div>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent
          bgColor={"black"}
          border={"white"}
          borderWidth={2}
          borderStyle={"solid"}
        >
          <ModalHeader textColor={"white"}>Input Parameters</ModalHeader>
          <ModalCloseButton color={"white"} />
          <ModalBody pb={6}>
            <FormControl>
              <Box className="pb-2">
                <Text color="white">Variable Name</Text>
              </Box>
              <Select
                size={"lg"}
                onChange={(event: any) => setVariableName(event.target.value)}
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

              <SimpleGrid columns={2} className="pt-4 pb-2">
                <Box>
                  <Text color="white">Shape Height</Text>
                </Box>
                <Box>
                  <Text color="white">Shape Height</Text>
                </Box>
              </SimpleGrid>
              <Stack shouldWrapChildren direction="row">
                <NumberInput
                  size="lg"
                  value={shapeHeight}
                  maxW={48}
                  defaultValue={15}
                  min={10}
                  textColor={"white"}
                  onChange={(valueString) =>
                    setShapeHeight(parseInt(valueString))
                  }
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper color={"white"} />
                    <NumberDecrementStepper color={"white"} />
                  </NumberInputStepper>
                </NumberInput>

                <NumberInput
                  size="lg"
                  value={shapeWidth}
                  maxW={48}
                  defaultValue={15}
                  min={10}
                  textColor={"white"}
                  onChange={(valueString) =>
                    setShapeWidth(parseInt(valueString))
                  }
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper color={"white"} />
                    <NumberDecrementStepper color={"white"} />
                  </NumberInputStepper>
                </NumberInput>
              </Stack>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="green"
              mr={3}
              variant={"outline"}
              onClick={handleCodeExecution}
            >
              Run Script
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default ScriptModal;
