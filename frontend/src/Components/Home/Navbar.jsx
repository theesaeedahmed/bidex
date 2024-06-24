import { Box, Divider } from "@chakra-ui/react";
import React, { useState } from "react";
import Nav from "../Miscellaneous/Nav";

const Navbar = ({ setRenderedComponent }) => {
  const [activeNav, setActiveNav] = useState(0);
  const handleNavClicked = (value) => {
    setActiveNav(value);
    setRenderedComponent(value);
  };

  return (
    <Box
      display={"flex"}
      width={"100%"}
      justifyContent={"space-between"}
      bgColor={"lightblue"}
      boxShadow={"2px 2px 1px 1px black"}
    >
      <Nav value={0} handleClick={handleNavClicked} isActive={activeNav === 0}>
        In Play
      </Nav>
      <Divider orientation={"vertical"} />
      <Nav value={1} handleClick={handleNavClicked} isActive={activeNav === 1}>
        My Stocks
      </Nav>
      <Divider orientation={"vertical"} />
      <Nav value={2} handleClick={handleNavClicked} isActive={activeNav === 2}>
        Upcoming
      </Nav>
      <Divider orientation={"vertical"} />
      <Nav value={3} handleClick={handleNavClicked} isActive={activeNav === 3}>
        Contact Us
      </Nav>
    </Box>
  );
};

export default Navbar;
