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
} from "@chakra-ui/react";

function ScriptCard(props: {
  file_name: any;
  author: any;
  description: any;
  libraries: any;
  snippets: any;
}) {
  const { file_name, author, description, libraries, snippets } = props;

  return (
    <>
      <Card width={"35vh"} marginX={4} backgroundColor={"black"}>
        <CardHeader>
          <Heading size="md" textColor={"white"}>
            {file_name}
          </Heading>
          <Text size="xs" textColor={"white"}>
            {author}
          </Text>
        </CardHeader>
        <CardBody>
          <Text textColor={"white"}>{description}</Text>
        </CardBody>
        <CardFooter>
          <Button>Run Script</Button>
        </CardFooter>
      </Card>
    </>
  );
}

export default ScriptCard;
