import { createContext, useState } from "react";
import { useContext } from "react";
import useUser from "../hooks/useUser";
import useAccessToken from "../hooks/useAccessToken";
import useRefreshToken from "../hooks/useRefreshToken";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {
    refreshToken,
    storeRefreshToken,
    loading: refreshTokenLoading,
    error: refreshTokenError,
  } = useRefreshToken();

  const {
    accessToken,
    loading: accessTokenLoading,
    error: accessTokenError,
  } = useAccessToken(refreshToken);

  const {
    user,
    setUser,
    allowUserFetch,
    preventUserFetch,
    registerUser,
    loginUser,
    reload: reloadUser,
    error: userError,
    loading: userLoading,
  } = useUser(accessToken, storeRefreshToken);

  return <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>;
};

export const AuthState = () => {
  return useContext(AuthContext);
};

export default AuthProvider;
