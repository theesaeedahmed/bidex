import { Box, Text } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { AuthState } from "../Context/AuthProvider";
import Loading from "../Components/Miscellaneous/Loading";
import Header from "../Components/Miscellaneous/Header";
import SideBar from "../Components/Admin/SideBar";

const AdminPage = () => {
  const { user, logoutUser } = AuthState();
  const [loading, setLoading] = useState(true);

  const [renderedComponent, setRenderedComponent] = useState(0);
  const [showSideBar, setShowSideBar] = useState(false);

  const components = [<Text>hello</Text>];

  const toggleSideBar = (e) => {
    setShowSideBar((currentState) => !currentState);
  };

  useEffect(() => {
    const logout = async () => {
      await logoutUser();
    };

    if (!user) {
      return;
    }

    if (user) {
      setLoading(false);
    }

    if (!user.isAdmin) {
      logout();
    }
  }, [user]);

  return !user ? (
    <Loading />
  ) : (
    <Box
      display={"flex"}
      flexDir={"column"}
      overflow={"scroll"}
      width={"100%"}
      height={"100vh"}
    >
      <Header
        isAdminPage={true}
        onSideBarIconClicked={toggleSideBar}
        sideBarOpen={showSideBar}
      />
      {showSideBar && (
        <SideBar isOpen={showSideBar} onClose={() => setShowSideBar(false)} />
      )}
      <Box bgColor={"white"} flex={1}>
        {components[renderedComponent]}
      </Box>
    </Box>
  );
};

export default AdminPage;
