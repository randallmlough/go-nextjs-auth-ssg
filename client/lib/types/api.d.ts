export type RequestOptions = {
  redirectTo?: string;
  redirectIfFound?: boolean;
};

export type RequestResponse = {
  data?: any;
  error?: Error;
};
