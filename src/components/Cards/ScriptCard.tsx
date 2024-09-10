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
} from "@chakra-ui/react";
import ScriptModal from "./ScriptModal";

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
      <Card width={"35vh"} marginX={4} backgroundColor={"black"}>
        <CardHeader>
          <Avatar
            borderColor={"cyan.100"}
            showBorder={true}
            marginY={4}
            size="xl"
            name="Segun Adebayo"
            src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXZhdGFyfGVufDB8fDB8fHww"
          />{" "}
          <Heading size="md" textColor={"white"}>
            {file_name}
          </Heading>
          <Text size="xs" textColor={"white"}>
            {author}
          </Text>
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
            Run Script
          </Button>
        </CardFooter>
      </Card>

      <ScriptModal isOpen={isOpen} onOpen={onOpen} onClose={onClose} />
    </>
  );
}

export default ScriptCard;
