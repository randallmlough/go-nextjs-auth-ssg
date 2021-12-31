import React, { useState, createContext, useEffect } from "react";
import { randomString } from "@/utils/rand";
import { classNames } from "@/utils/classnames";
import { Label as LabelComponent } from "@ui/forms/Label";
import { ExclamationCircleIcon } from "@heroicons/react/solid";
import { Field } from "@ui/forms/Input";

interface IProps {
  id: string;
  register?: any;
}
const SelectContext = createContext(null);

function useSelectContext() {
  const context = React.useContext(SelectContext);
  if (!context) {
    throw new Error(
      `Select components cannot be rendered outside the Select component`
    );
  }
  return context;
}

const baseClasses =
  "block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm";
const defaultState =
  "border-gray-300 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 ";
const errorState =
  "border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500";

export function Select({
  register,
  optional = false,
  id = randomString(4),
  error = null,
  children = null,
  ...rest
}) {
  const [selectError, setError] = useState(null);

  useEffect(() => {
    setError(error);
  }, [error]);

  const Options: Array<JSX.Element> = [];
  const Components = React.Children.map(children, (child) => {
    let props: IProps = {
      id: id,
    };
    const componentName = child.type.displayName;
    if (componentName === SelectOption.displayName) {
      Options.push(React.cloneElement(child, {}));
    } else {
      return React.cloneElement(child, props);
    }
  });

  const value = React.useMemo(() => ({ selectError }), [selectError]);
  return (
    <SelectContext.Provider value={value}>
      <div>
        {Components}
        <SelectField id={id} register={register} {...rest}>
          {Options}
        </SelectField>
        {selectError && <SelectError>{selectError.message}</SelectError>}
      </div>
    </SelectContext.Provider>
  );
}
Select.displayName = "Select";

const SelectField = (props) => {
  const { id, register, children, ...rest } = props;
  const { selectError } = useSelectContext();
  return (
    <div className="mt-1 relative rounded-md shadow-sm">
      <select
        id={id}
        aria-describedby={id + "-select"}
        aria-invalid={selectError?.message !== ""}
        className={classNames(
          baseClasses
          // selectError ? errorState : defaultState
        )}
        {...register}
        {...rest}
      >
        {children}
      </select>
    </div>
  );
};
SelectField.displayName = "SelectField";

const SelectOption = ({ children, ...props }) => {
  return <option {...props}>{children}</option>;
};
SelectOption.displayName = "SelectOption";

const Hint = (props) => {
  const { id, children, ...rest } = props;
  return (
    <span className="text-sm text-gray-500" id={id + "-hint"} {...rest}>
      {children}
    </span>
  );
};
Hint.displayName = "SelectHint";

Select.Label = LabelComponent;
Select.Option = SelectOption;
Select.Hint = Hint;

const SelectError = ({ children, ...props }) => {
  return (
    <p className="mt-2 text-sm text-red-600" id="email-error" {...props}>
      {children}
    </p>
  );
};
