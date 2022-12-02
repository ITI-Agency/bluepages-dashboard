import * as React from "react";

const loadingContext = React.createContext();

export function LoadingProvider({ children }) {
  const [loading, setLoading] = React.useState(false);
  return (
    <loadingContext.Provider value={{ loading, setLoading }}>{children}</loadingContext.Provider>
  );
}

export default function LoadingConsumer() {
  return React.useContext(loadingContext);
}
