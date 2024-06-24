import { Box, Divider } from "@chakra-ui/react";
import React from "react";
import Nav from "../Miscellaneous/Nav";

const Navbar = ({ setRenderedComponent }) => {
  const handleNavClicked = (e) => {
    setRenderedComponent(e.target.value);
  };

  return (
    <Box
      display={"flex"}
      width={"100%"}
      justifyContent={"space-between"}
      bgColor={"inherit"}
      boxShadow={"2px 2px 1px 1px black"}
    >
      <Nav value={0} handleClick={handleNavClicked}>
        In Play
      </Nav>
      <Divider orientation={"vertical"} />
      <Nav value={1} handleClick={handleNavClicked}>
        My Stocks
      </Nav>
      <Divider orientation={"vertical"} />
      <Nav value={2} handleClick={handleNavClicked}>
        Upcoming
      </Nav>
      <Divider orientation={"vertical"} />
      <Nav value={3} handleClick={handleNavClicked}>
        Contact Us
      </Nav>
    </Box>
  );
};

export default Navbar;
