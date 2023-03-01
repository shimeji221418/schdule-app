"use client";
import { app } from "../../firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import React, {
  createContext,
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { LoginUserType } from "@/types/api/user";
import { BaseClientWithAuth, BaseClientWithAuthType } from "@/lib/api/client";
import { Text } from "@chakra-ui/react";

export type AuthContextType = {
  loginUser: LoginUserType;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
};

type Props = {
  children: ReactNode;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider: FC<Props> = ({ children }) => {
  const auth = getAuth(app);
  const router = useRouter();
  const pathname = usePathname();
  const [loginUser, setLoginUser] = useState(null);
  const [loading, setLoading] = useState<boolean>(true);
  const value = {
    loginUser,
    setLoading,
    loading,
  };
  const isLoginOrSignUpPage: boolean =
    pathname === "/login" || pathname === "/signup";

  useEffect(() => {
    const onCurrentUser = async () => {
      try {
        const token = await auth.currentUser?.getIdToken(true);
        const data = { uid: auth.currentUser?.uid };
        if (auth.currentUser) {
          const config: BaseClientWithAuthType = {
            method: "get",
            url: "/users/current",
            token: token!,
            params: data,
          };
          const res = await BaseClientWithAuth(config);
          setLoginUser(res.data);
          console.log(res.data);
        }
        setLoading(false);
      } catch (e) {
        console.log(e);
      }
    };

    const unsubscribed = onAuthStateChanged(auth, (resultUser) => {
      if (isLoginOrSignUpPage && resultUser) {
        router.push("/");
      }
      if (!isLoginOrSignUpPage && resultUser == null) {
        router.push("/login");
      }
      onCurrentUser();
    });
    unsubscribed();
  }, []);

  if (loading) {
    return (
      <>
        <Text>loading...</Text>
      </>
    );
  } else {
    return (
      <>
        <AuthContext.Provider value={value}>
          {!loading && children}
        </AuthContext.Provider>
      </>
    );
  }
};

export default AuthProvider;
