import React from "react";

export const InputError = ({ children, ...props }) => {
  return (
    <p className="mt-2 text-sm text-red-600" id="email-error" {...props}>
      {children}
    </p>
  );
};
