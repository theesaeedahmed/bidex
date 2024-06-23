import { createContext, useEffect, useState } from "react";
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
    reload: reloadUser,
    error: userError,
    setError: setUserError,
    loading: userLoading,
  } = useUser(accessToken, storeRefreshToken);

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
      revokeRefreshToken(); // will log out user
      toast({
        description: `${error}.`,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } else {
      if (location.pathname === "/" || location.pathname === "/auth") {
        return;
      }

      console.log(`Unauthorized. Need to login before accessing this page.`);
      toast({
        description: `Unauthorized. Need to login before accessing this page.`,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
    console.log("navigating to auth signin");
    navigate("/auth");
    setLoading(false);
  }, [error]);

  return (
    <AuthContext.Provider
      value={{ accessToken, user, reloadUser, registerUser, loginUser }}
    >
      {!loading ? children : <Loading />}
    </AuthContext.Provider>
  );
};

export const AuthState = () => {
  return useContext(AuthContext);
};

export default AuthProvider;
