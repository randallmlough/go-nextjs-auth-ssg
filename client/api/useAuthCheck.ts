import useSWR from "swr";

export default function useAuthCheck() {
  const {
    data: user,
    error,
    isValidating,
  } = useSWR("/api/v1/auth/check", async (url) => {
    const res = await fetch(url);
    // If the status code is not in the range 200-299,
    // we still try to parse and throw it.
    if (!res.ok) return null;
    const data = await res.json();
    if (data?.user) return data.user;
    return null;
  });

  return { user, error, isValidating };
}
