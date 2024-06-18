import axios from "axios";
import { useEffect, useState } from "react";

const useAccessToken = (refreshToken) => {
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const expirationTime = useRef(0);
  const validityDuration = useRef(28 * 60 * 1000);

  useEffect(() => {
    if (!refreshToken) {
      setAccessToken(null);
      expirationTime.current = 0;

      return;
    }

    const getAccessToken = async () => {
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${refreshToken}`,
          },
        };

        const response = await axios.get(
          `${baseUrl}/auth/user/generate-token`,
          config
        );

        const currentAccessToken = response.data.accessToken;

        if (!currentAccessToken) {
          throw new Error(response.message);
        }

        setAccessToken(currentAccessToken);
        const currentTime = Date.now();
        expirationTime.current = currentTime + validityDuration.current;

        return currentAccessToken;
      } catch (error) {
        console.log(error);
        throw error;
      }
    };

    const checkAndRefreshAccessToken = async () => {
      try {
        const currentTime = Date.now();

        if (expirationTime.current - currentTime <= 310000) {
          const currentAccessToken = await getAccessToken();
          console.log("Access token refreshed:", currentAccessToken);
        }
      } catch (error) {
        setError(
          "Error is updating access token upon near to expiry, you are being logged out. Kindly login again to continue."
        );
        console.log("Error in check and refresh access token:", error);
      }
    };

    const fetchInitialAccessToken = async () => {
      try {
        await getAccessToken();
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialAccessToken();

    const interval = setInterval(() => {
      checkAndRefreshAccessToken();
    }, 300000);

    return () => clearInterval(interval);
  }, [refreshToken]);

  return { accessToken, loading, error };
};

export default useAccessToken;
