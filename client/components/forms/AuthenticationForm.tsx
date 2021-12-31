import { Input } from "@ui/forms/Input";
import { useForm } from "react-hook-form";
import { Credentials } from "@api/useAuthLogin";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthProvider";
import { ResponseError } from "@api/error";

export default function AuthenticationFrom() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const { login } = useAuth();
  return (
    <form
      className="space-y-6"
      autoComplete="off"
      onSubmit={handleSubmit(async (creds: Credentials) => {
        const { error } = await login(creds);
        if (!error) {
          router.push("/dashboard");
        } else {
          const err = error as ResponseError;
          if (err.status === 401) {
            alert("Invalid credentials");
          } else {
            alert("Something went wrong");
          }
        }
      })}
    >
      <div>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          register={register("email", {
            required: { value: true, message: "Email required" },
          })}
          error={errors.email}
        >
          <Input.Label>Email</Input.Label>
        </Input>
      </div>

      <div className="space-y-1">
        <Input
          id="password"
          type="password"
          autoComplete="off"
          register={register("password", {
            required: { value: true, message: "Password required" },
          })}
          error={errors.password}
        >
          <Input.Label>Password</Input.Label>
        </Input>
      </div>

      <div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Sign in
        </button>
      </div>
    </form>
  );
}
