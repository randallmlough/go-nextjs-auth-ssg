import useSWR, { SWRResponse } from "swr";

export default function useAuthLogout() {
  return useSWR("/api/v1/auth/logout");
}
