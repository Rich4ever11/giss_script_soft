import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  Input,
  ModalFooter,
  Button,
  Select,
} from "@chakra-ui/react";
import React from "react";

function ScriptModal(props: {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  const { isOpen, onOpen, onClose } = props;

  const variables = [
    "burned area",
    "BA",
    "emissions of CO2n",
    "CO2n_emis_pyrE",
    "CO2_GFED",
    "lightning",
    "Flashrate",
    "C2G",
  ];

  return (
    <div>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bgColor={"black"}>
          <ModalHeader textColor={"white"}>Input Parameters</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel textColor={"white"}>Geo Variable</FormLabel>
              <select
                id="countries"
                className="bg-black border border-black text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-black dark:border-white dark:placeholder-black dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option selected>
                  {(variables && "Select Geo Variable") || "No Geo Variables"}
                </option>
                {variables.map((variable, index) => (
                  <option key={index} value={variable} color="black">
                    {variable}
                  </option>
                ))}
              </select>
            </FormControl>

            <FormControl mt={4}>
              <FormLabel textColor={"white"}>File Name</FormLabel>
              <Input placeholder="File Name" textColor={"white"} />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3}>
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default ScriptModal;
