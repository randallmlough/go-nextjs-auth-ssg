import { useForm } from "react-hook-form";
import { ResponseError } from "@api/error";
import { Input } from "@ui/forms/Input";
import useUserUpdate, { UserUpdateInput } from "@api/useUserUpdate";
import { User } from "@/types/user";

interface FormProps {
  id: string;
  defaultValues: User;
}
export default function ProfileForm({ id, defaultValues }: FormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: defaultValues,
  });
  const { request, loading, error } = useUserUpdate();
  return (
    <form
      id={id}
      className="space-y-6"
      autoComplete="off"
      onSubmit={handleSubmit(async (input: UserUpdateInput) => {
        const data = await request(input);
        if (error) {
          const err = error as ResponseError;
          if (err.status === 401) {
            alert("Invalid credentials");
          } else {
            alert("Something went wrong");
          }
        }
      })}
    >
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-3 sm:col-span-2">
          <Input
            id="name"
            type="text"
            autoComplete="name"
            register={register("name", {
              required: { value: true, message: "Name required" },
            })}
            error={errors.name}
          >
            <Input.Label>Name</Input.Label>
          </Input>
        </div>

        <div className="col-span-3 sm:col-span-2">
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
      </div>
    </form>
  );
}
