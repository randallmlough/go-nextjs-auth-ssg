import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { User } from "@/types/user";
import { useMountedState } from "@/hooks/use-mounted-state";
import fetchJson from "@api/fetchJson";
import useSWR from "swr";
import {
  AuthLoginCredentials,
  AuthRegisterRequest,
  AuthRegisterResponse,
} from "@/types/auth";

import { RequestResponse } from "@/types/api";
import { UserRoles } from "@components/PrivateRoute";

export interface Auth {
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  user: User;
  role: Array<string>;
  logout: () => void;
  login: (credentials: AuthLoginCredentials) => RequestResponse;
  register: (req: AuthRegisterRequest) => AuthRegisterResponse;
}

export const AuthContext = createContext<Auth>(undefined);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider(props) {
  const [loading, setLoading] = useMountedState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [user, setUser] = useState<User>(null);
  const [role, setRole] = useState<Array<UserRoles>>([]);
  const { error, isValidating, mutate } = useSWR("current_user", async () => {
    const res = await fetch("/api/v1/auth/check");
    // If the status code is not in the range 200-299,
    // we still try to parse and throw it.
    if (!res.ok) return null;
    const data = await res.json();
    if (data?.user) {
      setIsAuthenticated(true);
      setUser(data.user);
    }
    if (data?.role) {
      if (Array.isArray(data?.role)) {
        data.role.forEach((r) => {
          if (r === UserRoles.ADMIN) setIsAdmin(true);
        });
        setRole(data.role);
      } else {
        setRole([data.role]);
      }
    }
    return data;
  });
  useEffect(() => {
    if (!user && !isValidating) {
      setIsAuthenticated(false);
    }
  }, [user, isValidating]);

  useEffect(() => {
    if (user?.role === UserRoles.ADMIN) setIsAdmin(true);
  }, [user?.role]);

  const login = useCallback(
    async (credentials: AuthLoginCredentials): Promise<RequestResponse> => {
      setLoading(true);
      return await fetchJson("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      })
        .then((res) => {
          console.log("pre", res);
          setIsAuthenticated(true);
          return { data: res, error: null };
        })
        .catch((err) => {
          return { data: null, error: err };
        })
        .finally(() => {
          setLoading(false);
        });
    },
    []
  );

  const logout = useCallback(() => {
    fetch("/api/v1/auth/logout", {
      method: "DELETE",
    }).then(() => {
      setIsAuthenticated(false);
      mutate(null);
    });
  }, []);

  const register = useCallback(
    async (request: AuthRegisterRequest): Promise<AuthRegisterResponse> => {
      setLoading(true);
      return await fetchJson("/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      })
        .then((res): AuthRegisterResponse => {
          const user = res.user;
          mutate(user);
          setIsAuthenticated(true);
          return { user };
        })
        .catch((err): AuthRegisterResponse => {
          return { error: err };
        })
        .finally(() => {
          setLoading(false);
        });
    },
    []
  );

  return (
    <AuthContext.Provider
      value={{
        isLoading: isValidating,
        isAuthenticated,
        isAdmin,
        error,
        user,
        role,
        login,
        logout,
        register,
      }}
      {...props}
    />
  );
}
