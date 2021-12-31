import Link from "next/link";
import { classNames } from "@/utils/classnames";
import {
  ViewGridAddIcon,
  DocumentAddIcon,
  BanIcon,
  UserCircleIcon,
  LockClosedIcon,
} from "@heroicons/react/outline";
import Divider from "@ui/Divider";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthProvider";

interface SidebarMenu {
  href: string;
  text: string;
  isCurrent?: boolean;
  icon: any;
}

const sidebarMenu: Array<SidebarMenu> = [
  {
    text: "Dashboard",
    icon: ViewGridAddIcon,
    href: "/dashboard",
  },
  {
    text: "Profile",
    icon: UserCircleIcon,
    href: "/profile",
  },
];

const rbacMenu: Array<SidebarMenu> = [
  {
    text: "Contributor",
    icon: DocumentAddIcon,
    href: "/contributor",
  },
  {
    text: "Restricted",
    icon: BanIcon,
    href: "/restricted",
  },
];

const SidebarNavItem = ({ href, text, isCurrent, icon: Icon }: SidebarMenu) => {
  return (
    <Link href={href}>
      <a
        className={classNames(
          isCurrent
            ? "bg-gray-50 text-blue-700 hover:text-blue-700 hover:bg-white"
            : "text-gray-900 hover:text-gray-900 hover:bg-gray-50",
          "group rounded-md px-3 py-2 flex items-center text-sm font-medium"
        )}
        aria-current={isCurrent ? "page" : undefined}
      >
        <Icon
          className={classNames(
            isCurrent
              ? "text-blue-500 group-hover:text-blue-500"
              : "text-gray-400 group-hover:text-gray-500",
            "flex-shrink-0 -ml-1 mr-3 h-6 w-6"
          )}
          aria-hidden="true"
        />
        <span className="truncate">{text}</span>
      </a>
    </Link>
  );
};
export default function Sidebar() {
  const router = useRouter();

  const { isAdmin } = useAuth();
  return (
    <aside className="py-6 px-2 sm:px-6 lg:py-0 lg:px-0 lg:col-span-3">
      <nav className="space-y-1">
        {sidebarMenu.map((item, i) => {
          const isCurrent = router.asPath === item.href;
          return <SidebarNavItem key={i} isCurrent={isCurrent} {...item} />;
        })}
        <div className="pt-7 pb-3 w-3/4">
          <Divider>Access Level</Divider>
        </div>

        {rbacMenu.map((item, i) => {
          const isCurrent = router.asPath === item.href;
          return <SidebarNavItem key={i} isCurrent={isCurrent} {...item} />;
        })}
        {isAdmin && (
          <SidebarNavItem
            isCurrent={router.asPath === "/admin"}
            text="Admin"
            icon={LockClosedIcon}
            href="/admin"
          />
        )}
      </nav>
    </aside>
  );
}
