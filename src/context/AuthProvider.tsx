import React from "react";
import { authObject } from "../config/constants.ts";
import User from "../entities/User.ts";



type AuthContextType = {
  auth: authObject;
  setAuth: React.Dispatch<React.SetStateAction<authObject>>;
  persist: boolean;
  setPersist: React.Dispatch<React.SetStateAction<boolean>>;
}

const defaultAuthObject: authObject = {
  token: null,
  user: null,
};

const AuthContext = React.createContext<AuthContextType>({
  auth: defaultAuthObject,
  setAuth: () => {},
  persist: false,
  setPersist: () => {}
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [auth, setAuth] = React.useState<authObject>(defaultAuthObject);
  const [persist, setPersist] = React.useState<boolean>(() => {
    const storedPersist = localStorage.getItem("persist");
    return storedPersist ? JSON.parse(storedPersist) : false;
  });

  return (
    <AuthContext.Provider value={{ auth, setAuth, persist, setPersist }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
