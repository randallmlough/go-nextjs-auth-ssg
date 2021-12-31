import fetchJson from "@api/fetchJson";
import { useMountedState } from "@/hooks/use-mounted-state";
import { useState } from "react";
import { ResponseError } from "@api/error";
import { User } from "@/types/user";

export interface Credentials {
  email: string;
  password: string;
}

interface LoginRequest {
  loading: boolean;
  error: ResponseError;
  login: (credentials: Credentials) => Promise<User>;
}

export default function useAuthLogin(): LoginRequest {
  const [loading, setLoading] = useMountedState(false);
  const [error, setError] = useState<ResponseError>(null);
  const login = async (credentials: Credentials): Promise<User> => {
    setLoading(true);
    try {
      return await fetchJson("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    login,
    loading,
    error,
  };
}
