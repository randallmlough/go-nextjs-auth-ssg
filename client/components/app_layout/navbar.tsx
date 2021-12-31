import { useAuth } from "@/contexts/AuthProvider";

export default function Navbar() {
  const { logout } = useAuth();

  return (
    <div className="container h-14 flex items-center">
      <nav className="ml-auto py-2">
        <ul className="flex space-x-4 text-gray-600">
          <li>
            <button onClick={logout} className="text-gray-600">
              Logout
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}
