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
        backgroundColor={"black"}
        borderWidth={3}
        borderColor={"white"}
      >
        <CardHeader>
          <VStack>
            <Avatar
              borderColor={"cyan.100"}
              borderWidth={4}
              showBorder={true}
              marginY={4}
              size="2xl"
              name="Segun Adebayo"
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXZhdGFyfGVufDB8fDB8fHww"
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
