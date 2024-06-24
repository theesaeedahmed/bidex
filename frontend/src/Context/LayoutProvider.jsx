import { createContext, useContext, useEffect, useState } from "react";

const LayoutContext = createContext();

const LayoutProvider = ({ children }) => {
  const [screenWidth, setScreenWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <LayoutContext.Provider
      value={{
        screenWidth,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
};

export const LayoutState = () => {
  return useContext(LayoutContext);
};

export default LayoutProvider;
