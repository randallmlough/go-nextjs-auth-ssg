import { Input } from "@ui/forms/Input";
import { Select } from "@ui/forms/Select";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthProvider";
import { ResponseError } from "@api/error";
import { AuthRegisterRequest } from "@/types/auth";
import { UserRoles } from "@components/PrivateRoute";

export default function AuthRegistrationFrom() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const { register: registerUser } = useAuth();
  return (
    <form
      className="space-y-6"
      autoComplete="off"
      onSubmit={handleSubmit(async (req: AuthRegisterRequest) => {
        const { error } = await registerUser(req);
        if (!error) {
          router.push("/dashboard");
        } else {
          const err = error as ResponseError;
          if (err.status === 401) {
          } else {
            alert("Something went wrong");
          }
        }
      })}
    >
      <div className="space-y-1">
        <Input
          id="name"
          type="text"
          autoComplete="off"
          register={register("name", {
            required: { value: true, message: "Name required" },
          })}
          error={errors.name}
        >
          <Input.Label>Name</Input.Label>
        </Input>
      </div>

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

      <div>
        <Select
          id="role"
          name="role"
          autoComplete="off"
          register={register("role", {
            required: { value: true, message: "Role required" },
          })}
          error={errors.role}
        >
          <Select.Label>Role</Select.Label>
          <Select.Hint>To test different access levels</Select.Hint>
          {[UserRoles.CONTRIBUTOR, UserRoles.RESTRICTED].map((item, i) => (
            <Select.Option key={i}>{item}</Select.Option>
          ))}
        </Select>
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
          Register
        </button>
      </div>
    </form>
  );
}
