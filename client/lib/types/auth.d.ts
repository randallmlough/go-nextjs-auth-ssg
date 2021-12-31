import { User } from "@/types/user";

export interface AuthLoginCredentials {
  email: string;
  password: string;
}

export interface AuthRegisterRequest {
  name: string;
  email: string;
  password: string;
}

export type AuthRegisterResponse = {
  user?: User;
  error?: Error;
};
