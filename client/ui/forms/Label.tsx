import React from "react";
import { ComponentHash } from "@/utils/componentHash";

export const Label = (props) => {
  const { id, children, error, ...rest } = props;
  const components = new ComponentHash(children);
  const withHint = components.get(Hint);
  return (
    <>
      {withHint ? (
        <div className="flex justify-between">
          <label
            htmlFor={`${id}-label"`}
            className="block text-sm font-medium text-gray-700"
            {...rest}
          >
            {children[0]}
          </label>
          {withHint}
        </div>
      ) : (
        <label
          htmlFor={`${id}-label"`}
          className="block text-sm font-medium text-gray-700"
          {...rest}
        >
          {children}
        </label>
      )}
    </>
  );
};
Label.displayName = "Label";

const Hint = (props) => {
  const { id, children, ...rest } = props;
  return (
    <span className="text-sm text-gray-500" id={id + "-hint"} {...rest}>
      {children}
    </span>
  );
};
Hint.displayName = "LabelHint";

const Error = ({ id, children, ...props }) => {
  return (
    <span className="text-sm text-red-600" id={id + "-hint"} {...props}>
      {children}
    </span>
  );
};
Error.displayName = "LabelError";

Label.WithHint = Hint;
Label.WithError = Error;
