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
} from "@chakra-ui/react";
import { useState } from "react";

function ScriptModal(props: {
  isOpen: boolean;
  filePath: string;
  onOpen: () => void;
  onClose: () => void;
}) {
  const [shapeHeight, setShapeHeight] = useState(90);
  const [shapeWidth, setShapeWidth] = useState(144);
  const { isOpen, onClose } = props;

  const handleCodeExecution = () => {
    const data = {
      height: shapeHeight,
      width: shapeWidth,
      filePath: props.filePath,
    };

    fetch("http://127.0.0.1:5000/run_script", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    onClose();
    console.log(data);
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
              <SimpleGrid columns={2}>
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
