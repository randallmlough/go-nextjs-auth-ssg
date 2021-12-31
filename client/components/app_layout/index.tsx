import DemoBar from "@components/demo-bar";
import Navbar from "./navbar";
import { LayoutProps } from "@/types/props";
import Sidebar from "@components/app_layout/sidebar";

export default function AppLayout({ hideNav = false, children }: LayoutProps) {
  return (
    <>
      <DemoBar />
      {!hideNav && <Navbar />}
      <div className="container py-16 lg:grid lg:grid-cols-12 lg:gap-x-5">
        <Sidebar />
        <div className="space-y-6 sm:px-6 lg:px-0 lg:col-span-9">
          {children}
        </div>
      </div>
    </>
  );
}
