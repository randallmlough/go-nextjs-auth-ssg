import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthProvider";
import Loader from "@components/loader";

export const enum UserRoles {
  ADMIN = "ADMIN",
  CONTRIBUTOR = "CONTRIBUTOR",
  RESTRICTED = "RESTRICTED",
}
interface PrivateRouteProps {
  isPublic?: boolean;
  children: JSX.Element;
  requiredUserRoles?: Array<UserRoles>;
}
export default function PrivateRoute({
  isPublic = false,
  requiredUserRoles = [],
  children,
}: PrivateRouteProps) {
  const router = useRouter();
  const { role, isAuthenticated, isLoading } = useAuth();
  const [currentRoute, setCurrentRoute] = useState<string>(router.asPath);

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isPublic) {
      router.push("/login");
    } else if (
      requiredUserRoles.length &&
      requiredUserRoles.indexOf(role[0] as UserRoles) === -1
    ) {
      if (router.asPath === currentRoute) router.push("/");
      else router.push(currentRoute);
      alert("You dont have access to this resource");
    }
  }, [isLoading, isAuthenticated, isPublic, requiredUserRoles]);

  useEffect(() => {
    setCurrentRoute(router.asPath);
  }, [router.asPath]);
  if (!isAuthenticated && !isPublic) {
    return <Loader />;
  }

  return children;
}
