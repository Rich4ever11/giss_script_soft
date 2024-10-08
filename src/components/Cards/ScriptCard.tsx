import {
  SimpleGrid,
  Card,
  CardHeader,
  Heading,
  CardBody,
  CardFooter,
  Button,
  Text,
  Grid,
  GridItem,
  useDisclosure,
  Avatar,
  Divider,
  VStack,
  Box,
} from "@chakra-ui/react";
import ResampleScriptModal from "./ResampleScriptModal";
import { FaRocket } from "react-icons/fa6";

function ScriptCard(props: {
  file_name: any;
  author: any;
  description: any;
  libraries: any;
  snippets: any;
  modalType: any;
  path: string;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    modalType,
    file_name,
    author,
    description,
    path,
    libraries,
    snippets,
  } = props;

  const handleModalType = () => {
    switch (modalType) {
      case "resample":
        return (
          <ResampleScriptModal
            isOpen={isOpen}
            onOpen={onOpen}
            onClose={onClose}
            filePath={path}
          />
        );
      default:
        return <></>;
    }
  };

  return (
    <>
      <Card
        width={"100%"}
        backgroundColor={"gray.900"}
        borderColor={"white"}
        maxW={"max-content"}
        borderWidth={2}
      >
        <CardHeader>
          <VStack>
            <Avatar
              borderColor={"gray.300"}
              borderWidth={4}
              showBorder={true}
              marginY={4}
              size="2xl"
              name="Segun Adebayo"
              src="https://images.unsplash.com/photo-1541873676-a18131494184?q=80&w=2636&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            />{" "}
            <Heading
              className="font-thin"
              size="2xl"
              textColor={"white"}
              fontWeight={200}
            >
              {file_name}
            </Heading>
            <Text fontSize="xl" textColor={"white"} fontWeight={400}>
              {author}
            </Text>
          </VStack>
        </CardHeader>
        <div className="flex justify-center">
          <Divider orientation="horizontal" color={"white"} width={96} />{" "}
        </div>
        <CardBody>
          <Text textColor={"white"}>{description}</Text>
        </CardBody>
        <CardFooter>
          <Button
            onClick={onOpen}
            variant="outline"
            textColor={"white"}
            _hover={{
              background: "white",
              textColor: "black",
            }}
          >
            <FaRocket className="mr-3" />
            Run Script
          </Button>

          {handleModalType()}
        </CardFooter>
      </Card>
    </>
  );
}

export default ScriptCard;
