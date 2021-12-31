import Link from "next/link";
import { useAuth } from "@/contexts/AuthProvider";
import { menuItem } from "@/types/lists";

const authenticatedMenu: Array<menuItem> = [
  {
    text: "Login",
    href: "/login",
  },
  {
    text: "Register",
    href: "/register",
  },
];

export default function Navbar() {
  const { logout, isAuthenticated } = useAuth();

  return (
    <div className="container h-14 flex items-center">
      <nav className="ml-auto py-2">
        <ul className="flex space-x-4 text-gray-600">
          {!isAuthenticated ? (
            authenticatedMenu.map(({ text, href }, i) => (
              <li key={i}>
                <Link href={href}>
                  <a className="text-gray-600">{text}</a>
                </Link>
              </li>
            ))
          ) : (
            <li>
              <button onClick={logout} className="text-gray-600">
                Logout
              </button>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
}
