import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const useRefreshToken = () => {
  const [refreshToken, setRefreshToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();

  const storeRefreshToken = (token) => {
    localStorage.setItem("refresh_token", token);
    setRefreshToken(token);
  };

  useEffect(() => {
    const getRefreshToken = async () => {
      try {
        const currentRefreshToken = localStorage.getItem("refresh_token");
        if (currentRefreshToken) {
          setRefreshToken(currentRefreshToken);

          return;
        }

        localStorage.removeItem("refresh_token");
        setRefreshToken(null);

        if (location.pathname !== "/auth" && location.pathname !== "/") {
          throw new Error(
            "Unauthorized. Need to log in in order to access this page."
          );
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    getRefreshToken();
  }, []);

  return { refreshToken, storeRefreshToken, loading, error };
};

export default useRefreshToken;
