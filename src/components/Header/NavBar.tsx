import { Stack, Text, Image, Box } from "@chakra-ui/react";
import React from "react";
import { SiNasa } from "react-icons/si";
import { FaShuttleSpace } from "react-icons/fa6";

function NavBar() {
  return (
    <div>
      {" "}
      <Stack
        backgroundColor={"black"}
        bgImage={
          "https://64.media.tumblr.com/8fa6c3c3666978087f91228153067a90/tumblr_p6pjimf5HP1xp1j77o1_500.gif"
        }
      >
        <Box paddingX={8}>
          <SiNasa color="white" size={200} />
          {/* <Text fontSize="6xl" textColor={"white"}>
          NASA Dashboard
        </Text> */}
        </Box>
      </Stack>
    </div>
  );
}

export default NavBar;
