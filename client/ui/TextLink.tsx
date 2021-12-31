import React from "react";

interface Props {
  href: string;
  onClick: () => {};
}
export const TextLink = React.forwardRef<
  HTMLAnchorElement & HTMLDivElement,
  Props
>(({ href, onClick, children }, ref) => (
  <a
    href={href}
    onClick={onClick}
    ref={ref}
    className="font-medium text-indigo-600 hover:text-indigo-500"
  >
    {children}
  </a>
));
TextLink.displayName = "TextLink";
