import { createContext, useState } from "react";
import { useContext } from "react";

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [liveMatches, setLiveMatches] = useState(null);
  const [myStocks, setMyStocks] = useState(null);

  return <UserContext.Provider value={{}}>{children}</UserContext.Provider>;
};

export const UserState = () => {
  return useContext(UserContext);
};

export default UserProvider;
