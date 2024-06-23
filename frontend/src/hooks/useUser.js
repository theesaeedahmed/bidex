import { useEffect, useRef, useState } from "react";
import axios from "axios";
import baseUrl from "../url";

const useUser = (accessToken, storeRefreshToken) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadFlag, setReloadFlag] = useState(0);
  const preventExecution = useRef(false);

  const registerUser = async ({ email, username, password }) => {
    try {
      const response = await axios.post(
        `${baseUrl}/api/user/register`,
        { email, username, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success === true) {
        await loginUser({ email, username, password });
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const loginUser = async ({ email, password, username }) => {
    try {
      const response = await axios.post(
        `${baseUrl}/api/user/login`,
        { email, username, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const refreshToken = response.data.refreshToken;
      const userProfileInfo = response.data.user;

      storeRefreshToken(refreshToken);
      setUser(userProfileInfo);

      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const preventUserFetch = () => {
    preventExecution.current = true;
  };

  const allowUserFetch = () => {
    preventExecution.current = false;
  };

  const reload = () => {
    allowUserFetch();
    setReloadFlag((prevValue) => prevValue + 1);
  };

  useEffect(() => {
    if (!accessToken) {
      setUser(null);
      setLoading(false);
      return;
    }

    if (preventExecution.current) {
      return;
    }

    const getUserData = async () => {
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        };

        const response = await axios.get(
          `${baseUrl}/auth/user/profile`,
          config
        );

        const userData = response?.data?.user;

        if (userData) {
          setUser(userData);
        } else {
          throw new Error("User not found");
        }
      } catch (err) {
        setError("Error while fetching user data");
      } finally {
        preventUserFetch();
        setLoading(false);
      }
    };

    getUserData();
  }, [accessToken, reloadFlag]);

  return {
    user,
    loading,
    error,
    setError,
    reload,
    registerUser,
    loginUser,
  };
};

export default useUser;
