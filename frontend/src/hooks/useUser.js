import { useEffect, useRef, useState } from "react";
import axios from "axios";
import baseUrl from "../url";

const useUser = (accessToken) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadFlag, setReloadFlag] = useState(0);
  const preventExecution = useRef(false);

  const registerUser = async (userData) => {
    try {
      const response = await axios.post(
        `${baseUrl}/api/user/register`,
        userData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
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
    if (preventExecution.current) {
      return;
    }

    if (!accessToken) {
      setUser(null);
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

        const response = await axios.get(`${baseUrl}/profile`, config);

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
    setUser,
    loading,
    error,
    reload,
    preventUserFetch,
    allowUserFetch,
    registerUser,
    loginUser,
  };
};

export default useUser;
