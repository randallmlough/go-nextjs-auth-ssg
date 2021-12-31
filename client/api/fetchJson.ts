import { ResponseError } from "@api/error";

const fetcher = async (request: RequestInfo, opts?: RequestInit) => {
  const res = await fetch(request, opts);

  // If the status code is not in the range 200-299,
  // we still try to parse and throw it.
  const data = await res.json();
  if (!res.ok) {
    const msg = data.error || "An error occurred while fetching the data.";
    const error = new ResponseError(msg);
    // Attach extra info to the error object.
    error.status = res.status;
    throw error;
  }

  return data;
};

export default fetcher;
