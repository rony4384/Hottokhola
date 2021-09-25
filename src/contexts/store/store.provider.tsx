import React from "react";

import Cookie from "js-cookie";
import { StyleSheetManager } from "styled-components";

const StoreContext = React.createContext({} as any);

export const StoreProvider = ({ children }) => {
  const [store, setStore] = React.useState(0);
  const changeStore = (newStore): void => {
    setStore(newStore);
    Cookie.set("store", newStore);
  };
  React.useEffect(() => {
    const storeSetting = Cookie.get("store");
    if (storeSetting) {
      setStore(Number(storeSetting));
    }
  }, [store]);

  return (
    <StoreContext.Provider value={{ store, changeStore }}>
      <StyleSheetManager stylisPlugins={[]}>{children}</StyleSheetManager>
    </StoreContext.Provider>
  );
};

export const useStore = () => React.useContext(StoreContext);
