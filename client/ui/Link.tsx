import NextLink from "next/link";

const linkClasses =
  "inline-flex px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700";

export default function Link({ href, children, ...props }) {
  return (
    <NextLink href={href}>
      <a className={linkClasses} {...props}>
        {children}
      </a>
    </NextLink>
  );
}

export const ExternalLink = ({ href, children, ...props }) => {
  return (
    <a
      href={href}
      className={linkClasses}
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    >
      {children}
    </a>
  );
};
