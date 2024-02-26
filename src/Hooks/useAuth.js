import * as React from "react";
import { useNavigate, useLocation } from "react-router-dom";
const authContext = React.createContext();

function useAuth() {
  const [authed, setAuthed] = React.useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    handleAuthorization();
  }, []);

  const handleAuthorization = () => {
    if (localStorage.getItem("AUTH_JWT") && location.pathname == "/sign-in") {
      setAuthed(true);
      navigate("dashboard");
    } else if (!localStorage.getItem("AUTH_JWT")) {
      setAuthed(false);
      navigate("/sign-in");
    } else {
      setAuthed(true);
    }
  };

  return {
    authed,
    login() {
      return new Promise((res) => {
        setAuthed(true);
        res();
      });
    },
    logout() {
      return new Promise((res) => {
        setAuthed(false);
        res();
      });
    },
  };
}

export function AuthProvider({ children }) {
  const auth = useAuth();

  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export default function AuthConsumer() {
  return React.useContext(authContext);
}
