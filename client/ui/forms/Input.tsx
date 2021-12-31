import React, { useState, createContext, useEffect } from "react";
import { randomString } from "@/utils/rand";
import { classNames } from "@/utils/classnames";
import { Label as LabelComponent } from "@ui/forms/Label";
import { InputError } from "@ui/forms/InputError";
import { ExclamationCircleIcon } from "@heroicons/react/solid";

interface IProps {
  id: string;
  register?: any;
}
const InputContext = createContext(null);

function useInputContext() {
  const context = React.useContext(InputContext);
  if (!context) {
    throw new Error(
      `Input components cannot be rendered outside the Input component`
    );
  }
  return context;
}

const baseClasses =
  "appearance-none block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none sm:text-sm";
const defaultState =
  "border-gray-300 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 ";
const errorState =
  "border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500";

export function Input({
  register,
  optional = false,
  id = randomString(4),
  error = null,
  children = null,
  ...rest
}) {
  const [inputError, setError] = useState(null);

  useEffect(() => {
    setError(error);
  }, [error]);

  let withField = false;
  const Components = React.Children.map(children, (child) => {
    let props: IProps = {
      id: id,
    };
    const componentName = child.type.displayName;
    if (componentName === Field.displayName) {
      withField = true;
      props = { register: register, ...props, ...rest };
    }
    return React.cloneElement(child, props);
  });

  const value = React.useMemo(() => ({ inputError }), [inputError]);
  return (
    <InputContext.Provider value={value}>
      <div>
        {Components}
        {!withField && <Field id={id} register={register} {...rest} />}
        {inputError && <InputError>{inputError.message}</InputError>}
      </div>
    </InputContext.Provider>
  );
}
Input.displayName = "Input";

export const Field = (props) => {
  const { id, register, ...rest } = props;
  const { inputError } = useInputContext();
  return (
    <div className="mt-1 relative rounded-md shadow-sm">
      <input
        id={id}
        aria-describedby={id + "-text"}
        aria-invalid={inputError?.message !== ""}
        className={classNames(
          baseClasses,
          inputError ? errorState : defaultState
        )}
        {...register}
        {...rest}
      />
      {inputError && (
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <ExclamationCircleIcon
            className="h-5 w-5 text-red-500"
            aria-hidden="true"
          />
        </div>
      )}
    </div>
  );
};
Field.displayName = "InputField";

const Hint = (props) => {
  const { id, children, ...rest } = props;
  return (
    <span className="text-sm text-gray-500" id={id + "-hint"} {...rest}>
      {children}
    </span>
  );
};
Hint.displayName = "InputHint";

Input.Label = LabelComponent;
Input.Field = Field;
Input.Hint = Hint;
