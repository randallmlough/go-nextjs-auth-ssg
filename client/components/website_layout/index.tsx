import DemoBar from "@components/demo-bar";
import Navbar from "./navbar";
import { LayoutProps } from "@/types/props";

export default function WebsiteLayout({
  hideNav = false,
  children,
}: LayoutProps) {
  return (
    <>
      <DemoBar />
      {!hideNav && <Navbar />}
      {children}
    </>
  );
}
