import { createContext, useEffect, useRef, useState } from "react";
import { useContext } from "react";
import useUser from "../hooks/useUser";
import useAccessToken from "../hooks/useAccessToken";
import useRefreshToken from "../hooks/useRefreshToken";
import Loading from "../Components/Miscellaneous/Loading";
import { useToast } from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const initialRender = useRef(true);
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    refreshToken,
    storeRefreshToken,
    revokeRefreshToken,
    loading: refreshTokenLoading,
    error: refreshTokenError,
    setError: setRefreshTokenError,
  } = useRefreshToken();

  const {
    accessToken,
    loading: accessTokenLoading,
    error: accessTokenError,
    setError: setAccessTokenError,
  } = useAccessToken(refreshToken);

  const {
    user,
    registerUser,
    loginUser,
    logoutUser,
    reload: reloadUser,
    error: userError,
    setError: setUserError,
    loading: userLoading,
  } = useUser(accessToken, storeRefreshToken, revokeRefreshToken);

  const resetErrors = () => {
    setAccessTokenError(null);
    setRefreshTokenError(null);
    setUserError(null);
  };

  useEffect(() => {
    if (refreshTokenLoading || accessTokenLoading || userLoading) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [refreshTokenLoading, accessTokenLoading, userLoading]);

  useEffect(() => {
    if (refreshTokenError || accessTokenError || userError) {
      setError(refreshTokenError || accessTokenError || userError);
      resetErrors();
    }
  }, [accessTokenError, refreshTokenError, userError]);

  useEffect(() => {
    if (!error) {
      return;
    }

    if (refreshToken) {
      revokeRefreshToken(); // will logout user
      toast({
        description: `${error}.`,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } else {
      if (
        location.pathname === "/" ||
        location.pathname === "/auth" ||
        location.pathname === "/auth/admin"
      ) {
        return;
      }

      toast({
        description: `Unauthorized. Need to login before accessing this page.`,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }

    navigate("/auth");
    setLoading(false);
  }, [error]);

  useEffect(() => {
    if (user && (location.pathname === "/" || location.pathname === "/auth")) {
      navigate("/home");
      console.log("here");
    } else if (user && location.pathname === "/auth/admin") {
      console.log("here");
      navigate("/admin");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }

    if (
      !refreshToken &&
      location.pathname !== "/" &&
      location.pathname !== "/auth"
    ) {
      navigate("/auth");
    }
  }, [user, navigate]);

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        user,
        reloadUser,
        registerUser,
        loginUser,
        logoutUser,
      }}
    >
      {!loading ? children : <Loading />}
    </AuthContext.Provider>
  );
};

export const AuthState = () => {
  return useContext(AuthContext);
};

export default AuthProvider;
