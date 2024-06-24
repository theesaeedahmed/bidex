import React, { useEffect, useState } from "react";
import { AuthState } from "../Context/AuthProvider";
import axios from "axios";
import baseUrl from "../url";
import { useToast } from "@chakra-ui/react";

const useWallet = () => {
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadFlag, setReloadFlag] = useState(0);
  const toast = useToast();

  const { accessToken, user } = AuthState();

  const reload = () => {
    setReloadFlag((prevValue) => prevValue + 1);
  };

  const depositMoney = async (formData) => {
    try {
      if (!formData.amount || !formData.transactions || !formData.utr) {
        throw new Error(
          "Need amount, transaction screenshot and utr number to make deposit request."
        );
      }

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${accessToken}`,
        },
      };

      const response = await axios.post(
        `${baseUrl}/auth/transactions/deposit`,
        formData,
        config
      );

      if (response.data.success) {
        reload();
        toast({
          status: "success",
          description:
            "Deposit request made successfully. Your request will be reviewed by the admins.",
          duration: 5000,
        });
        return response.data;
      } else {
        throw new Error(response.data.message || "Deposit failed");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const withdrawMoney = async (amount) => {
    try {
      if (amount < wallet.balance) {
        throw new Error("Insufficient balance.");
      }

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      };

      const response = await axios.post(
        `${baseUrl}/auth/transactions/withdraw`,
        { amount },
        config
      );

      if (response.data.success) {
        reload();
        toast({
          status: "success",
          description:
            "Withdrawal request made successfully. Your request will be reviewed by the admins.",
          duration: 5000,
        });
        return response.data;
      } else {
        throw new Error(response.data.message || "Withdrawal failed");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    if (!user || !accessToken) {
      setWallet(null);
      return;
    }

    const getUserWallet = async () => {
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        };

        const response = await axios.get(`${baseUrl}/auth/wallet`, config);

        const userWallet = response.data.wallet;

        if (userWallet) {
          setWallet(userWallet);
        } else {
          throw new Error("User wallet doesn't exist.");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    getUserWallet();
  }, [user, reloadFlag]);

  return {
    wallet,
    depositMoney,
    withdrawMoney,
    loading,
    reload,
    error,
    setError,
  };
};

export default useWallet;
