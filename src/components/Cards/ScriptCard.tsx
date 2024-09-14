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
} from "@chakra-ui/react";
import ScriptModal from "./ScriptModal";
import { FaRocket } from "react-icons/fa6";

function ScriptCard(props: {
  file_name: any;
  author: any;
  description: any;
  libraries: any;
  snippets: any;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { file_name, author, description, libraries, snippets } = props;

  return (
    <>
      <Card
        width={"35vh"}
        marginX={4}
        backgroundColor={"gray.900"}
        borderWidth={3}
        borderColor={"white"}
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
            <Heading className="font-thin" size="xl" textColor={"white"}>
              {file_name}
            </Heading>
            <Text size="lg" textColor={"white"}>
              {author}
            </Text>
          </VStack>
        </CardHeader>
        <Divider orientation="horizontal" color={"white"} />{" "}
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
        </CardFooter>
      </Card>

      <ScriptModal isOpen={isOpen} onOpen={onOpen} onClose={onClose} />
    </>
  );
}

export default ScriptCard;
