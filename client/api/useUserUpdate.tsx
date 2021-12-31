import fetchJson from "@api/fetchJson";
import { useMountedState } from "@/hooks/use-mounted-state";
import { useState } from "react";
import { ResponseError } from "@api/error";
import { User } from "@/types/user";

export interface UserUpdateInput {
  name: string;
  email: string;
}

interface UserUpdateRequest {
  loading: boolean;
  error: ResponseError;
  request: (req: UserUpdateInput) => Promise<User>;
}

export default function useUserUpdate(): UserUpdateRequest {
  const [loading, setLoading] = useMountedState(false);
  const [error, setError] = useState<ResponseError>(null);
  const request = async (req: UserUpdateInput): Promise<User> => {
    setLoading(true);
    try {
      return await fetchJson("/api/v1/user", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req),
      });
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    request,
    loading,
    error,
  };
}
