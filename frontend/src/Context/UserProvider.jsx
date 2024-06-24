import { createContext, useEffect, useState } from "react";
import { useContext } from "react";
import useWallet from "../hooks/useWallet";
import Loading from "../Components/Miscellaneous/Loading";
import { useToast } from "@chakra-ui/react";
import { AuthState } from "./AuthProvider";

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const { user, accessToken } = AuthState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liveMatches, setLiveMatches] = useState(null);
  const [myStocks, setMyStocks] = useState(null);
  const toast = useToast();

  const {
    wallet,
    loading: walletLoading,
    reload: reloadWallet,
    error: walletError,
    setError: setWalletError,
  } = useWallet();

  const resetErrors = () => {
    setWalletError(null);
  };

  useEffect(() => {
    if (!walletLoading) {
      setLoading(false);
    }
  }, [walletLoading]);

  useEffect(() => {
    if (!accessToken && !user) {
      setLoading(false);
    }
  }, [accessToken, user]);

  useEffect(() => {
    if (walletError) {
      setError(walletError);
      resetErrors();
    }
  }, [walletError]);

  useEffect(() => {
    if (error) {
      toast({
        description: `${error}`,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  }, [error]);

  return (
    <UserContext.Provider value={{ wallet, reloadWallet }}>
      {!loading ? children : <Loading />}
    </UserContext.Provider>
  );
};

export const UserState = () => {
  return useContext(UserContext);
};

export default UserProvider;
